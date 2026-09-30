# TARA homepage UI optimization

## Audit and plan
- Next.js 16 App Router, React 19, TypeScript, Tailwind 4; npm/package-lock.json. Static export (`out`) deployed with Netlify functions for ToyyibPay. No new framework or dependency needed.
- Homepage: src/app/page.tsx. Shared Header/Footer in src/components/layout; Hero, ShoppableScentFamily, ScentDiscoveryExperience, WhyTara, AboutTeaser, JournalPreview, LaunchFaq, ConversionCta, StickyMobileCta in components/sections.
- Canonical catalogue: content/scents.ts plus content/kameira.ts; commercial.ts holds shared bottle/discovery pricing and policy summaries. THEON uses RM169 launch/RM239 regular; KAMEIRA has RM169 only, so no invented regular price. Hero bottle images: THEON 900x1200 WebP; KAMEIRA 1122x1402 WebP with responsive derivatives.
- Existing order: hero (THEON only, three CTAs, policies), family (four initial products, three desktop columns, full table), trust, mini quiz, story, journal, FAQ, reserve.
- Routes preserved: /scents/theon, /scents/kameira, /cart, /cart/checkout, /preorder, /preorder?checkout=three-8ml-promo#secure-checkout, /quiz; ToyyibPay Netlify backend unchanged. No CMS fetching in homepage.
- Existing event taxonomy in lib/analytics.ts: hero_primary_cta_click, cta_click, discovery_set_click, product_add_to_cart, quiz_start, quiz_complete, quiz_result_revealed, whatsapp_click, concierge_click, newsletter_signup, email_signup, checkout/payment events. Preserve these through existing Button, QuickAddButton and quiz components.
- Breakpoints: sm 640, md 768, lg 1024, xl 1280. Risks: hidden menu remains tabbable; mobile CTA can overlap menu; overlaid card text; pale hero; long comparison table; stale seven-scent trust statistic.
- Baseline: lint/typecheck/build PASS; 29 node tests PASS. E2E running separately. Scripts: npm run dev, npm run lint, npm run typecheck, npm test, npm run build, npm run test:e2e. No separate integration script; node tests include checkout catalog integration.
- Safe branch: codex/tara-homepage-ui-optimization. Existing uncommitted work retained. Pre-edit source/tests/docs archive: /tmp/tara-ui-checkpoint/source-before.tgz; tracked diff: /tmp/tara-before-ui-optimization.patch.
- Order: paired launch content and hero; concise trust/two paths; comparable catalogue with disclosure; shared navigation accessibility; mobile actions; verification and screenshots.

## Implemented outcome
- Order: announcement/header → paired launches → compact trust → bottle/sample paths → all eight scents → existing mini quiz + concierge → trust/policies → story → three journal previews → FAQ → paired reserve CTA → footer.
- THEON and KAMEIRA co-lead the hero and catalogue, carry latest-launch labels, appear in homepage metadata, and share the final reserve CTA. Catalogue ordering elsewhere is unchanged.
- Cards use real bottle assets, a reserved aspect ratio, text outside images, canonical pricing, persistent add-to-cart controls, profile filters, and nested native comparison disclosures. KAMEIRA shows its approved fragrance journey instead of invented note pyramids.
- Mobile menu uses a native modal dialog, explicit Tab wrapping, Escape closure, focus restoration, and closure on navigation or desktop resize. Hidden sticky actions are inert; menu/modal/form focus hides them. Homepage mobile WhatsApp becomes a footer utility instead of covering product text; concierge links remain in the guidance section and menu.
- Global visible focus and reduced-motion rules; footer clearance; responsive images reuse the existing static-export ScentImage implementation. Only launch product images receive new high-priority loading; below-fold images remain lazy.
- Preserved newsletter, routes, payment functions, cart storage/events, both quiz implementations, SEO structured data, policy links and social destinations.

