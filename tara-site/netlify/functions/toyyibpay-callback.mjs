import crypto from "node:crypto";

import { sendOrderNotification } from "./lib/order-email.mjs";

function getExpectedHash({ userSecretKey, status, orderId, refno }) {
  return crypto
    .createHash("md5")
    .update(`${userSecretKey}${status}${orderId}${refno}ok`)
    .digest("hex");
}

function getBodyParams(event) {
  if (!event.body) {
    return new URLSearchParams();
  }

  const body = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  return new URLSearchParams(body);
}

function getParam(event, bodyParams, name) {
  return (
    bodyParams.get(name) ??
    event.queryStringParameters?.[name] ??
    ""
  );
}

function buildAuditNotes({
  method,
  reason,
  refno,
  transactionId,
  receivedHash,
  expectedHash,
  statusId,
  msg,
  transactionTime,
}) {
  return [
    `Method: ${method}`,
    `Reason: ${reason || "-"}`,
    `Reference: ${refno || "-"}`,
    `Transaction: ${transactionId || "-"}`,
    `Transaction Time: ${transactionTime || "-"}`,
    `Return Status ID: ${statusId || "-"}`,
    `Provider Message: ${msg || "-"}`,
    `Received Hash: ${receivedHash || "-"}`,
    `Expected Hash: ${expectedHash || "-"}`,
  ].join("\n");
}

async function recordCallbackEvent(event, details) {
  return sendOrderNotification(event, {
    subject: details.subject,
    eventLabel: details.eventLabel,
    orderReference: details.orderReference,
    itemSummary: details.itemSummary,
    customerName: "-",
    customerEmail: "-",
    customerPhone: "-",
    deliveryAddress: "-",
    amount: details.amount,
    paymentStatus: details.paymentStatus,
    billCode: details.billCode,
    paymentUrl: "-",
    notes: details.notes,
    submittedAt: new Date().toLocaleString("en-MY", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kuala_Lumpur",
    }),
  });
}

export async function handler(event) {
  const bodyParams = getBodyParams(event);
  const method = event.httpMethod ?? "UNKNOWN";

  const status = getParam(event, bodyParams, "status");
  const orderId = getParam(event, bodyParams, "order_id");
  const refno = getParam(event, bodyParams, "refno");
  const reason = getParam(event, bodyParams, "reason");
  const billCode = getParam(event, bodyParams, "billcode");
  const amount = getParam(event, bodyParams, "amount");
  const receivedHash = getParam(event, bodyParams, "hash");
  const transactionId = getParam(event, bodyParams, "transaction_id");
  const transactionTime = getParam(event, bodyParams, "transaction_time");
  const statusId = getParam(event, bodyParams, "status_id");
  const msg = getParam(event, bodyParams, "msg");

  console.log("ToyyibPay callback received", {
    method,
    status,
    statusId,
    reason,
    billCode,
    orderId,
    amount,
    refno,
    transactionId,
  });

  if (!["POST", "GET"].includes(method)) {
    await recordCallbackEvent(event, {
      subject: `TARA payment callback ignored: ${orderId || "unknown order"}`,
      eventLabel: "Payment Callback Ignored",
      orderReference: orderId,
      itemSummary: `Unsupported callback method: ${method}`,
      amount,
      paymentStatus: `Ignored / unsupported method`,
      billCode,
      notes: buildAuditNotes({
        method,
        reason,
        refno,
        transactionId,
        receivedHash,
        expectedHash: "-",
        statusId,
        msg,
        transactionTime,
      }),
    }).catch((error) => {
      console.error("Payment callback audit failed", {
        message: error instanceof Error ? error.message : "Unknown error",
      });
    });

    return {
      statusCode: 405,
      body: "Method not allowed",
    };
  }

  const userSecretKey = process.env.TOYYIBPAY_SECRET_KEY;

  if (!userSecretKey) {
    return {
      statusCode: 503,
      body: "Payment callback is not configured",
    };
  }
  const expectedHash = getExpectedHash({
    userSecretKey,
    status,
    orderId,
    refno,
  });

  if (!status || !orderId || !refno || !receivedHash) {
    await recordCallbackEvent(event, {
      subject: `TARA payment callback incomplete: ${orderId || "unknown order"}`,
      eventLabel: "Payment Callback Incomplete",
      orderReference: orderId,
      itemSummary: "Callback arrived without the full verification fields.",
      amount,
      paymentStatus: `Incomplete / missing parameters`,
      billCode,
      notes: buildAuditNotes({
        method,
        reason,
        refno,
        transactionId,
        receivedHash,
        expectedHash,
        statusId,
        msg,
        transactionTime,
      }),
    }).catch((error) => {
      console.error("Payment callback audit failed", {
        message: error instanceof Error ? error.message : "Unknown error",
      });
    });

    return {
      statusCode: 400,
      body: "Missing callback parameters",
    };
  }

  if (receivedHash !== expectedHash) {
    console.warn("ToyyibPay callback rejected", {
      method,
      status,
      billCode,
      orderId,
      refno,
      receivedHash,
      expectedHash,
    });

    await recordCallbackEvent(event, {
      subject: `TARA payment callback rejected: ${orderId || "unknown order"}`,
      eventLabel: "Payment Callback Rejected",
      orderReference: orderId,
      itemSummary: `ToyyibPay callback rejected for status ${status}`,
      amount,
      paymentStatus: `Rejected / invalid hash`,
      billCode,
      notes: buildAuditNotes({
        method,
        reason,
        refno,
        transactionId,
        receivedHash,
        expectedHash,
        statusId,
        msg,
        transactionTime,
      }),
    }).catch((error) => {
      console.error("Payment callback audit failed", {
        message: error instanceof Error ? error.message : "Unknown error",
      });
    });

    return {
      statusCode: 400,
      body: "Invalid hash",
    };
  }

  console.log("ToyyibPay callback accepted", {
    method,
    status,
    reason,
    billCode,
    orderId,
    amount,
    refno,
    transactionId,
  });

  await recordCallbackEvent(event, {
    subject: `TARA payment callback: ${orderId || "unknown order"}`,
    eventLabel: "Payment Callback",
    orderReference: orderId,
    itemSummary: `ToyyibPay callback status: ${status}`,
    amount,
    paymentStatus: `Status ${status}${
      reason ? ` / ${reason}` : ""
    }`,
    billCode,
    notes: buildAuditNotes({
      method,
      reason,
      refno,
      transactionId,
      receivedHash,
      expectedHash,
      statusId,
      msg,
      transactionTime,
    }),
  }).catch((error) => {
    console.error("Payment callback notification failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  });

  return {
    statusCode: 200,
    body: "OK",
  };
}
