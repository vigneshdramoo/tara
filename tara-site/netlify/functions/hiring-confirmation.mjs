import { connectLambda, getStore } from "@netlify/blobs";
import { randomBytes } from "node:crypto";
import { inflateSync } from "node:zlib";

const defaultRecipientEmail = "hello@tarascents.com";
const hiringStoreName = "tara-hiring-confirmations";

const requiredAcknowledgements = [
  "availability",
  "pay",
  "conduct",
  "attendance",
  "payout",
  "accuracy",
];

const defaultEngagementTerms = {
  activation: "TARA Scent Trail: Stop 06",
  role: "Scent Trail Crew",
  period: "1 July - 5 July 2026",
  hours: "10:00AM - 10:00PM daily",
  venue: "The Street, The Curve",
  status: "Applications Open",
  basicPay: "RM10/hr based on confirmed shift hours",
  commission:
    "50mL: 15% per bottle (RM25.35 at RM169 launch price). 10mL/travel size: 10% per unit (RM4.50 at RM45).",
  targetBonus:
    "Daily incentives are confirmed by TARA per shift and tied to agreed 50mL and 10mL sales targets.",
  maxDailyPayout:
    "Base pay + eligible commission + confirmed incentive bonus. Final payout depends on shift hours and actual sales.",
  ssmNo: "202603110736",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function getSiteUrl(event) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.URL) {
    return process.env.URL;
  }

  const protocol = event.headers["x-forwarded-proto"] ?? "https";
  const host = event.headers.host;
  return `${protocol}://${host}`;
}

function normalizeText(value, maxLength = 2000) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function normalizeParameter(value) {
  const normalized = normalizeText(value, 5000);
  return normalized || "-";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getTerm(body, key) {
  return normalizeText(body.engagementTerms?.[key] ?? defaultEngagementTerms[key], 1000);
}

function getAcknowledgement(body, key) {
  const accepted = body.acknowledgements?.[key] === true;
  const label = normalizeText(body.acknowledgementLabels?.[key], 1000);

  return accepted ? `Accepted - ${label}` : "Not accepted";
}

function paethPredictor(left, up, upLeft) {
  const predictor = left + up - upLeft;
  const leftDistance = Math.abs(predictor - left);
  const upDistance = Math.abs(predictor - up);
  const upLeftDistance = Math.abs(predictor - upLeft);

  if (leftDistance <= upDistance && leftDistance <= upLeftDistance) {
    return left;
  }

  if (upDistance <= upLeftDistance) {
    return up;
  }

  return upLeft;
}

function hasVisiblePngInk(buffer) {
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  if (!Buffer.isBuffer(buffer) || buffer.length < 33 || !buffer.subarray(0, 8).equals(pngSignature)) {
    return false;
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const typeStart = offset + 4;
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;

    if (dataEnd + 4 > buffer.length) {
      return false;
    }

    const type = buffer.toString("ascii", typeStart, dataStart);
    const data = buffer.subarray(dataStart, dataEnd);

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === "IDAT") {
      idatChunks.push(data);
    } else if (type === "IEND") {
      break;
    }

    offset = dataEnd + 4;
  }

  const bytesPerPixelByColorType = {
    0: 1,
    2: 3,
    4: 2,
    6: 4,
  };
  const bytesPerPixel = bytesPerPixelByColorType[colorType];

  if (!width || !height || bitDepth !== 8 || !bytesPerPixel || idatChunks.length === 0) {
    return false;
  }

  try {
    const inflated = inflateSync(Buffer.concat(idatChunks));
    const rowLength = width * bytesPerPixel;
    let previousRow = Buffer.alloc(rowLength);
    let inflatedOffset = 0;
    let visiblePixels = 0;
    let minX = Number.POSITIVE_INFINITY;
    let maxX = -1;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = -1;

    for (let y = 0; y < height; y += 1) {
      if (inflatedOffset + rowLength + 1 > inflated.length) {
        return false;
      }

      const filter = inflated[inflatedOffset];
      inflatedOffset += 1;

      const rawRow = inflated.subarray(inflatedOffset, inflatedOffset + rowLength);
      inflatedOffset += rowLength;

      const row = Buffer.alloc(rowLength);

      for (let index = 0; index < rowLength; index += 1) {
        const left = index >= bytesPerPixel ? row[index - bytesPerPixel] : 0;
        const up = previousRow[index] ?? 0;
        const upLeft = index >= bytesPerPixel ? previousRow[index - bytesPerPixel] : 0;
        let predictor = 0;

        if (filter === 1) {
          predictor = left;
        } else if (filter === 2) {
          predictor = up;
        } else if (filter === 3) {
          predictor = Math.floor((left + up) / 2);
        } else if (filter === 4) {
          predictor = paethPredictor(left, up, upLeft);
        } else if (filter !== 0) {
          return false;
        }

        row[index] = (rawRow[index] + predictor) & 255;
      }

      for (let x = 0; x < width; x += 1) {
        const pixelIndex = x * bytesPerPixel;
        const alpha =
          colorType === 6
            ? row[pixelIndex + 3]
            : colorType === 4
              ? row[pixelIndex + 1]
              : 255;
        const red = row[pixelIndex] ?? 0;
        const green = colorType === 0 || colorType === 4 ? red : row[pixelIndex + 1] ?? 0;
        const blue = colorType === 0 || colorType === 4 ? red : row[pixelIndex + 2] ?? 0;
        const hasAlphaInk = alpha > 20 && (colorType === 6 || colorType === 4);
        const hasOpaqueInk =
          colorType !== 6 &&
          colorType !== 4 &&
          !(red > 245 && green > 245 && blue > 245);

        if (hasAlphaInk || hasOpaqueInk) {
          visiblePixels += 1;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }

      previousRow = row;
    }

    return visiblePixels >= 24 && (maxX - minX >= 3 || maxY - minY >= 3);
  } catch {
    return false;
  }
}

function validateSignature(value) {
  const signature = normalizeText(value, 500000);

  if (!signature.startsWith("data:image/png;base64,")) {
    return "";
  }

  if (signature.length > 400000) {
    return "";
  }

  const signatureBytes = Buffer.from(signature.replace("data:image/png;base64,", ""), "base64");

  if (!hasVisiblePngInk(signatureBytes)) {
    return "";
  }

  return signature;
}

function getMissingEmailConfig() {
  const missingConfig = [];

  if (!process.env.NETLIFY_EMAILS_SECRET) {
    missingConfig.push("NETLIFY_EMAILS_SECRET");
  }

  if (!process.env.NETLIFY_EMAILS_PROVIDER) {
    missingConfig.push("NETLIFY_EMAILS_PROVIDER");
  }

  if (!process.env.NETLIFY_EMAILS_PROVIDER_API_KEY) {
    missingConfig.push("NETLIFY_EMAILS_PROVIDER_API_KEY");
  }

  return missingConfig;
}

function createSubmissionId() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const suffix = Math.random().toString(36).slice(2, 8);

  return `${timestamp}-${suffix}`;
}

