# KAMEIRA implementation

Implemented 2026-09-20 in the existing TARA Next.js 16.2.6 / React 19 / Tailwind 4 site. The site uses App Router static export, local TypeScript product records, static public assets, Netlify functions, and the existing ToyyibPay checkout. No new application dependency was added.

## Preview and deployment

- Product route: `/scents/kameira`
- Uploaded Netlify draft: https://6aafd0948aa7ec1360b3caf6--tarascents.netlify.app/scents/kameira
- Deployment: `6aafd0948aa7ec1360b3caf6`
- Published to production on explicit user request on 2026-09-20 at 12:28 UTC. The exact verified deployment was promoted without rebuilding. Live route: https://tarascents.com/scents/kameira. The existing workspace baseline is included.
- No deployment credential is missing. The existing authenticated Netlify project was used.

## Product and commerce

KAMEIRA, fragrance No. 08, Eau de Parfum. Approved tagline: “Desire, distilled.”

User-confirmed terms: 50 ml RM169; 8 ml RM45; eligible for the RM99 discovery set. The 50 ml bottle is included in the existing checkout product list and server price catalogue. Only catalogue data was added; payment, inventory and checkout processing logic was not changed.

The existing site does not offer a standalone 8 ml checkout product pattern. The page shows RM45 with an enquiry link, plus the existing RM99 discovery-set link. Discovery-set scent choices continue through the existing order notes/concierge workflow. The build's existing payment feature flag is off, so product-page purchase links retain the site's reservation behaviour. Cart addition and server-side price handling were verified; no payment or order was submitted.

No SKU, GTIN, review, stock count or regular price was invented. Internal formula documents and percentages were not published. The four-stage scent journey is used instead of inventing top/heart/base mappings.

## Asset roles

Original PNG files, including the dedicated mobile banner, were copied unchanged into `Content Library/Scents/KAMEIRA/Images/` and indexed with SHA-256 checksums in the scent README.

| Order / role | Website file under public/scents/kameira |
|---|---|
| 1. Clean 50 ml hero | kameira-50ml-hero.webp |
| 2. Alternate angle | kameira-50ml-angle.webp |
| 3. Detail macro | kameira-label-detail.webp |
| 4. Fragrance world | kameira-fragrance-world.webp |
| 5. 8 ml travel size | kameira-8ml.webp |
| 6. Both sizes | kameira-50ml-8ml-scale.webp |
| 7. In hand | kameira-in-hand.webp |
| Desktop editorial banner | kameira-editorial-wide.webp |
| Mobile editorial banner | kameira-editorial-mobile.webp |

The seven product sources are 1122 × 1402; the banner is 1672 × 941. Original proportions are preserved, with no cropping, stretching or upscaling. 44 WebP delivery files total 2,748,848 bytes; the largest file is 148,660 bytes. The manifest records all source-to-output mappings. Rebuild using `node scripts/build-kameira-assets.mjs` from `tara-site`.

The supplied 941 × 1672 mobile editorial banner is used below 768 CSS pixels via a picture source, with HTML copy in the upper negative space. At 768 px and above, the desktop banner remains unchanged. Both artworks retain their original proportions without cropping. Each viewport downloads only its matching artwork.

## Responsive images and accessibility

The existing gallery markup was extracted into `ScentGallery`; other fragrances retain their existing rendering. KAMEIRA opts into selectable images, active-state thumbnails, previous/next buttons, Arrow/Home/End keyboard navigation, focus indicators and horizontal touch swipes. Images have descriptive alt text; thumbnail names come from their buttons.

Because the global static-export configuration disables Next image optimization and suppresses custom-loader srcsets, `ScentImage` uses native responsive markup for prebuilt WebP widths. Only the initial hero receives a responsive preload/high priority; thumbnails and editorial imagery lazy-load. Explicit dimensions and stable aspect ratios reserve layout space. No runtime image service is required.

## SEO

The existing dynamic scent route generates KAMEIRA metadata, canonical URL, Open Graph/Twitter imagery, Product JSON-LD, breadcrumbs and sitemap inclusion. The product H1 is KAMEIRA. Product JSON-LD uses the confirmed RM169 price and clean commerce hero; no unsupported identifiers or reviews are included.

## Validation

- Production build: passed, including Next.js TypeScript validation.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm test`: 25 passed, 0 failed, 0 skipped.
- Browser widths: 375, 390, 430, 768, 1280, 1440 and 1920 CSS pixels, checked at device scale factor 2.
- No document overflow, clipped headings, broken loaded images or page/console errors in the viewport matrix; measured initial CLS was 0 in each run.
- Gallery image selection and keyboard navigation passed at every width. A separate mobile touch-swipe check passed.
- Native responsive image selection verified; no duplicate image request URLs were detected in the touch test.
- Direct route, client-side navigation from the catalogue, KAMEIRA cart addition at RM169, and the existing THEON page passed.
- Editorial desktop/mobile screenshots were inspected after the lazy-loaded banner finished loading.
- Deployed preview: KAMEIRA, catalogue, THEON, sitemap and all eight base images returned HTTP 200; deployed browser showed the expected gallery and no page errors.
- Server catalogue test verifies client-submitted prices cannot override KAMEIRA's RM169 price.

## Files changed

New:

- `src/content/kameira.ts`
- `src/components/product/ScentGallery.tsx` (extracted legacy markup plus optional interactive mode)
- `src/components/product/ScentImage.tsx`
- `scripts/build-kameira-assets.mjs`
- `public/scents/kameira/*`
- `tests/kameira-output.test.mjs`
- `docs/kameira-implementation.md`

Updated:

- `src/types/content.ts`
- `src/content/scents.ts`
- `src/content/brand.ts` (range count and KAMEIRA mention)
- `src/app/scents/page.tsx`
- `src/app/scents/[slug]/page.tsx`
- `src/components/pages/ScentDetailPage.tsx`
- `src/components/sections/PageHero.tsx`
- `src/components/sections/ShoppableScentFamily.tsx`
- `src/components/product/ProductProfile.tsx`
- `src/components/product/ScentCatalogExplorer.tsx`
- `src/lib/structured-data.ts`
- `netlify/functions/lib/checkout-catalog.mjs` (product data only)
- `tests/commercial-config.test.mjs`
- `tests/homepage-stage2-output.test.mjs`
- `tests/scents-stage3-output.test.mjs`
- `Content Library/Scents/KAMEIRA/README.md` and eight archived image sources

## Mobile banner follow-up

Saved the new original, generated responsive WebP sizes, and updated the source manifest and tests. Build/type validation, lint (zero warnings), and all 25 tests passed. Mobile source selection was verified at 375, 390 and 430 px; desktop source selection at 768 and 1440 px. No overflow or page errors; one matching editorial request per viewport. The 390 px composition was visually reviewed. No missing KAMEIRA image role remains.

Production verification: page and mobile/desktop editorial images returned HTTP 200; live HTML contains KAMEIRA metadata and the dedicated mobile source.
