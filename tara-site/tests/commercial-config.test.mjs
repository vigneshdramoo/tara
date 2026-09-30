import assert from "node:assert/strict";
import { test } from "node:test";

import {
  checkoutCatalog,
  normalizeCheckoutItems,
  requiredCheckoutSlugs,
} from "../netlify/functions/lib/checkout-catalog.mjs";

test("checkout catalog exposes every current public commerce slug", () => {
  assert.deepEqual(requiredCheckoutSlugs, [
    "three-8ml-promo",
    "aureya",
    "zephyr",
    "maris",
    "eliora",
    "ashoka",
    "ardor",
    "theon",
    "kameira",
  ]);

  requiredCheckoutSlugs.forEach((slug) => {
    const product = checkoutCatalog[slug];

    assert.ok(product, `${slug} is missing from checkout catalog`);
    assert.equal(typeof product.name, "string", `${slug} needs a product name`);
    assert.ok(product.name.length > 0, `${slug} needs a visible product name`);
    assert.equal(
      typeof product.priceInSen,
      "number",
      `${slug} needs a numeric price in sen`,
    );
    assert.ok(product.priceInSen > 0, `${slug} needs a positive price`);
  });
});

test("checkout catalog accepts all current scents and the RM99 discovery set", () => {
  const cartItems = normalizeCheckoutItems({
    items: requiredCheckoutSlugs.map((scentSlug) => ({
      scentSlug,
      quantity: 1,
      ...(scentSlug === "three-8ml-promo" ? { configuration: { type: "three-8ml-discovery-set", scentIds: ["aureya", "theon", "kameira"] } } : {}),
    })),
  });

  assert.equal(cartItems.length, requiredCheckoutSlugs.length);
  assert.equal(
    cartItems.reduce((total, item) => total + item.priceInSen * item.quantity, 0),
    145100,
  );
});

test("legacy marin carts are canonicalized to maris", () => {
  assert.deepEqual(normalizeCheckoutItems({ scentSlug: "marin", quantity: 2 }), [
    {
      slug: "maris",
      name: "MARIS",
      priceInSen: 16900,
      quantity: 2,
    },
  ]);
});
