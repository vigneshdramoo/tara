# AUREYA implementation report

## Product and commerce
Updated the existing /scents/aureya record and shared Next.js static-export page. AUREYA is Fragrance No. 01, Eau de Parfum, with 50 ml and 8 ml imagery and format information.
Preserved canonical commerce: RM169 launch / RM239 regular for the 50 ml bottle and eligibility for the RM99 three-fragrance 8 ml discovery set. The existing payments feature flag and reservation/checkout handoffs remain unchanged. No new standalone 8 ml checkout variant, product ID, stock claim or payment logic was introduced. No real payment was submitted.

## Assets
All nine supplied PNG masters were copied byte-for-byte to Content Library/Scents/AUREYA/Images. The adjacent Website Asset Refresh.md records SHA-256 checksums.
Public delivery: public/scents/aureya, 44 new WebP files plus manifest.json, approximately 2.49 MB combined for every generated size (not a per-page transfer).
The build-aureya-product-assets.mjs script reproduces these assets using the existing Sharp pipeline.

| Role | Status |
| --- | --- |
| 50 ml primary hero | Integrated, first gallery and commerce image |
| Alternate angle | Integrated |
| Label detail | Integrated |
| Fragrance world | Integrated |
| Separate symbolic portrait | Not supplied in this new set; not fabricated |
| 8 ml travel | Integrated |
| 50 ml + 8 ml scale | Integrated |
| In hand | Integrated |
| Separate lifestyle | Not supplied in this new set; not fabricated |
| Wide editorial | Integrated at source 1916 × 821 ratio |
| Mobile editorial | Integrated at source 941 × 1672 ratio |

The Rose Quartz symbolic treatment is preserved in both editorial banners. Older assets remain archived/available rather than deleted. The quiz result now uses the new factual packshot.

## Content, UX and accessibility
Exact approved short description, long description, short story, signature, hook, tagline and SEO copy are present. Notes contain only pear brightness, neroli light, jasmine, white petals, white musk, golden amber and tonka warmth.
The existing gallery supports seven thumbnails, active state, previous/next, arrow/Home/End keys and touch swipe. No duplicate gallery template or new dependency.
Champagne Ivory is the scoped canvas, Pearl Blush provides the description field, Dusty Rose defines borders, and Regal Gold provides the wordmark rule. Text Rose is used for readable text, including the wordmark rather than low-contrast gold lettering. Existing house fonts, header and footer are preserved.
One H1, descriptive image alt text, visible keyboard focus and semantic editorial copy. Desktop uses the wide composition; mobile uses the dedicated portrait. Tablet places text beneath the wide image. Photography is uncropped and has no new heavy overlay.
Intrinsic dimensions and responsive sources reserve space. Only initial hero media receives high priority; remaining images load lazily.

## Files
Created: src/content/aureya.ts; scripts/build-aureya-product-assets.mjs; public/scents/aureya responsive assets and manifest; this report; archived PNG masters and checksum inventory.
Updated: src/content/scents.ts (replaces inline AUREYA with imported record); src/content/findYourLight.ts (image reference); src/types/content.ts (optional presentation fields); src/components/pages/ScentDetailPage.tsx; src/components/sections/PageHero.tsx; src/app/globals.css (scoped dawn theme).
The generated checkout catalogue receives the approved uppercase product display name through the existing prebuild script. Existing test expectations in tests/discovery-set.test.mjs and tests/e2e/discovery.spec.ts were updated for that capitalization only. No checkout algorithms changed.
KAMEIRA's record and image files are unchanged; its existing editorial dimensions and presentation remain intact.

## Validation
- Prettier run on touched TypeScript/components and asset script; unrelated record formatting restored to keep the diff focused.
- ESLint passed.
- TypeScript typecheck passed.
- Production build passed, 34 static pages.
- All 38 unit/export tests passed with no skips.
- All 24 existing Playwright browser tests passed, including cart persistence, discovery choices, checkout review, receipts and quiz behavior; service responses are mocked where appropriate.
- Additional AUREYA browser checks at 375, 390, 430, 768, 1280, 1440 and 1920 px: no horizontal overflow, one H1, no page errors, observed CLS 0 in the measured sessions.
- Inspected mobile/desktop editorial screenshots and mobile hero screenshot.
- Verified all seven gallery images load, keyboard navigation, real touch swipe, and client navigation to the discovery-set handoff.
- Mobile resource inspection confirmed only the mobile editorial file downloaded, not the desktop banner.
- All 44 image paths resolve; all nine source hashes match uploads.
- KAMEIRA gallery works and has no dawn theme. Existing KAMEIRA regression tests passed.
- No PDF, DOCX or XLSX files found in the public directory.

## Deployment
Netlify deployment: 6ab2b92cb0607800ac82818f.
Preview: https://6ab2b92cb0607800ac82818f--tarascents.netlify.app/scents/aureya
Production: https://tarascents.com/scents/aureya
Preview route and both responsive banners returned HTTP 200 before promotion.
Production verification is recorded below after promotion.

## Missing inputs / limits
No missing input blocks this update. Optional separate lifestyle and symbolic portrait images were not supplied. A standalone 8 ml checkout product would require an approved variant in the existing commerce system; this update retains the supported discovery-set path. Browser QA did not make a real purchase or change inventory.

Production verification: live AUREYA route, primary packshot and both mobile/desktop banners returned HTTP 200; live HTML includes the new metadata, dawn theme and responsive media.
