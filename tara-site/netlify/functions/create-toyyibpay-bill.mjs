import {
  createReceiptToken,
  buildOrderSnapshot,
  saveDiscoveryOrder,
} from "./lib/discovery-orders.mjs";
import { sendOrderNotification } from "./lib/order-email.mjs";
import {
  CheckoutValidationError,
  checkoutItemSummary,
  maxCheckoutQuantityTotal,
  normalizeCheckoutItems,
} from "./lib/checkout-catalog.mjs";

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

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPhone(value) {
  const digits = value.replace(/\D/g, "");
  return /^\+?[0-9][0-9\s().-]*$/.test(value) && digits.length >= 8 && digits.length <= 15;
}

export function createHandler({
  saveOrder = saveDiscoveryOrder,
  notify = sendOrderNotification,
  fetcher = fetch,
} = {}) {
  return async function handler(event) {
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
      const cartItems = normalizeCheckoutItems(body);
      const cartQuantity = cartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      );

      if (cartItems.length === 0 || cartQuantity > maxCheckoutQuantityTotal) {
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

      if (!name || !email || !phone || !validEmail(email) || !validPhone(phone)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid customer details." }),
        };
      }

      if (!addressLine1 || !city || !zipcode || !country) {
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
      const itemSummary = checkoutItemSummary(cartItems);
      const hasDiscovery = cartItems.some((item) => item.configuration);
      const receiptToken = hasDiscovery ? createReceiptToken() : undefined;
      const orderSnapshot = hasDiscovery
        ? buildOrderSnapshot(
            orderReference,
            cartItems,
            amountInSen,
            receiptToken,
          )
        : null;
      // Do not offer payment until fulfillment has a durable, validated configuration.
      if (orderSnapshot) {
        try {
          await saveOrder(event, orderSnapshot);
        } catch {
          return {
            statusCode: 503,
            body: JSON.stringify({
              error:
                "We could not save your order. Your cart is safe; please try again.",
            }),
          };
        }
      }
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
        billContentEmail: `Your order: ${itemSummary}. Your hosted payment for ${merchantName} is ready. For support, contact ${merchantPhone} or ${merchantEmail}.`,
      });

      if (duitNowQrEnabled) {
        payload.set("enableDuitNowQR", "1");
        payload.set("chargeDuitNowQR", "0");
      }

      const response = await fetcher(`${baseUrl}/index.php/api/createBill`, {
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
      if (orderSnapshot) {
        try {
          await saveOrder(event, orderSnapshot, billCode);
        } catch {
          return {
            statusCode: 503,
            body: JSON.stringify({
              error:
                "We could not save your order reference. Your cart is safe; please try again.",
            }),
          };
        }
      }

      await notify(event, {
        subject: `New TARA checkout: ${orderReference}`,
        eventLabel: "Checkout Started",
        orderReference,
        itemSummary,
        orderItems: JSON.stringify(cartItems),
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
          ...(receiptToken ? { receiptToken } : {}),
        }),
      };
    } catch (error) {
      return {
        statusCode:
          error instanceof CheckoutValidationError ||
          error instanceof SyntaxError
            ? 400
            : 500,
        body: JSON.stringify({
          error:
            error instanceof CheckoutValidationError
              ? error.message
              : "Unable to create the hosted payment bill. Your cart is safe; please try again.",
        }),
      };
    }
  };
}
export const handler = createHandler();
