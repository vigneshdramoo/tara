# AUREYA / KAMEIRA theme audit and implementation

## Audit findings
AUREYA already had a Champagne Ivory canvas, Pearl Blush description field, Text Rose copy and Dusty Rose borders. Those choices were retained. Its implementation was fragile: class-substring selectors inspected Tailwind utility names, house variables were rebound to fragrance colors, and the hover color introduced an unapproved darker rose. KAMEIRA only had wine/ivory styling in its editorial block and hard-coded gallery controls; most surrounding UI retained the neutral house presentation.

## Shared architecture
One activation mechanism now exists: the fragrance record supplies theme: "aureya" or "kameira", rendered as data-scent-theme on the existing ScentDetailPage wrapper. The old scent-dawn CSS is removed.
Semantic --scent-* variables control canvas, surfaces, text, display, accent, micro-accent, borders/dividers, CTA, focus, selection and hover. Named semantic component hooks replace class-substring matching. House --color-* variables are no longer overridden. Existing default utility classes remain the fallback outside a themed root.
No layouts, typography, product images, content, prices, inventory or checkout logic were changed.

## Palette tokens and visible application
| Role | AUREYA | KAMEIRA |
| --- | --- | --- |
| Canvas / surface | Champagne Ivory #F8EBDD | Blackcurrant Wine #4A1828 |
| Soft surface | Pearl Blush #F6C6D0 | Ivory #F7F3EB at 5% alpha |
| Body / small labels | Text Rose #7A4E56 | Ivory #F7F3EB |
| Accessible display text | Text Rose #7A4E56 | Regal Gold #CA9E5B |
| Decorative accent | Regal Gold #CA9E5B | Regal Gold #CA9E5B |
| Grounding / micro accent | Dusty Rose Taupe #B9828A | Velvet Rose #8F4054 |
| Border | Dusty Rose Taupe | Ivory at 65% alpha |
| Divider | Dusty Rose at 55% alpha | Gold at 40% alpha |
| Primary CTA | Text Rose with Champagne Ivory text | Ivory with Wine text |
| Focus | Text Rose | Ivory (Wine in ivory panels) |
| Selection | Blush / Text Rose | Gold / Wine |

AUREYA: ivory hero and main canvas; blush description and profile tags; rose borders, readable labels and gallery controls; decorative gold wordmark rule and active-thumbnail accent. The luminous editorial safe areas remain unchanged.
KAMEIRA: wine hero, story, profile, notes and purchase surroundings; ivory small copy; gold fragrance name, editorial display heading and restrained rules; Velvet Rose appears only as a thin inset detail on the first profile tag. Ivory reassurance/discovery/concierge panels interrupt the dominant wine field and locally invert text and CTA tokens back to wine.
Both: gallery frame, captions, arrows, selected thumbnails, button hover/active states, visible focus and scoped text selection follow their theme. Disabled controls use reduced opacity and a not-allowed cursor. No new animation or dark-mode system.

## Accessibility decisions
Text Rose / Champagne Ivory: 5.87:1.
Text Rose / Pearl Blush: 4.56:1.
Ivory / Wine: 13.06:1.
Gold / Wine: 5.89:1; nevertheless reserved for display and decoration as requested.
Gold / Champagne Ivory: 2.09:1, so AUREYA retains readable Text Rose wordmark lettering with a decorative gold rule rather than inaccessible gold text.
Focus rings use high-contrast functional text colors. Product photography is not filtered or overlaid. Global header/footer and floating house controls are outside the scent wrapper.

## Files changed
- src/app/globals.css: replaces dawn overrides with scoped semantic token sets and component rules.
- src/types/content.ts and src/content/{aureya,kameira}.ts: typed theme identifiers; no commercial/content changes.
- src/components/pages/ScentDetailPage.tsx: theme attribute and semantic hooks.
- src/components/sections/PageHero.tsx: semantic wordmark/text/border hooks.
- src/components/product/{ScentGallery,ProductProfile,PriceBlock,ScentComparisonTags,SampleSetCallout,ConciergeCallout,PurchaseReassurance}.tsx: semantic hooks with house fallback styling.
- src/components/ui/Button.tsx: semantic class and data-variant; behavior unchanged.
- tests/e2e/scent-themes.spec.ts: 16 focused palette/responsive/isolation/system-mode tests.
- tests/helpers/serve-export.mjs: read-only HEAD support for Next.js prefetch, resolving local 405 console noise.

## Validation
Formatter run on touched TS/TSX and test helper files. ESLint, TypeScript, production build and all 38 unit/export tests passed. All 40 Playwright tests passed, including the 16 new theme tests and existing commerce/discovery/quiz regressions.
Both fragrances checked at 375, 390, 430, 768, 1280, 1440 and 1920 px: correct palettes, gallery keyboard/selected/focus behavior, loaded images, no horizontal overflow, no console/page errors.
Representative screenshots captured and inspected for both at 390 and 1440 px, including hero, story, editorial and commerce. Observed CLS was 0 in all four measured mobile/desktop sessions.
THEON, ZEPHYR, homepage, catalogue and checkout remain unthemed. Header/footer do not inherit scent tokens. Dark system preference and reduced motion preserve both palettes.
Existing prices and discovery-set destinations were verified; no real purchase was made.

## Deployment
Uses the same validated static export for Netlify preview and production promotion. Deployment identifiers and route verification are recorded below.

- Netlify deploy: `6ab2bf8b65801734901a06e1`
- Preview: `https://6ab2bf8b65801734901a06e1--tarascents.netlify.app`
- Production promotion completed: `2026-09-23T00:39:25.265Z`
- Live AUREYA: `https://tarascents.com/scents/aureya`
- Live KAMEIRA: `https://tarascents.com/scents/kameira`

Both preview and production routes returned HTTP 200 with their correct `data-scent-theme` values. The live browser loaded both pages with the expected titles and no reported browser errors. The legacy `.scent-dawn` selector is absent from the deployed stylesheet.
