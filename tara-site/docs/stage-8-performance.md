# Stage 8 Performance And Mobile QA

## Image Optimization

The Netlify build uses `next.config.ts` with `output: "export"` and `images.unoptimized: true`, so visitors receive the exact asset file referenced in markup. Stage 8 therefore switched high-traffic PNG assets to compressed WebP files instead of relying on runtime image transformation.

| Asset | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| `tara-theon-launch-hero.png` to `tara-theon-launch-hero-optimized.webp` | 1519KB | 17KB | 98.9% |
| `tara-theon-duo.png` to `tara-theon-duo-optimized.webp` | 1754KB | 24KB | 98.6% |
| `tara-theon-50ml.png` to `tara-theon-50ml-optimized.webp` | 1423KB | 18KB | 98.7% |
| `bottle-aureya.png` to `bottle-aureya.webp` | 1394KB | 11KB | 99.2% |
| `bottle-zephyr.png` to `bottle-zephyr.webp` | 1447KB | 13KB | 99.1% |
| `bottle-eliora.png` to `bottle-eliora.webp` | 1422KB | 13KB | 99.1% |
| `bottle-maris.png` to `bottle-maris.webp` | 1614KB | 24KB | 98.5% |

## Responsive QA

Checked the exported site served from `out/` at `320`, `390`, `768`, and `1440` CSS pixel widths.

Routes checked:

- `/`
- `/scents`
- `/quiz`
- `/preorder`
- `/cart`
- `/scents/theon`

Results:

- No document-level horizontal overflow was detected.
- No missing `alt` attributes were detected on checked pages.
- No browser console errors were detected on checked pages.
- The mobile header menu opens at `390px`, locks background scroll, and exposes the preorder and navigation links.
- The quiz starts and advances after a mobile answer selection without layout overflow.
- Wide scent comparison tables and filter chips remain intentionally scrollable inside their own containers.

## Notes

- Source/master images were not deleted from `public/` because they may still be useful as marketing source assets. Production references now point to optimized WebP versions.
- All `next/image` `fill` usages have explicit `sizes` hints.
