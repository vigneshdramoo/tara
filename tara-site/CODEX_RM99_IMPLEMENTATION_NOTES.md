# RM99 configured discovery sets

## Audit
Next.js 16 / React 19 / npm / static export + Netlify functions. Existing route: /preorder?checkout=three-8ml-promo#secure-checkout. PaymentCheckoutForm builds a localStorage cart; CartView reviews it; CheckoutForm records a Netlify lead and POSTs to create-toyyibpay-bill. Provider redirect uses the existing payment result/status endpoint and signed callback.
Canonical source: src/content/scents.ts + kameira.ts, availability status and profile.sampleAvailable; commercial.ts defines RM99 product. All eight current scents are eligible. Server checkout-catalog.mjs previously duplicated product names/prices with no eligibility data. Plan: generate the server catalogue from canonical content at prebuild, share pure validation rules, and keep IDs in cart configuration.
Existing CartItem: slug/quantity only, merged by slug. New configuration: { type: "three-8ml-discovery-set", scentIds: string[] }. Canonical sorted IDs give stable line identity; identical trios increment quantity, different trios remain distinct. Invalid/legacy sets remain visible but cannot check out; remove-and-reselect path (no existing edit UI).
Order records currently consist of Netlify lead/form or merchant email, with failures swallowed. For configured sets, durable structured storage is required before returning a payment link: reuse installed Netlify Blobs with an order snapshot and private receipt access token. No new database or provider. Keep callback signature logic and monetary calculation intact; carry canonical names into merchant notification and provider description/email. Receipt retrieval must require the token; no PII in receipt responses.
Risks: legacy carts, prototype property slugs, duplicate selections, stale eligibility, two different sets merged by slug, double submits, storage failure, payment return clearing cart before server verification, cross-tab stale cart, truncated provider bill description.
Baseline lint/typecheck/build and 29 node tests passed. E2E running; one homepage desktop test failed and will be diagnosed before final verification. No standalone integration script; node tests will exercise function handlers with mocked external services.
Checkpoint: codex/rm99-scent-selection; /tmp/tara-rm99-checkpoint/before.tgz. Existing uncommitted work retained.

## Implementation
- Existing URL and `checkout=three-8ml-promo` behavior retained. `DiscoverySetPicker` uses native labelled checkboxes, original product imagery/profiles, selection text, live count, a summary jump link, and a disabled add button until exactly three unique eligible IDs are chosen. All eight canonical sample-eligible available scents appear.
- Draft key: `tara-discovery-selection-v1`. Partial and complete choices survive refresh/back navigation. Stale choices are removed from the draft with an explicit replacement message. Storage errors are visible. Double activation cannot add twice; change a choice to build another configuration, or use cart quantity controls for identical sets.
- Cart storage key remains `tara-cart-items`. Each configured line has `slug`, `quantity`, `configuration: { type: "three-8ml-discovery-set", scentIds: [...] }`. Persisted IDs are sorted lexicographically by canonical slug for deterministic identity; draft choices keep click order. Identical sets merge under the existing max quantity of 12 per line; different trios use separate keys. Existing total limit of 24 remains enforced server-side.
- Missing/invalid configurations stay visible in the cart, with remove-and-reselect instructions. Both cart and direct checkout block invalid discovery lines. Checkout compares its reviewed snapshot to current device storage before submitting; a changed cart requires review. No prices/names from browser configuration are trusted.
- `shared/discovery-set.mjs` validates type, array shape, exactly three entries, duplicates, IDs and eligibility. It deduplicates for validation but rejects input containing duplicates rather than silently accepting them. Server validation rejects the entire malformed mixed cart; it does not silently drop invalid lines and create a partial order.
- `npm run prebuild` generates `netlify/functions/lib/generated-checkout-catalog.mjs` from canonical TypeScript content. Both authoritative prices and eligibility originate in the existing product data. Eligibility changes take effect on rebuild/deployment, as with the existing static catalogue; there is no runtime CMS/inventory feed.

