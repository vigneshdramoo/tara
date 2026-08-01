const recipientEmail =
  process.env.NEWSLETTER_RECIPIENT_EMAIL ??
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
  "hello@tarascents.com";
const emailProvider = process.env.NETLIFY_EMAILS_PROVIDER;
const emailProviderApiKey = process.env.NETLIFY_EMAILS_PROVIDER_API_KEY;

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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  try {
    const body = JSON.parse(event.body ?? "{}");
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      return json(400, { error: "A valid email is required." });
    }

    const emailSecret = process.env.NETLIFY_EMAILS_SECRET;

    if (!emailSecret || !emailProvider || !emailProviderApiKey) {
      return json(202, {
        ok: true,
        emailSent: false,
        storedViaNetlifyForm: true,
        reason:
          "The signup was stored in Netlify Forms, but notification email delivery is not configured.",
      });
    }

    const response = await fetch(
      `${getSiteUrl(event)}/.netlify/functions/emails/newsletter-signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "netlify-emails-secret": emailSecret,
        },
        body: JSON.stringify({
          from: `TARA Website <${recipientEmail}>`,
          to: recipientEmail,
          subject: "New TARA newsletter signup",
          parameters: {
            email,
            source: String(body.source ?? "footer"),
            submittedAt: new Date().toLocaleString("en-MY", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Kuala_Lumpur",
            }),
          },
        }),
      },
    );

    return json(response.ok ? 200 : 202, {
      ok: true,
      emailSent: response.ok,
      storedViaNetlifyForm: true,
    });
  } catch {
    return json(500, { error: "Newsletter notification could not be processed." });
  }
}
