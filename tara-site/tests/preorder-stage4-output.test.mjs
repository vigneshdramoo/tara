import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { test } from "node:test";

const preorderPath = new URL("../out/preorder.html", import.meta.url);
const cartPath = new URL("../out/cart.html", import.meta.url);
const checkoutPath = new URL("../out/cart/checkout.html", import.meta.url);
const netlifyFormsPath = new URL("../public/netlify-forms.html", import.meta.url);
const cartViewSourcePath = new URL("../src/components/cart/CartView.tsx", import.meta.url);
const checkoutFormSourcePath = new URL(
  "../src/components/cart/CheckoutForm.tsx",
  import.meta.url,
);
const sourcePaths = [
  new URL("../src/app/preorder/page.tsx", import.meta.url),
  new URL("../src/components/payments/PaymentCheckoutForm.tsx", import.meta.url),
  new URL("../src/components/forms/PreorderForm.tsx", import.meta.url),
  new URL("../src/components/cart/CartView.tsx", import.meta.url),
  new URL("../src/components/cart/CheckoutForm.tsx", import.meta.url),
  new URL("../src/content/brand.ts", import.meta.url),
  new URL("../src/content/commercial.ts", import.meta.url),
];
const hasFreshExport =
  existsSync(preorderPath) &&
  existsSync(cartPath) &&
  existsSync(checkoutPath) &&
  Math.min(
    statSync(preorderPath).mtimeMs,
    statSync(cartPath).mtimeMs,
    statSync(checkoutPath).mtimeMs,
  ) >= Math.max(...sourcePaths.map((sourcePath) => statSync(sourcePath).mtimeMs));

function extractNamedForm(html, formName) {
  const formStart = html.indexOf(`name="${formName}"`);
  assert.notEqual(formStart, -1, `${formName} form should exist`);
  const nextForm = html.indexOf("<form", formStart + 1);

  return nextForm === -1 ? html.slice(formStart) : html.slice(formStart, nextForm);
}

test("preorder export presents cart-first checkout before concierge ordering", {
  skip: hasFreshExport ? false : "Run npm run build before this check.",
}, () => {
  const html = readFileSync(preorderPath, "utf8");

  assert.match(html, /Choose your scent\. Cart first, ToyyibPay next\./);
  assert.match(html, /Choose Product/);
  assert.match(html, /Choose, add, review, then pay\./);
  assert.match(html, /Selected Product/);
  assert.match(html, /Subtotal Before Shipping/);
  assert.match(html, /Payment is not taken on this page/);
  assert.match(html, /Need help choosing\?/);
  assert.match(
    html,
    /Concierge order for gifting, events, bridal, wholesale, or multiple bottles\./,
  );
  assert.match(html, /No full delivery address is needed here/);
  assert.doesNotMatch(html, />Add To Cart<\/a>/);
});

test("cart and checkout components show totals, shipping handling, policies, and ToyyibPay finality", () => {
  const cartSource = readFileSync(cartViewSourcePath, "utf8");
  const checkoutSource = readFileSync(checkoutFormSourcePath, "utf8");

  assert.match(cartSource, /Subtotal/);
  assert.match(cartSource, /Estimated total before shipping/);
  assert.match(cartSource, /checkoutExperience\.shippingAtCheckout/);
  assert.match(cartSource, /PurchaseReassurance/);

  assert.match(checkoutSource, /Shipment Details/);
  assert.match(checkoutSource, /Pay securely via ToyyibPay/);
  assert.match(checkoutSource, /Shipping is not included/);
  assert.match(checkoutSource, /checkoutExperience\.shippingAtCheckout/);
  assert.match(checkoutSource, /PurchaseReassurance/);
});

test("Netlify preorder form no longer registers delivery-address fields", () => {
  const html = readFileSync(netlifyFormsPath, "utf8");
  const preorderForm = extractNamedForm(html, "tara-preorder");
  const checkoutForm = extractNamedForm(html, "tara-cart-checkout");

  [
    "address_line_1",
    "address_line_2",
    "address_line_3",
    "city",
    "zipcode",
    "country",
  ].forEach((fieldName) => {
    assert.doesNotMatch(preorderForm, new RegExp(`name="${fieldName}"`));
    assert.match(checkoutForm, new RegExp(`name="${fieldName}"`));
  });
});
