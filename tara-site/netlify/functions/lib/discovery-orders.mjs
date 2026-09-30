import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { connectLambda, getStore } from "@netlify/blobs";

function storeFor(event) {
  if (event.blobs) connectLambda(event);
  return getStore({ name: "tara-discovery-orders", consistency: "strong" });
}
export function createReceiptToken() {
  return randomBytes(32).toString("hex");
}
function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}
function key(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value)
    ? value
    : null;
}
export function buildOrderSnapshot(orderReference, items, amountInSen, token) {
  return {
    orderReference,
    items,
    amountInSen,
    receiptTokenHash: hashToken(token),
    createdAt: new Date().toISOString(),
  };
}
export async function saveDiscoveryOrder(event, snapshot, billCode) {
  const store = storeFor(event);
  await store.setJSON(`orders/${snapshot.orderReference}.json`, {
    ...snapshot,
    ...(billCode ? { billCode } : {}),
  });
  if (billCode)
    await store.setJSON(`bills/${billCode}.json`, {
      orderReference: snapshot.orderReference,
    });
}
export async function getDiscoveryOrder(event, orderReference) {
  if (!key(orderReference)) return null;
  return storeFor(event).get(`orders/${orderReference}.json`, { type: "json" });
}
export function authorizedReceipt(snapshot, token) {
  if (!snapshot || typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token))
    return null;
  const expected = Buffer.from(snapshot.receiptTokenHash, "hex");
  const actual = Buffer.from(hashToken(token), "hex");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual))
    return null;
  return { items: snapshot.items, orderReference: snapshot.orderReference };
}
export async function getDiscoveryReceipt(event, billCode) {
  const token =
    event.headers?.["x-tara-receipt"] ?? event.headers?.["X-Tara-Receipt"];
  if (!token || !key(billCode)) return null;
  const store = storeFor(event);
  const mapping = await store.get(`bills/${billCode}.json`, { type: "json" });
  if (!mapping) return null;
  return authorizedReceipt(
    await getDiscoveryOrder(event, mapping.orderReference),
    token,
  );
}
