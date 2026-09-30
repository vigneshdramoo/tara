const defaultRecipientEmail = "hello@tarascents.com";
const orderEventsFormName = "tara-order-events";

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

function normalizeParameter(value) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  return String(value);
}

async function submitOrderEventForm(event, parameters) {
  const normalizedParameters = Object.fromEntries(
    Object.entries(parameters).map(([key, value]) => [
      key,
      normalizeParameter(value),
    ]),
  );
  const body = new URLSearchParams({
    "form-name": orderEventsFormName,
    subject:
      normalizedParameters.subject ??
      `New order event from ${orderEventsFormName}`,
    event_label: normalizedParameters.eventLabel,
    order_reference: normalizedParameters.orderReference,
    item_summary: normalizedParameters.itemSummary,
    order_items: normalizedParameters.orderItems,
    customer_name: normalizedParameters.customerName,
    customer_email: normalizedParameters.customerEmail,
    customer_phone: normalizedParameters.customerPhone,
    delivery_address: normalizedParameters.deliveryAddress,
    amount: normalizedParameters.amount,
    payment_status: normalizedParameters.paymentStatus,
    bill_code: normalizedParameters.billCode,
    payment_url: normalizedParameters.paymentUrl,
    notes: normalizedParameters.notes,
    submitted_at: normalizedParameters.submittedAt,
  });

  const response = await fetch(getSiteUrl(event), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  return {
    sent: response.ok,
    status: response.status,
    channel: "form",
  };
}

export async function sendOrderNotification(event, parameters) {
  const emailSecret = process.env.NETLIFY_EMAILS_SECRET;
  const emailProvider = process.env.NETLIFY_EMAILS_PROVIDER;
  const emailProviderApiKey = process.env.NETLIFY_EMAILS_PROVIDER_API_KEY;
  const emailConfigured =
    Boolean(emailSecret) && Boolean(emailProvider) && Boolean(emailProviderApiKey);

  if (!emailConfigured) {
    return submitOrderEventForm(event, parameters);
  }

  const recipientEmail =
    process.env.ORDER_NOTIFICATION_EMAIL ??
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
    defaultRecipientEmail;
  const normalizedParameters = Object.fromEntries(
    Object.entries(parameters).map(([key, value]) => [
      key,
      normalizeParameter(value),
    ]),
  );

  const response = await fetch(
    `${getSiteUrl(event)}/.netlify/functions/emails/order-notification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "netlify-emails-secret": emailSecret,
      },
      body: JSON.stringify({
        from: `TARA Website <${recipientEmail}>`,
        to: recipientEmail,
        subject: parameters.subject ?? "TARA order update",
        parameters: normalizedParameters,
      }),
    },
  );

  if (response.ok) {
    return { sent: true, status: response.status, channel: "email" };
  }

  return submitOrderEventForm(event, parameters);
}
