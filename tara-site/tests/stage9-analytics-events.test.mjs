import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

const requiredEvents = [
  "hero_primary_cta_click",
  "discovery_set_click",
  "quiz_start",
  "quiz_complete",
  "quiz_result_revealed",
  "quiz_result_product_click",
  "product_add_to_cart",
  "cart_view",
  "checkout_start",
  "payment_redirect",
  "concierge_click",
  "email_signup",
  "manual_preorder_start",
  "manual_preorder_submit",
  "preorder_submit",
  "whatsapp_click",
  "contact_submit",
  "newsletter_signup",
];

function readProjectFile(filePath) {
  return readFileSync(path.join(projectRoot, filePath), "utf8");
}

function walkSource(directory) {
  const root = path.join(projectRoot, directory);

  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      return walkSource(path.relative(projectRoot, filePath));
    }

    return /\.(ts|tsx)$/.test(filePath) ? [path.relative(projectRoot, filePath)] : [];
  });
}

test("stage 9 declares and documents the required non-sensitive analytics events", () => {
  const analytics = readProjectFile("src/lib/analytics.ts");
  const documentation = readProjectFile("docs/analytics-events.md");

  for (const eventName of requiredEvents) {
    assert.match(analytics, new RegExp(`"${eventName}"`));
    assert.match(documentation, new RegExp("`" + eventName + "`"));
  }

  assert.match(analytics, /sanitizeUrlForAnalytics/);
  assert.ok(analytics.includes('return url.split("?")[0];'));
  assert.match(analytics, /analyticsEvents\.conciergeClick/);
});

test("stage 9 source uses the TARA event taxonomy instead of legacy raw commerce names", () => {
  const source = walkSource("src").map(readProjectFile).join("\n");

  assert.doesNotMatch(source, /trackEvent\(\s*["']add_to_cart["']/);
  assert.doesNotMatch(source, /trackEvent\(\s*["']view_cart["']/);
  assert.match(source, /analyticsEvents\.productAddToCart/);
  assert.match(source, /analyticsEvents\.cartView/);
  assert.match(source, /analyticsEvents\.checkoutStart/);
  assert.match(source, /analyticsEvents\.paymentRedirect/);
  assert.match(source, /analyticsEvents\.manualPreorderStart/);
  assert.match(source, /analyticsEvents\.manualPreorderSubmit/);
  assert.match(source, /analyticsEvents\.quizResultRevealed/);
  assert.match(source, /analyticsEvents\.quizResultProductClick/);
  assert.match(source, /analyticsEvents\.emailSignup/);
});
