import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import {
  checkoutCatalog,
  normalizeCheckoutItems,
} from "../netlify/functions/lib/checkout-catalog.mjs";

const html = readFileSync(
  new URL("../out/scents/ardor.html", import.meta.url),
  "utf8",
);
const manifest = JSON.parse(
  readFileSync(
    new URL("../public/scents/ardor/manifest.json", import.meta.url),
  ),
);

test("ARDOR export has the approved identity, story and offer", () => {
  assert.match(html, /<title>ARDOR Eau de Parfum \| TARA Scents<\/title>/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  for (const text of [
    "Ignite your presence",
    "Heat held in restraint.",
    "Ignition",
    "Restraint",
    "Proximity",
    "RM169",
    "Try In RM99 Set",
  ])
    assert.ok(html.includes(text), text);
  assert.doesNotMatch(
    html,
    /ARDOR_500g_Formulation|source blend|competitor|500\.00 g/,
  );
  const data = [
    ...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g),
  ].flatMap((match) => JSON.parse(match[1]));
  const product = data.find((item) => item["@type"] === "Product");
  assert.equal(product.offers.price, "169.00");
  assert.equal(product.offers.availability, "https://schema.org/InStock");
});

test("all nine ARDOR assets and responsive derivatives resolve", () => {
  assert.equal(manifest.length, 9);
  for (const asset of manifest) {
    assert.ok(existsSync(new URL(`../public${asset.src}`, import.meta.url)));
    for (const width of asset.widths)
      assert.ok(
        existsSync(
          new URL(
            `../public${asset.src.replace(".webp", `-${width}.webp`)}`,
            import.meta.url,
          ),
        ),
      );
    assert.ok(html.includes(asset.src.replace(".webp", "")), asset.src);
  }
  assert.match(html, /<source media="\(max-width: 767px\)"/);
  assert.match(html, /ardor-editorial-mobile/);
});

test("ARDOR uses the server catalogue price", () => {
  assert.equal(checkoutCatalog.ardor.priceInSen, 16900);
  const [item] = normalizeCheckoutItems({
    items: [{ slug: "ardor", quantity: 2, priceInSen: 1 }],
  });
  assert.equal(item.priceInSen * item.quantity, 33800);
});