## Order and payment flow
- Existing delivery fields, shipping treatment, ToyyibPay amount, channel, callback signature, return URL and hosted payment flow are retained. One set remains 9900 sen / RM99 before existing shipping handling.
- Configured orders are saved in the existing Netlify Blobs service (`tara-discovery-orders`) before the provider bill is created. Snapshot fields: orderReference, canonical items/configurations (IDs, scentNames, selectionLabel), amountInSen, createdAt, receiptTokenHash, then billCode. No addresses, email, phone or customer names are added to this new store.
- Keys: `orders/<orderReference>.json` and `bills/<billCode>.json`. A write failure fails closed with a recoverable 503, without returning a payment URL. If bill creation succeeded but mapping fails, a provider bill may remain unused; the customer is not redirected to it.
- Full selected names are included in merchant itemSummary, structured orderItems, Netlify order-event `order_items`, provider billContentEmail, and the durable snapshot. The existing 100-character provider billDescription limit is preserved; the snapshot and full email summary are the fulfillment record, not that truncated description.
- Signed callback validation is unchanged. After verification, callback notifications look up the durable order and include its configured items.
- Receipt token: random 32-byte capability; only its SHA-256 hash is stored server-side. The browser stores the token under `tara-receipt-<billCode>` and supplies it in `X-Tara-Receipt`. It is never put in an indexable URL or analytics. Order items are returned only for an authorized receipt; responses use private/no-store caching and exclude customer PII and token hashes.
- PaymentResultContent renders the canonical trio from the server receipt. Failed/pending payments preserve cart data. A success query parameter alone cannot clear the cart. Verified receipts remove only purchased quantities, retain new/unpaid configurations and use a per-bill device marker to avoid repeated removal on refresh.
- Normal bottle purchases do not require the discovery order store. QuickAddButton routes any discovery-set use to configuration instead of creating an unconfigured set.

