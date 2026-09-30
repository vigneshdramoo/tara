import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { validateDiscoverySelection } from "../shared/discovery-set.mjs";
import {
  normalizeCheckoutItems,
  checkoutCatalog,
  eligibleDiscoveryScents,
  checkoutItemSummary,
} from "../netlify/functions/lib/checkout-catalog.mjs";
import generated from "../netlify/functions/lib/generated-checkout-catalog.mjs";
import { buildCheckoutCatalog } from "../scripts/lib/load-content.mjs";
import { createHandler } from "../netlify/functions/create-toyyibpay-bill.mjs";
import { createHandler as createStatusHandler } from "../netlify/functions/get-toyyibpay-bill-status.mjs";
import {
  buildOrderSnapshot,
  authorizedReceipt,
} from "../netlify/functions/lib/discovery-orders.mjs";
const configuration = (scentIds = ["aureya", "theon", "kameira"]) => ({
  type: "three-8ml-discovery-set",
  scentIds,
});
const line = (ids, quantity = 1) => ({
  slug: "three-8ml-promo",
  quantity,
  configuration: configuration(ids),
});
const eligible = Object.keys(eligibleDiscoveryScents);

// Exercise actual TypeScript cart code without adding a test runtime dependency.
function loadTs(filename, cache = new Map()) {
  if (cache.has(filename)) return cache.get(filename).exports;
  const target = { exports: {} };
  cache.set(filename, target);
  const requireHere = createRequire(filename);
  const load = (id) =>
    id.startsWith("@/")
      ? loadTs(path.resolve("src", `${id.slice(2)}.ts`), cache)
      : requireHere(id);
  const code = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, {
    filename,
  })(load, target, target.exports);
  return target.exports;
}
const { sanitizeCartItems, cartLineKey } = loadTs(
  path.resolve("src/lib/cart.ts"),
);
const { validateCheckoutDetails, firstCheckoutError } = loadTs(
  path.resolve("src/lib/checkout-validation.ts"),
);

test("checkout details return ordered inline errors and accept optional address line 2", () => {
  const empty = validateCheckoutDetails(new FormData());
  assert.deepEqual(Object.keys(empty), [
    "name",
    "email",
    "phone",
    "address_line_1",
    "city",
    "zipcode",
    "country",
  ]);
  assert.equal(firstCheckoutError(empty), "name");

  const invalid = new FormData();
  for (const [key, value] of Object.entries({
    name: "Test customer",
    email: "invalid",
    phone: "12",
    address_line_1: "Test address",
    city: "Test city",
    zipcode: "00000",
    country: "Malaysia",
  })) invalid.set(key, value);
  assert.deepEqual(validateCheckoutDetails(invalid), {
    email: "Enter a valid email address.",
    phone: "Enter a valid phone number with 8 to 15 digits.",
  });
  invalid.set("email", "test@example.test");
  invalid.set("phone", "+60 12-345 6789");
  assert.deepEqual(validateCheckoutDetails(invalid), {});
});

