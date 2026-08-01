import { connectLambda, getStore } from "@netlify/blobs";

import {
  generateHiringConfirmationPdf,
  getHiringPdfFilename,
} from "./lib/hiring-pdf.mjs";

const hiringStoreName = "tara-hiring-confirmations";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function getHiringStore(event) {
  if (event.blobs) {
    connectLambda(event);
  }

  return getStore(hiringStoreName);
}

function getSubmissionKey(id) {
  const normalizedId = String(id || "").trim();

  if (!/^[a-zA-Z0-9._-]+$/.test(normalizedId)) {
    return "";
  }

  return `submissions/${normalizedId}.json`;
}

function isAuthorized(event, submission) {
  const authHeader = event.headers.authorization ?? event.headers.Authorization ?? "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const queryToken = event.queryStringParameters?.token ?? "";
  const accessToken = event.queryStringParameters?.access ?? "";
  const adminToken = process.env.HIRING_ADMIN_TOKEN ?? "";

  if (adminToken && (bearerToken === adminToken || queryToken === adminToken)) {
    return true;
  }

  return Boolean(submission?.pdfAccessToken && accessToken === submission.pdfAccessToken);
}

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed." });
  }

  try {
    const id = event.queryStringParameters?.id ?? "";
    const key = getSubmissionKey(id);

    if (!key) {
      return json(400, { error: "A valid submission id is required." });
    }

    const store = getHiringStore(event);
    const submission = await store.get(key, { type: "json" });

    if (!submission) {
      return json(404, { error: "Submission not found." });
    }

    if (!isAuthorized(event, submission)) {
      return json(401, { error: "Unauthorized." });
    }

    const pdfBytes = await generateHiringConfirmationPdf(submission);
    const filename = getHiringPdfFilename(submission);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
      body: Buffer.from(pdfBytes).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("Hiring PDF could not be generated", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return json(500, { error: "Hiring PDF could not be generated." });
  }
}
