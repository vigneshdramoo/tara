import { connectLambda, getStore } from "@netlify/blobs";

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

function isAuthorized(event) {
  const configuredToken = process.env.HIRING_ADMIN_TOKEN;

  if (!configuredToken) {
    return false;
  }

  const authHeader = event.headers.authorization ?? event.headers.Authorization ?? "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const queryToken = event.queryStringParameters?.token ?? "";

  return bearerToken === configuredToken || queryToken === configuredToken;
}

function getHiringStore(event) {
  if (event.blobs) {
    connectLambda(event);
  }

  return getStore(hiringStoreName);
}

export async function handler(event) {
  if (!["GET", "DELETE"].includes(event.httpMethod)) {
    return json(405, { error: "Method not allowed." });
  }

  if (!isAuthorized(event)) {
    return json(401, { error: "Unauthorized." });
  }

  try {
    const store = getHiringStore(event);

    if (event.httpMethod === "DELETE") {
      const id = event.queryStringParameters?.id ?? "";
      const key = id.startsWith("submissions/") ? id : `submissions/${id}.json`;

      if (!id) {
        return json(400, { error: "Submission id is required." });
      }

      await store.delete(key);

      const { blobs } = await store.list({ prefix: "submissions/" });
      const latestKey = blobs
        .map((blob) => blob.key)
        .sort()
        .reverse()[0];

      if (latestKey) {
        const latestSubmission = await store.get(latestKey, { type: "json" });

        await store.setJSON("latest.json", {
          id: latestSubmission.id,
          key: latestKey,
          submittedAtIso: latestSubmission.submittedAtIso,
          fullName: latestSubmission.fullName,
          email: latestSubmission.email,
          phone: latestSubmission.phone,
        });
      } else {
        await store.delete("latest.json");
      }

      return json(200, { ok: true, deleted: key });
    }

    const latestOnly = event.queryStringParameters?.latest === "true";

    if (latestOnly) {
      const latest = await store.get("latest.json", { type: "json" });

      if (!latest?.key) {
        return json(200, { submissions: [] });
      }

      const submission = await store.get(latest.key, { type: "json" });
      return json(200, { submissions: submission ? [submission] : [] });
    }

    const { blobs } = await store.list({ prefix: "submissions/" });
    const sortedKeys = blobs
      .map((blob) => blob.key)
      .sort()
      .reverse()
      .slice(0, 25);
    const submissions = (
      await Promise.all(sortedKeys.map((key) => store.get(key, { type: "json" })))
    ).filter(Boolean);

    return json(200, { submissions });
  } catch (error) {
    console.error("Hiring submissions could not be read", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return json(500, { error: "Hiring submissions could not be read." });
  }
}
