import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { test } from "node:test";

const productPath = new URL("../out/scents/theon.html", import.meta.url);
const cartPath = new URL("../out/cart.html", import.meta.url);
const checkoutPath = new URL("../out/cart/checkout.html", import.meta.url);
const preorderPath = new URL("../out/preorder.html", import.meta.url);
const reassurancePath = new URL(
  "../src/components/product/PurchaseReassurance.tsx",
  import.meta.url,
);
const commercialPath = new URL("../src/content/commercial.ts", import.meta.url);
const cartViewPath = new URL("../src/components/cart/CartView.tsx", import.meta.url);
const checkoutFormPath = new URL(
  "../src/components/cart/CheckoutForm.tsx",
  import.meta.url,
);
const preorderFormPath = new URL(
  "../src/components/forms/PreorderForm.tsx",
  import.meta.url,
);
const paymentCheckoutPath = new URL(
  "../src/components/payments/PaymentCheckoutForm.tsx",
  import.meta.url,
);

const sourcePaths = [
  reassurancePath,
  commercialPath,
  cartViewPath,
  checkoutFormPath,
  preorderFormPath,
  paymentCheckoutPath,
];
const hasFreshExport =
  [productPath, cartPath, checkoutPath, preorderPath].every((path) => existsSync(path)) &&
  Math.min(
    statSync(productPath).mtimeMs,
    statSync(cartPath).mtimeMs,
    statSync(checkoutPath).mtimeMs,
    statSync(preorderPath).mtimeMs,
  ) >= Math.max(...sourcePaths.map((sourcePath) => statSync(sourcePath).mtimeMs));

test("Stage 6 policy source contains only supported reassurance facts", () => {
  const commercial = readFileSync(commercialPath, "utf8");

  assert.match(commercial, /West Malaysia usually 2-5 working days after dispatch/);
  assert.match(commercial, /East Malaysia usually 4-8 working days after dispatch/);
  assert.match(commercial, /In-stock orders are usually prepared within 1 to 3 working days/);
  assert.match(commercial, /Preorders ship according to launch allocation/);
  assert.match(commercial, /Shipping is calculated after delivery details/);
  assert.match(commercial, /not silently added to the ToyyibPay handoff/);
  assert.match(commercial, /within 48 hours/);
  assert.match(commercial, /href: "\/shipping-policy"/);
  assert.match(commercial, /href: "\/refund-policy"/);
  assert.match(commercial, /href: "\/privacy"/);
  assert.match(commercial, /href: "\/terms"/);
  assert.doesNotMatch(commercial, /guarantee/i);
});

test("Stage 6 reassurance component is expandable and reused at decision points", () => {
  const reassurance = readFileSync(reassurancePath, "utf8");
  const cart = readFileSync(cartViewPath, "utf8");
  const checkout = readFileSync(checkoutFormPath, "utf8");
  const preorder = readFileSync(preorderFormPath, "utf8");
  const paymentCheckout = readFileSync(paymentCheckoutPath, "utf8");

  assert.match(reassurance, /<details/);
  assert.match(reassurance, /<summary/);
  assert.match(reassurance, /purchaseReassurance\.decisionDetails/);
  assert.match(cart, /<PurchaseReassurance compact/);
  assert.match(checkout, /<PurchaseReassurance compact/);
  assert.match(preorder, /<PurchaseReassurance compact/);
  assert.match(paymentCheckout, /<PurchaseReassurance compact/);
});

test("Stage 6 export shows reassurance near product, cart, checkout, and preorder flows", {
  skip: hasFreshExport ? false : "Run npm run build before this check.",
}, () => {
  const combinedHtml = [
    productPath,
    cartPath,
    checkoutPath,
    preorderPath,
  ]
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");

  assert.match(combinedHtml, /Purchase reassurance/);
  assert.match(combinedHtml, /Delivery timing/);
  assert.match(combinedHtml, /Dispatch and preorder timing/);
  assert.match(combinedHtml, /Shipping Policy/);
  assert.match(combinedHtml, /Refund Policy/);
  assert.match(combinedHtml, /Privacy Policy/);
  assert.match(combinedHtml, /Terms/);
});
