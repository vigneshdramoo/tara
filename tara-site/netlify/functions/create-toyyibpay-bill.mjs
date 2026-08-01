import { sendOrderNotification } from "./lib/order-email.mjs";

const catalog = {
  aureya: {
    name: "Aureya",
    priceInSen: 16900,
  },
  zephyr: {
    name: "Zephyr",
    priceInSen: 16900,
  },
  maris: {
    name: "Maris",
    priceInSen: 16900,
  },
  marin: {
    name: "Maris",
    priceInSen: 16900,
  },
  "three-8ml-promo": {
    name: "3 x 8mL Promo Set",
    priceInSen: 9900,
  },
};

const duitNowQrEnabled = process.env.TOYYIBPAY_ENABLE_DUITNOW_QR === "true";
const merchantName = "TARA SCENTS";
const merchantPhone = "+01143042883";
const merchantEmail = "hello@tarascents.com";

function getToyyibBaseUrl() {
  return process.env.TOYYIBPAY_SANDBOX === "true"
    ? "https://dev.toyyibpay.com"
    : "https://toyyibpay.com";
}

function getSiteUrl(event) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  const protocol = event.headers["x-forwarded-proto"] ?? "https";
  const host = event.headers.host;
  return `${protocol}://${host}`;
}

function sanitizeText(value, maxLength) {
  return value
    .replace(/[^a-zA-Z0-9 _-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function buildOrderReference() {
  return `TARA-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function normalizeCartItems(body) {
  const rawItems = Array.isArray(body.items)
    ? body.items
    : body.scentSlug
      ? [{ scentSlug: body.scentSlug, quantity: body.quantity ?? 1 }]
      : [];
  const mergedItems = new Map();

  rawItems.forEach((item) => {
    const slug = String(item.scentSlug ?? item.slug ?? "").trim();
    const product = catalog[slug];
    const quantity = Number(item.quantity ?? 1);

    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 12) {
      return;
    }

    mergedItems.set(slug, (mergedItems.get(slug) ?? 0) + quantity);
  });

  return Array.from(mergedItems.entries()).map(([slug, quantity]) => ({
    slug,
    ...catalog[slug],
    quantity: Math.min(12, quantity),
  }));
}

function getProviderErrorMessage(result) {
  const firstResult = Array.isArray(result) ? result[0] : result;
  const rawMessage =
    firstResult?.msg ??
    firstResult?.message ??
    firstResult?.Message ??
    firstResult?.error ??
    firstResult?.Error ??
    firstResult?.status;

  if (typeof rawMessage === "string" && rawMessage.trim()) {
    return `ToyyibPay rejected the checkout request: ${rawMessage.trim()}`;
  }

  return "ToyyibPay rejected the checkout request. Please check that the account, category, and payment channels are active.";
}

function getPaymentChannel(body) {
  const paymentChannel = String(body.paymentChannel ?? "").trim();

  if (["0", "1", "2"].includes(paymentChannel)) {
    return paymentChannel;
  }

  return "2";
}

function formatRinggit(amountInSen) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 2,
  }).format(amountInSen / 100);
}

function buildDeliveryAddress({
  addressLine1,
  addressLine2,
  addressLine3,
  city,
  zipcode,
  country,
}) {
  return [addressLine1, addressLine2, addressLine3, city, zipcode, country]
    .filter(Boolean)
    .join("\n");
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed." }),
    };
  }

  const userSecretKey = process.env.TOYYIBPAY_SECRET_KEY;
  const categoryCode = process.env.TOYYIBPAY_CATEGORY_CODE;

  if (!userSecretKey || !categoryCode) {
    return {
      statusCode: 503,
      body: JSON.stringify({
        error:
          "Secure checkout is not connected yet. Add toyyibPay credentials in Netlify to activate it.",
      }),
    };
  }

  try {
    const body = JSON.parse(event.body ?? "{}");
    const cartItems = normalizeCartItems(body);
    const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    if (cartItems.length === 0 || cartQuantity > 24) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid checkout request." }),
      };
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const addressLine1 = String(body.addressLine1 ?? "").trim();
    const addressLine2 = String(body.addressLine2 ?? "").trim();
    const addressLine3 = String(body.addressLine3 ?? "").trim();
    const city = String(body.city ?? "").trim();
    const zipcode = String(body.zipcode ?? "").trim();
    const country = String(body.country ?? "").trim();

    if (!name || !email || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing customer details." }),
      };
    }

    if (!addressLine1 || !addressLine2 || !city || !zipcode || !country) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing delivery address." }),
      };
    }

    const orderReference = buildOrderReference();
    const siteUrl = getSiteUrl(event);
    const baseUrl = getToyyibBaseUrl();
    const paymentMethod = sanitizeText(
      String(body.paymentMethod ?? "online-banking"),
      24,
    );
    const amountInSen = cartItems.reduce(
      (total, item) => total + item.priceInSen * item.quantity,
      0,
    );
    const itemSummary = cartItems
      .map((item) => `${item.name} x ${item.quantity}`)
      .join(", ");
    const billName =
      cartItems.length === 1
        ? `${cartItems[0].name} x ${cartItems[0].quantity}`
        : `TARA Cart ${cartQuantity} items`;

    const payload = new URLSearchParams({
      userSecretKey,
      categoryCode,
      billName: sanitizeText(billName, 30) || "TARA Payment",
      billDescription:
        sanitizeText(
          `${itemSummary} ${paymentMethod} checkout for ${merchantName}.`,
          100,
        ) || "TARA secure checkout",
      billPriceSetting: "1",
      billPayorInfo: "1",
      billAmount: String(amountInSen),
      billReturnUrl: `${siteUrl}/payment/result`,
      billCallbackUrl: `${siteUrl}/.netlify/functions/toyyibpay-callback`,
      billExternalReferenceNo: orderReference,
      billTo: sanitizeText(name, 60) || "TARA Customer",
      billEmail: email,
      billPhone: phone.replace(/[^\d+]/g, ""),
      billSplitPayment: "0",
      billPaymentChannel: getPaymentChannel(body),
      billDisplayMerchant: "1",
      billContentEmail:
        `Your hosted payment for ${merchantName} is ready. For support, contact ${merchantPhone} or ${merchantEmail}.`,
    });

    if (duitNowQrEnabled) {
      payload.set("enableDuitNowQR", "1");
      payload.set("chargeDuitNowQR", "0");
    }

    const response = await fetch(`${baseUrl}/index.php/api/createBill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    });

    const result = await response.json();
    const billCode = Array.isArray(result) ? result[0]?.BillCode : undefined;

    if (!response.ok || !billCode) {
      console.error("ToyyibPay createBill failed", {
        status: response.status,
        providerResult: result,
      });

      return {
        statusCode: 502,
        body: JSON.stringify({
          error: getProviderErrorMessage(result),
        }),
      };
    }

    const paymentUrl = `${baseUrl}/${billCode}`;

    await sendOrderNotification(event, {
      subject: `New TARA checkout: ${orderReference}`,
      eventLabel: "Checkout Started",
      orderReference,
      itemSummary,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      deliveryAddress: buildDeliveryAddress({
        addressLine1,
        addressLine2,
        addressLine3,
        city,
        zipcode,
        country,
      }),
      amount: formatRinggit(amountInSen),
      paymentStatus: `Awaiting payment / ${paymentMethod}`,
      billCode,
      paymentUrl,
      notes: String(body.notes ?? "").trim(),
      submittedAt: new Date().toLocaleString("en-MY", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kuala_Lumpur",
      }),
    }).catch((error) => {
      console.error("Order notification failed", {
        message: error instanceof Error ? error.message : "Unknown error",
      });
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        provider: "toyyibpay",
        orderReference,
        billCode,
        paymentUrl,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Unable to create the hosted payment bill.",
      }),
    };
  }
}
