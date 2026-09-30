import { getDiscoveryReceipt } from "./lib/discovery-orders.mjs";
function getToyyibBaseUrl() {
  return process.env.TOYYIBPAY_SANDBOX === "true"
    ? "https://dev.toyyibpay.com"
    : "https://toyyibpay.com";
}

function mapStatus(statusId) {
  if (statusId === "1") {
    return "success";
  }

  if (statusId === "2" || statusId === "4") {
    return "pending";
  }

  if (statusId === "3") {
    return "failed";
  }

  return "unknown";
}

function parseAmountInSen(amount) {
  const numericAmount = Number(amount ?? 0);

  if (!Number.isFinite(numericAmount)) {
    return undefined;
  }

  if (numericAmount > 10000) {
    return Math.round(numericAmount);
  }

  return Math.round(numericAmount * 100);
}

export function createHandler({
  getReceipt = getDiscoveryReceipt,
  fetcher = fetch,
} = {}) {
  return async function handler(event) {
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed." }),
      };
    }

    const billCode = event.queryStringParameters?.billcode;

    if (!billCode) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing billcode." }),
      };
    }

    try {
      const receipt = await getReceipt(event, billCode);
      const response = await fetcher(
        `${getToyyibBaseUrl()}/index.php/api/getBillTransactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ billCode }).toString(),
        },
      );

      const text = await response.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        result = text;
      }

      const transaction = Array.isArray(result) ? result[0] : undefined;

      if (!response.ok || !transaction) {
        if (
          typeof result === "string" &&
          result.toLowerCase().includes("no data found")
        ) {
          return {
            statusCode: 200,
            headers: {
              "Cache-Control": "private, no-store",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "pending",
              billCode,
              ...(receipt ? { items: receipt.items } : {}),
            }),
          };
        }

        return {
          statusCode: 200,
          headers: {
            "Cache-Control": "private, no-store",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "unknown",
            billCode,
            ...(receipt ? { items: receipt.items } : {}),
          }),
        };
      }

      return {
        statusCode: 200,
        headers: {
          "Cache-Control": "private, no-store",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: mapStatus(transaction.billpaymentStatus),
          amountInSen: parseAmountInSen(transaction.billpaymentAmount),
          channel: transaction.billpaymentChannel,
          invoiceNo: transaction.billpaymentInvoiceNo,
          billCode,
          ...(receipt ? { items: receipt.items } : {}),
          orderId: transaction.billExternalReferenceNo,
        }),
      };
    } catch {
      return {
        statusCode: 500,
        headers: { "Cache-Control": "private, no-store", "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Unable to verify payment status. Please try again." }),
      };
    }
  };
}
export const handler = createHandler();