test("server catalogue and eligibility are generated from current canonical data", () => {
  assert.deepEqual(generated, buildCheckoutCatalog());
  assert.equal(eligible.length, 8);
  assert.equal(checkoutCatalog["three-8ml-promo"].priceInSen, 9900);
});
test("exactly three unique eligible IDs are required; invalid and unavailable choices fail", () => {
  assert.equal(
    validateDiscoverySelection(configuration(), eligible).valid,
    true,
  );
  for (const ids of [
    [],
    ["aureya"],
    ["aureya", "theon"],
    ["aureya", "theon", "kameira", "maris"],
    ["theon", "theon", "aureya"],
    ["aureya", "theon", "unknown"],
    ["aureya", "theon", "three-8ml-promo"],
    ["aureya", "theon", null],
  ]) {
    assert.equal(
      validateDiscoverySelection(configuration(ids), eligible).valid,
      false,
    );
    assert.throws(() => normalizeCheckoutItems({ items: [line(ids)] }));
  }
  assert.equal(
    validateDiscoverySelection(
      configuration(),
      eligible.filter((id) => id !== "theon"),
    ).valid,
    false,
  );
  for (const value of [null, {}, { scentIds: ["aureya", "theon", "kameira"] }])
    assert.equal(validateDiscoverySelection(value, eligible).valid, false);
});
test("cart identity separates trios, merges identical choices, preserves IDs and bottle totals", () => {
  const result = sanitizeCartItems(
    [
      line(),
      line(["kameira", "aureya", "theon"]),
      line(["maris", "eliora", "ardor"]),
      { slug: "theon", quantity: 2 },
    ],
    (slug) => Object.hasOwn(checkoutCatalog, slug),
  );
  assert.equal(result.length, 3);
  assert.equal(result[0].quantity, 2);
  assert.deepEqual(result[0].configuration.scentIds, [
    "aureya",
    "kameira",
    "theon",
  ]);
  assert.notEqual(cartLineKey(result[0]), cartLineKey(result[1]));
  assert.deepEqual(
    sanitizeCartItems(JSON.parse(JSON.stringify(result)), () => true),
    result,
  );
  assert.equal(
    result.reduce(
      (sum, item) =>
        sum + checkoutCatalog[item.slug].priceInSen * item.quantity,
      0,
    ),
    63500,
  );
  const legacy = sanitizeCartItems(
    [{ slug: "three-8ml-promo", quantity: 1 }],
    () => true,
  );
  assert.equal(legacy.length, 1);
  assert.throws(() => normalizeCheckoutItems({ items: legacy }));
  assert.deepEqual(
    sanitizeCartItems(null, () => true),
    [],
  );
});
test("server distrusts browser price and names and never silently drops an invalid mixed-cart line", () => {
  const [result] = normalizeCheckoutItems({
    items: [
      {
        ...line(),
        name: "Fake",
        priceInSen: 1,
        configuration: { ...configuration(), scentNames: ["Fake"] },
      },
    ],
  });
  assert.equal(result.priceInSen, 9900);
  assert.deepEqual(result.configuration.scentNames, [
    "AUREYA",
    "KAMEIRA",
    "THEON",
  ]);
  assert.equal(result.quantity, 1);
  assert.match(checkoutItemSummary([result]), /AUREYA · KAMEIRA · THEON/);
  for (const slug of ["unknown", "constructor", "__proto__"])
    assert.throws(() =>
      normalizeCheckoutItems({ items: [line(), { slug, quantity: 1 }] }),
    );
  assert.throws(() =>
    normalizeCheckoutItems({
      items: [line(), { slug: "theon", quantity: -1 }],
    }),
  );
  assert.equal(
    normalizeCheckoutItems({
      items: [line(), line(["maris", "eliora", "ardor"])],
    }).length,
    2,
  );
});
const eventFor = (items) => ({
  httpMethod: "POST",
  headers: { host: "example.test" },
  body: JSON.stringify({
    items,
    name: "Test",
    email: "test@example.test",
    phone: "00000000",
    addressLine1: "Test",
    addressLine2: "Test",
    city: "Test",
    zipcode: "00000",
    country: "Malaysia",
  }),
});

