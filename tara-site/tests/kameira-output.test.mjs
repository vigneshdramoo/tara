import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";
import { checkoutCatalog, normalizeCheckoutItems } from "../netlify/functions/lib/checkout-catalog.mjs";
const html = readFileSync(new URL("../out/scents/kameira.html", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../public/scents/kameira/manifest.json", import.meta.url)));

test("KAMEIRA export has approved identity, four-stage journey and confirmed prices", () => {
  assert.match(html, /<title>KAMEIRA Eau de Parfum \| TARA Scents<\/title>/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  for (const text of ["Blackcurrant Wine", "Velvet Rose", "Warm Gourmand Glow", "Burnished Amber", "RM169", "RM45", "Try In RM99 Set"]) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /La Vie Est Belle|Flowerbomb|Labdanum resinoid|439\.75|35\.20%/);
  const data = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].flatMap(match => JSON.parse(match[1]));
  const product = data.find(item => item["@type"] === "Product");
  assert.equal(product.offers.price, "169.00");
  assert.equal(product.offers.availability, "https://schema.org/InStock");
  assert.equal(product.sku, undefined);
  assert.equal(product.aggregateRating, undefined);
});

test("all nine KAMEIRA assets and responsive derivatives resolve with mobile art direction", () => {
  assert.equal(manifest.length, 9);
  for (const asset of manifest) {
    assert.ok(existsSync(new URL(`../public${asset.src}`, import.meta.url)));
    for (const width of asset.widths) assert.ok(existsSync(new URL(`../public${asset.src.replace('.webp', `-${width}.webp`)}`, import.meta.url)));
    assert.ok(html.includes(asset.src.replace('.webp', '')), asset.src);
  }
  assert.match(html, /srcSet="[^"]+640w/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /fetchPriority="high"/);
  assert.match(html, /<source media="\(max-width: 767px\)"/);
  assert.match(html, /kameira-editorial-mobile/);
});

test("KAMEIRA uses the server catalogue price regardless of client price claims", () => {
  assert.equal(checkoutCatalog.kameira.priceInSen, 16900);
  const [item] = normalizeCheckoutItems({ items: [{ slug: "kameira", quantity: 2, priceInSen: 1 }] });
  assert.equal(item.priceInSen * item.quantity, 33800);
});