## Files changed for this task (relative to tara-site)
- src/app/page.tsx, src/app/globals.css
- src/content/brand.ts, src/lib/catalog.ts
- src/components/layout/Header.tsx
- src/components/sections/Hero.tsx, ShoppingPaths.tsx (new), ShoppableScentFamily.tsx, ScentDiscoveryExperience.tsx, WhyTara.tsx, AboutTeaser.tsx, LaunchFaq.tsx, ConversionCta.tsx, StickyMobileCta.tsx, FloatingWhatsAppButton.tsx
- tests/homepage-stage2-output.test.mjs (updates obsolete THEON-only hero expectations), tests/e2e/homepage.spec.ts (new)
- CODEX_IMPLEMENTATION_NOTES.md and docs/ui-verification/*.png (new)
Other existing dirty files are pre-existing work, not this implementation.

## Verification results
- Baseline: lint, typecheck, build, 29 node tests and 2 existing quiz browser tests all passed.
- Final: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, `npm run test:e2e` all PASS. 29/29 node tests; 8/8 browser tests; zero skips. Build exports 34 pages.
- Browser widths: 375, 390, 768, 1440. Verified one H1, paired launches, all eight products, launch ordering, filters, add both launches to cart, count=2, cart contents, RM99 checkout selection, expandable comparison, menu focus wrapping, Escape and restoration, and no document overflow.
- Both existing eight-question quiz tests pass. Added three-question mini-quiz completion/restart and original analytics-event assertions. Reduced motion and 200% root text sizing checked; newsletter focus hides sticky actions; menu preorder navigation closes the modal. Static homepage remains readable with JavaScript disabled and product links work.
- No page JavaScript errors in the tested shopping journeys; agent-browser error inspection also returned none. External requests and all submissions were blocked in browser tests, so no real orders or newsletter entries were created.
- Visual inspection: desktop and mobile hero, catalogue, menu and quiz/comparison captures. Screenshots at docs/ui-verification/home-{width}.png, family-{width}.png, compare-{width}.png, menu-{width}.png and quiz-390.png. Early screenshots caught lazy images before decoding; final catalogue captures wait for launch images and use the section start.
- Accessibility checks cover headings, readable non-overlay cards, semantic controls, named icons, pressed filter states, native disclosure semantics, visible focus, modal keyboard behavior, no-JS product navigation, enlarged text and reduced motion. New brown labels (#775426) use stronger contrast than pale gold; this is not a formal full-site WCAG certification or real assistive-technology audit.
- During implementation, TypeScript caught optional-price and profile-union issues; fixed before final build. Browser tests caught Shift+Tab leaving the native dialog; explicit wrapping fixed it. One command was initially run at the workspace root (no lint script), then rerun successfully from tara-site.

## Analytics
No event names removed or renamed, no new event taxonomy or personal-data payloads added. Existing tracked buttons keep hero_primary_cta_click, discovery_set_click and cta_click; product links carry selected_scent. QuickAddButton retains product_add_to_cart. Quiz, WhatsApp/concierge, newsletter and checkout/payment components retain their existing events. Tested hero_primary_cta_click, quiz_start, quiz_complete, quiz_result_revealed; existing full-quiz tests cover its result events.

## Deliberate variations and limitations
- No new unsupported claims: omitted the old hardcoded “127 discovery sets sold this month” and obsolete seven-bottle trust statistics from rendering. Their source data was not changed. Trust credentials remain available through disclosure.
- KAMEIRA has RM169 configured without launchPrice/regularPrice; therefore its price is shown without an invented RM239 comparison. Other products retain RM169 launch/RM239 regular.
- Kept existing mini-quiz scoring and full-quiz scoring unchanged. The three-question quiz has legacy weights; the full quiz supports both latest launches.
- Policies retain their canonical wording and the existing reassurance component below scent guidance; no delivery promises were added.
- Existing full-family social preview image is retained as a neutral house image; metadata description explicitly includes both launches. No fabricated paired photographic asset.
- Payment-provider settlement, live forms, real newsletter delivery, external analytics ingestion, Safari/Firefox, and a screen-reader audit were not exercised. No production deployment performed.

## Run and deploy
Run from `/Users/vigneshramoo/Documents/TARA/tara-site`:
```sh
npm run dev
```
Production export and verification:
```sh
npm run lint
npm run typecheck
npm run build
npm test
npm run test:e2e
```
Static local preview (used for verification; default port 3100):
```sh
node tests/helpers/serve-export.mjs
```
Existing Netlify production deployment, when desired and authenticated to the correct linked site:
```sh
npx netlify-cli deploy --build --prod
```
`npm run start` is not the preview command for this static-export configuration. Netlify builds with npm run build, publishes out, and deploys netlify/functions per netlify.toml.

## Rollback
Do not reset the repository: it contains substantial pre-existing uncommitted work. The archive `/tmp/tara-ui-checkpoint/source-before.tgz` contains the pre-edit src/tests/docs, including untracked source. Extract it into a temporary directory, then copy back only the changed existing files listed above; remove the newly added ShoppingPaths.tsx, homepage.spec.ts, this note and task screenshot directory if desired. Review any edits made since this task before restoring. The tracked pre-task diff is `/tmp/tara-before-ui-optimization.patch`; branch is codex/tara-homepage-ui-optimization. The /tmp checkpoint is local and temporary.

## Production deployment — 2026-09-21
User authorized production deployment. Netlify site tarascents (b47b498b-fad5-428e-82f3-bb58ba8eb17b) successfully deployed with the existing build and functions configuration.
- Live URL: https://tarascents.com
- Deploy ID: 6ab019211e08e107ec975443
- Immutable URL: https://6ab019211e08e107ec975443--tarascents.netlify.app
- Logs: https://app.netlify.com/projects/tarascents/deploys/6ab019211e08e107ec975443
- Production build and function bundling passed. Netlify Lighthouse: performance 87, accessibility 96, best practices 100, SEO 100, PWA 40.
- Public GET verification: homepage, THEON, KAMEIRA, sample preorder route, cart, and quiz all HTTP 200. Public homepage contains paired launches and both shopping paths.
- No live payments or form submissions performed.