test("checkout persists structured choices and canonical merchant summary before returning the unchanged RM99 payment link", async () => {
  process.env.TOYYIBPAY_SECRET_KEY = "test-secret";
  process.env.TOYYIBPAY_CATEGORY_CODE = "test-category";
  const sequence = [];
  const snapshots = [];
  let notification;
  let providerPayload;
  const handler = createHandler({
    saveOrder: async (_event, snapshot, billCode) => {
      sequence.push(billCode ? "mapped" : "stored");
      snapshots.push(snapshot);
    },
    fetcher: async (_url, options) => {
      sequence.push("provider");
      providerPayload = new URLSearchParams(options.body);
      return Response.json([{ BillCode: "testbill" }]);
    },
    notify: async (_event, parameters) => {
      notification = parameters;
    },
  });
  const result = await handler(eventFor([line()]));
  const body = JSON.parse(result.body);
  assert.equal(result.statusCode, 200);
  assert.deepEqual(sequence, ["stored", "provider", "mapped"]);
  assert.equal(providerPayload.get("billAmount"), "9900");
  assert.equal(providerPayload.get("billPaymentChannel"), "2");
  assert.equal(
    providerPayload.get("billReturnUrl"),
    "https://example.test/payment/result",
  );
  assert.match(providerPayload.get("billCallbackUrl"), /toyyibpay-callback$/);
  assert.match(
    providerPayload.get("billContentEmail"),
    /AUREYA · KAMEIRA · THEON/,
  );
  assert.match(notification.itemSummary, /AUREYA · KAMEIRA · THEON/);
  assert.deepEqual(
    JSON.parse(notification.orderItems)[0].configuration.scentIds,
    ["aureya", "kameira", "theon"],
  );
  assert.match(body.receiptToken, /^[a-f0-9]{64}$/);
  assert.ok(authorizedReceipt(snapshots[0], body.receiptToken));
  assert.equal(authorizedReceipt(snapshots[0], "a".repeat(64)), null);
  assert.equal(authorizedReceipt(snapshots[0], undefined), null);
  assert.equal(snapshots[0].customerEmail, undefined);
});
test("invalid selections and persistence failures cannot reach hosted payment", async () => {
  let providerCalls = 0;
  const handler = createHandler({
    saveOrder: async () => {
      throw new Error("private failure");
    },
    notify: async () => {},
    fetcher: async () => {
      providerCalls++;
      return Response.json([{ BillCode: "test" }]);
    },
  });
  const invalid = await handler(
    eventFor([{ slug: "three-8ml-promo", quantity: 1 }]),
  );
  assert.equal(invalid.statusCode, 400);
  const unavailableStore = await handler(eventFor([line()]));
  assert.equal(unavailableStore.statusCode, 503);
  assert.equal(providerCalls, 0);
  assert.doesNotMatch(unavailableStore.body, /private failure/);
  const bottle = await handler(eventFor([{ slug: "theon", quantity: 1 }]));
  assert.equal(bottle.statusCode, 200); // Existing bottle orders do not require the discovery store.
});
test("provider and post-provider storage failures return recoverable errors without redirect", async () => {
  let saves = 0;
  const handler = createHandler({
    saveOrder: async () => {
      if (++saves > 1) throw new Error("fail");
    },
    notify: async () => {},
    fetcher: async () => Response.json([{ BillCode: "test" }]),
  });
  const result = await handler(eventFor([line()]));
  assert.equal(result.statusCode, 503);
  assert.equal(JSON.parse(result.body).paymentUrl, undefined);
  const network = createHandler({
    saveOrder: async () => {},
    fetcher: async () => {
      throw new Error("private network data");
    },
  });
  const failed = await network(eventFor([line()]));
  assert.equal(failed.statusCode, 500);
  assert.doesNotMatch(failed.body, /private network data/);
});
test("server rejects invalid contact formats and accepts optional address line 2", async () => {
  let providerCalls = 0;
  const handler = createHandler({
    saveOrder: async () => {},
    notify: async () => {},
    fetcher: async () => {
      providerCalls++;
      return Response.json([{ BillCode: "test" }]);
    },
  });
  for (const replacement of [{ email: "invalid" }, { phone: "12" }]) {
    const event = eventFor([{ slug: "theon", quantity: 1 }]);
    event.body = JSON.stringify({ ...JSON.parse(event.body), ...replacement });
    assert.equal((await handler(event)).statusCode, 400);
  }
  const optionalLine = eventFor([{ slug: "theon", quantity: 1 }]);
  const body = JSON.parse(optionalLine.body);
  delete body.addressLine2;
  optionalLine.body = JSON.stringify(body);
  assert.equal((await handler(optionalLine)).statusCode, 200);
  assert.equal(providerCalls, 1);
});
test("receipt endpoint exposes only token-authorized items with no-store caching", async () => {
  const token = "b".repeat(64);
  const items = normalizeCheckoutItems({ items: [line()] });
  const snapshot = buildOrderSnapshot("TARA-test", items, 9900, token);
  const handler = createStatusHandler({
    getReceipt: async (event) =>
      authorizedReceipt(snapshot, event.headers["x-tara-receipt"]),
    fetcher: async () =>
      Response.json([
        {
          billpaymentStatus: "1",
          billpaymentAmount: "99.00",
          billExternalReferenceNo: "TARA-test",
        },
      ]),
  });
  for (const provided of [undefined, "invalid", token]) {
    const result = await handler({
      httpMethod: "GET",
      queryStringParameters: { billcode: "testbill" },
      headers: { "x-tara-receipt": provided },
    });
    assert.equal(result.headers["Cache-Control"], "private, no-store");
    const body = JSON.parse(result.body);
    assert.equal(body.status, "success");
    assert.equal(body.amountInSen, 9900);
    assert.equal(Boolean(body.items), provided === token);
    assert.equal(body.receiptTokenHash, undefined);
  }
});


test("receipt-store and provider failures return safe errors rather than confirming payment", async () => {
  for (const failure of ["store", "provider"]) {
    const handler = createStatusHandler({
      getReceipt: async () => { if (failure === "store") throw new Error("private store detail"); return null; },
      fetcher: async () => { throw new Error("private provider detail"); },
    });
    const result = await handler({ httpMethod: "GET", queryStringParameters: { billcode: "test" }, headers: {} });
    assert.equal(result.statusCode, 500);
    assert.doesNotMatch(result.body, /private/);
    assert.equal(JSON.parse(result.body).status, undefined);
  }
});