## Changed files
Existing:
- package.json (prebuild catalogue generation)
- src/content/commercial.ts (selection instructions)
- src/lib/cart.ts, src/lib/analytics.ts
- src/components/payments/PaymentCheckoutForm.tsx
- src/components/cart/CartView.tsx, CheckoutForm.tsx, QuickAddButton.tsx
- src/components/pages/PaymentResultContent.tsx
- netlify/functions/create-toyyibpay-bill.mjs, get-toyyibpay-bill-status.mjs, toyyibpay-callback.mjs
- netlify/functions/lib/checkout-catalog.mjs, order-email.mjs
- public/netlify-forms.html
- tests/commercial-config.test.mjs (configured discovery fixture)
- tests/e2e/homepage.spec.ts (wait for cart navigation before starting the next navigation)
New:
- src/lib/discovery.ts
- src/components/product/DiscoverySetPicker.tsx
- shared/discovery-set.mjs, shared/discovery-set.d.mts
- scripts/build-checkout-catalog.mjs, scripts/lib/load-content.mjs
- netlify/functions/lib/generated-checkout-catalog.mjs, discovery-orders.mjs
- tests/discovery-set.test.mjs, tests/e2e/discovery.spec.ts
- CODEX_RM99_IMPLEMENTATION_NOTES.md, docs/rm99-verification/*.png

## Analytics
Preserved existing product_add_to_cart, form_start, checkout_start, payment_checkout_start, payment_redirect, payment_status_view and payment_success events. New client-owned events declared centrally: discovery_set_view, discovery_set_selection_started, discovery_set_scent_selected, discovery_set_scent_deselected, discovery_set_selection_completed, discovery_set_add_to_cart. Payloads contain only configuration type, count, scent IDs and quantity. No server duplicates or customer PII. View/start events are guarded per mounted picker; completion can reoccur after an intentional replacement.

## Verification
Baseline: lint/typecheck/production build and 29 node tests passed. 14/15 browser tests passed; the homepage desktop test raced its cart navigation against the next goto. Added an explicit URL assertion; subsequent full runs pass.
Final: lint/typecheck/build PASS; 38/38 node tests PASS with no skips; 24/24 browser tests PASS with no skips. Final screenshot-only test adjustments were followed by a passing 9/9 discovery browser run. No separate integration script exists: mocked function handler integration is included in the node suite. Netlify functions bundled successfully into /tmp/tara-rm99-functions, including the shared validator and generated catalogue.
A payment-enabled local build (`NEXT_PUBLIC_PAYMENTS_ENABLED=true`) also passed the full 23-test browser suite before the extra receipt-refresh regression test was added. The checkout test intercepted the actual bill-creation POST and verified scent IDs, one request for repeated activation, and retained cart after a mocked 503. Afterwards the normal environment build was restored; the payment toggle is unchanged. No real payment, merchant notification, Netlify form submission or external analytics was sent.
Node tests cover exactly 3 vs 0/1/2/4, duplicates, unknown/ineligible/unavailable IDs, wrong shapes, legacy lines, canonical names/prices, variant identity, totals, bottle compatibility, strict mixed-cart rejection, durable-write-before-provider ordering, write/network failures, token authorization, private receipt caching and safe status errors.
Browser tests cover native Space activation, selected state/counter, fourth-choice message, deselect/reselect, partial/full refresh, back navigation, two distinct trios, rapid add/submit, cart/checkout labels, legacy recovery, blocked storage, server-payload preservation, failed/pending/spoofed returns, receipt display, and paid-quantity removal exactly once.
Widths: 375, 390, 768, 1440. No horizontal document overflow in tested checkout journeys; no page JavaScript errors in the configured-set journey. Screenshots captured and inspected: before, one selected, three selected/CTA, validation, cart, checkout at each width under docs/rm99-verification. Existing imagery is reused; the new fieldset has visible focus, native checkbox semantics, non-color selected text, large label touch targets and polite status announcements. Existing reduced-motion CSS applies. This is not a formal screen-reader or whole-site WCAG certification.
No-JS: descriptive disabled selector and concierge fallback remain; purchasing still requires JavaScript, consistent with the existing cart.

## Commands
From /Users/vigneshramoo/Documents/TARA/tara-site:
```sh
npm run dev
npm run lint
npm run typecheck
npm run build
npm test
npm run test:e2e
```
Payment-enabled local fixture (browser tests block external requests and mock submissions):
```sh
NEXT_PUBLIC_PAYMENTS_ENABLED=true npm run build
RM99_PAYMENT_E2E=1 npm run test:e2e -- tests/e2e/discovery.spec.ts
npm run build
```
Functions-only packaging (no deployment):
```sh
npx netlify-cli functions:build --src netlify/functions --functions /tmp/tara-rm99-functions
```

## Limitations / deployment
Deployed to production on 22 September 2026. Real ToyyibPay settlement, production Blobs access and merchant email delivery have not been exercised; handlers and failure branches were tested with mocks and Netlify packaging passed. Deployment must include generated functions, static export and the updated hidden Netlify form. Blobs uses the existing installed SDK/runtime integration and fails closed if unavailable.
No new admin dashboard or customer-email system was added: the existing merchant email/form and provider email content carry the choices. Receipt item visibility is bound to the originating browser's private token; another device can still use the existing payment-status/concierge flow. Existing order snapshots are retained in the private Blobs store; no new retention/deletion job was introduced.

## Rollback
Preserve unrelated uncommitted work. Restore only the existing files listed above from /tmp/tara-rm99-checkpoint/before.tgz, remove the new source/helper/test files if rolling back, and rebuild. Do not reset the entire repository. After any real configured orders exist, retain their private Blobs records and keep fulfillment access through notifications; rolling back UI code must not delete customer order configurations. Branch: codex/rm99-scent-selection. Checkpoint is local/temporary.

## Production deployment — 22 September 2026
- Production: https://tarascents.com
- Deploy ID: `6ab266aa6be4521b8ac6809d`
- Immutable deploy: https://6ab266aa6be4521b8ac6809d--tarascents.netlify.app
- `netlify deploy --build --prod` completed successfully, including static export and functions.
- Live mobile browser verification passed: eight eligible scents, add disabled until three selected, RM99 configured cart, choices preserved on reload and in checkout review, no browser runtime errors. External requests and non-GET requests were blocked during verification; no order or payment was submitted.
- Deployment Lighthouse: performance 89, accessibility 96, best practices 100, SEO 100.
