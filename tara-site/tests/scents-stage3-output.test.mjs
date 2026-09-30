import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { test } from "node:test";

const scentsPath = new URL("../out/scents.html", import.meta.url);
const theonPath = new URL("../out/scents/theon.html", import.meta.url);
const sourcePaths = [
  new URL("../src/app/scents/page.tsx", import.meta.url),
  new URL("../src/components/product/ScentCatalogExplorer.tsx", import.meta.url),
  new URL("../src/components/pages/ScentDetailPage.tsx", import.meta.url),
  new URL("../src/content/commercial.ts", import.meta.url),
];
const hasFreshExport =
  existsSync(scentsPath) &&
  existsSync(theonPath) &&
  Math.min(statSync(scentsPath).mtimeMs, statSync(theonPath).mtimeMs) >=
    Math.max(...sourcePaths.map((sourcePath) => statSync(sourcePath).mtimeMs));

test("scents export renders Stage 3 catalogue filters and decision attributes", {
  skip: hasFreshExport ? false : "Run npm run build before this check.",
}, () => {
  const html = readFileSync(scentsPath, "utf8");

  [
    "Shop by feel, not gender.",
    "What are you in the mood for?",
    "Build your 3-scent discovery set",
    "Fresh / Mineral",
    "Floral / Soft",
    "Warm / Gourmand",
    "Woody / Spicy",
    "Daily / Evening",
    "Skin-Close / Noticeable",
    "New launch",
    "Sample available",
    "Recommended",
    "Occasion",
    "Add 50mL",
    "Try in 8mL set",
    "Quick view",
    "Compare",
    "Shipping calculated at checkout",
  ].forEach((text) => assert.match(html, new RegExp(text)));
});

test("scent detail export renders full-bottle and discovery-set handoff", {
  skip: hasFreshExport ? false : "Run npm run build before this check.",
}, () => {
  const html = readFileSync(theonPath, "utf8");

  assert.match(html, /Shop 50mL Bottle|Reserve 50mL Bottle/);
  assert.match(html, /Try In RM99 Set/);
  assert.match(html, /Compare Scents/);
  assert.match(html, /Purchase reassurance/);
  assert.match(html, /Shipping Policy/);
  assert.match(html, /Refund Policy/);
});