function createPdfAccessToken() {
  return randomBytes(24).toString("base64url");
}

function getHiringPdfUrl(event, submissionId, accessToken) {
  const pdfUrl = new URL("/.netlify/functions/hiring-pdf", getSiteUrl(event));
  pdfUrl.searchParams.set("id", submissionId);
  pdfUrl.searchParams.set("access", accessToken);

  return pdfUrl.toString();
}

function getHiringStore(event) {
  if (event.blobs) {
    connectLambda(event);
  }

  return getStore(hiringStoreName);
}

async function storeHiringSubmission(event, record) {
  const store = getHiringStore(event);
  const submissionId = record.id ?? createSubmissionId();
  const key = `submissions/${submissionId}.json`;

  await store.setJSON(key, {
    id: submissionId,
    ...record,
  });

  await store.setJSON("latest.json", {
    id: submissionId,
    key,
    submittedAtIso: record.submittedAtIso,
    fullName: record.fullName,
    email: record.email,
    phone: record.phone,
    pdfUrl: record.pdfUrl,
  });

  return { submissionId, key };
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  try {
    const body = JSON.parse(event.body ?? "{}");

    if (normalizeText(body.companyWebsite)) {
      return json(200, { ok: true, emailSent: false });
    }

    const fullName = normalizeText(body.fullName, 180);
    const icNumber = normalizeText(body.icNumber, 80);
    const phone = normalizeText(body.phone, 80);
    const email = normalizeText(body.email, 180).toLowerCase();
    const homeAddress = normalizeText(body.homeAddress, 3000);
    const bankName = normalizeText(body.bankName, 120);
    const accountNumber = normalizeText(body.accountNumber, 120);
    const signatureName = normalizeText(body.signatureName, 180);
    const signatureDate = normalizeText(body.signatureDate, 40);
    const signatureDataUrl = validateSignature(body.signatureDataUrl);
    const acknowledgementsAccepted = requiredAcknowledgements.every(
      (key) => body.acknowledgements?.[key] === true,
    );

    if (
      !fullName ||
      !icNumber ||
      !phone ||
      !email ||
      !homeAddress ||
      !bankName ||
      !accountNumber ||
      !signatureName ||
      !signatureDate
    ) {
      return json(400, { error: "Please complete all required fields." });
    }

    if (!isValidEmail(email)) {
      return json(400, { error: "A valid email address is required." });
    }

    if (!acknowledgementsAccepted) {
      return json(400, { error: "All acknowledgement items must be accepted." });
    }

    if (!signatureDataUrl) {
      return json(400, { error: "A captured signature is required." });
    }

    const submittedAtIso = new Date().toISOString();
    const submittedAt = new Date().toLocaleString("en-MY", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kuala_Lumpur",
    });
    const sourcePage = normalizeText(body.sourcePage, 500);
    const parameters = {
      fullName,
      icNumber,
      phone,
      email,
      homeAddress,
      bankName,
      accountNumber,
      signatureName,
      signatureDate,
      signatureDataUrl,
      activation: getTerm(body, "activation"),
      role: getTerm(body, "role"),
      period: getTerm(body, "period"),
      hours: getTerm(body, "hours"),
      venue: getTerm(body, "venue"),
      status: getTerm(body, "status"),
      basicPay: getTerm(body, "basicPay"),
      commission: getTerm(body, "commission"),
      targetBonus: getTerm(body, "targetBonus"),
      maxDailyPayout: getTerm(body, "maxDailyPayout"),
      ssmNo: getTerm(body, "ssmNo"),
      availabilityAck: getAcknowledgement(body, "availability"),
      payAck: getAcknowledgement(body, "pay"),
      conductAck: getAcknowledgement(body, "conduct"),
      attendanceAck: getAcknowledgement(body, "attendance"),
      payoutAck: getAcknowledgement(body, "payout"),
      accuracyAck: getAcknowledgement(body, "accuracy"),
      submittedAt,
      sourcePage,
    };
    const submissionId = createSubmissionId();
    const pdfAccessToken = createPdfAccessToken();
    const pdfUrl = getHiringPdfUrl(event, submissionId, pdfAccessToken);
    const storedSubmission = await storeHiringSubmission(event, {
      id: submissionId,
      ...parameters,
      submittedAtIso,
      pdfAccessToken,
      pdfUrl,
    });
    const missingEmailConfig = getMissingEmailConfig();

    if (missingEmailConfig.length > 0) {
      console.warn("Hiring confirmation email skipped: missing email config", {
        missingConfig: missingEmailConfig,
        submissionId: storedSubmission.submissionId,
      });

      return json(202, {
        ok: true,
        stored: true,
        submissionId: storedSubmission.submissionId,
        pdfUrl,
        emailSent: false,
        reason: `Netlify Email Integration is missing: ${missingEmailConfig.join(", ")}`,
      });
    }

    const emailSecret = process.env.NETLIFY_EMAILS_SECRET;
    const recipientEmail =
      process.env.HIRING_NOTIFICATION_EMAIL ??
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
      defaultRecipientEmail;
    const normalizedParameters = Object.fromEntries(
      Object.entries(parameters).map(([key, value]) => [
        key,
        key === "signatureDataUrl" ? value : normalizeParameter(value),
      ]),
    );
    normalizedParameters.submissionId = storedSubmission.submissionId;
    normalizedParameters.pdfUrl = pdfUrl;
    const response = await fetch(
      `${getSiteUrl(event)}/.netlify/functions/emails/hiring-confirmation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "netlify-emails-secret": emailSecret,
        },
        body: JSON.stringify({
          from: `TARA Hiring <${recipientEmail}>`,
          to: recipientEmail,
          subject: `TARA hiring confirmation: ${fullName}`,
          parameters: normalizedParameters,
        }),
      },
    );

    if (!response.ok) {
      const responseBody = await response.text().catch(() => "");

      console.error("Hiring confirmation email failed", {
        status: response.status,
        responseBody: responseBody.slice(0, 500),
        submissionId: storedSubmission.submissionId,
      });

      return json(202, {
        ok: true,
      stored: true,
      submissionId: storedSubmission.submissionId,
      pdfUrl,
      emailSent: false,
      reason: "Hiring confirmation was received, but email notification is unavailable.",
      });
    }

    return json(200, {
      ok: true,
      stored: true,
      submissionId: storedSubmission.submissionId,
      pdfUrl,
      emailSent: true,
    });
  } catch (error) {
    console.error("Hiring confirmation could not be processed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return json(500, { error: "Hiring confirmation could not be processed." });
  }
}
