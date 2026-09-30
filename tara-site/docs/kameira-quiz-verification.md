# KAMEIRA quiz verification — 20 September 2026

Branch: `codex/kameira-quiz`. Deployed to production on 20 September 2026 after the user explicitly requested deployment.

## Changes in this task

All paths below are relative to `tara-site/`. The workspace already contained substantial uncommitted work; these changes extend that work without replacing it.

- `src/content/findYourLight.ts`: KAMEIRA union member, H answers, official result profile, No. 08, both purchase CTAs, explicit last-place tie priority.
- `src/components/forms/FindYourLightQuiz.tsx`: visible scent list, eight-column desktop list, zero score, `kameira_score` analytics field, result number label.
- `src/app/quiz/page.tsx`: quiz metadata includes KAMEIRA.
- `tests/quiz-kameira.test.mjs`: executable scoring, all existing mappings, mixed KAMEIRA path, all pairwise ties, official result/CTA tests.
- `tests/quiz-stage5-output.test.mjs`: built quiz landing includes KAMEIRA.
- `tests/e2e/quiz.spec.ts`: ungated result, analytics payload, both product selections, Restart, Back and Close.
- `tests/helpers/serve-export.mjs`: read-only localhost server for testing the production export.
- `playwright.config.ts`: browser test setup against the static export.
- `package.json`, `package-lock.json`: Playwright test dependency and typecheck/e2e scripts.
- `.gitignore`: ignore generated browser test artifacts.
- `docs/kameira-quiz-verification.md`: this report.

Existing shared KAMEIRA product data, price configuration, checkout catalog and structured-data generation already support No. 08, RM169 / RM45, warm/soft/skin-close and discovery-set availability, so no edits to these were needed.

## Scoring and exact browser path

Each answer awards one vote to its scent. The highest vote count wins. Original A–G answers and their text are unchanged. Existing ties retain the order THEON, ARDOR, ASHOKA, ELIORA, MARIS, ZEPHYR, AUREYA; KAMEIRA is last in a tie, so adding it never changes the winner for an old answer path.

Choose H on each of the eight questions:

1. To an intimate evening - wine, roses, and amber warmth shared close.
2. Evening - a quiet room, soft light, and nowhere else to be.
3. A skin-close warmth - velvet rose and the glow of burnished amber.
4. An intimate room - cool air, blackcurrant wine, and roses in low light.
5. Intimate
6. The warmth shared up close - softly sweet, with nothing to prove.
7. Rose velvet - soft to the touch, warmed by amber.
8. An evening shared close - blackcurrant wine, roses, and lingering warmth.

Result: KAMEIRA 8; every other scent 0. A unit test also verifies H,H,A,H,B,H,C,H yields KAMEIRA with five votes.

## Validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; 34 static pages generated.
- `npm test`: 29 passed, zero skipped, zero failed after production build.
- `npm run test:e2e`: 2 passed against production export. No pre-existing E2E suite was found.
- Interactive local browser: checked landing list, completed H × 8, saw KAMEIRA without entering contact details, inspected result styling, clicked both CTAs, confirmed KAMEIRA selected at RM169 and the three-scent set selected at RM99, and checked Restart returns to question 1 with no personal fields.
- Existing result-saving form remains optional, after the revealed result. The site-wide footer newsletter form is independent of the quiz.
- Completion analytics include only event metadata, scent slug and eight numeric scores. The browser test asserts the exact payload.
- Back regression: discard an initial H vote, complete H,H,H,H,G,G,G,G → THEON (tie), then Back and change the final G to H → KAMEIRA (5–3). This catches stale/duplicated votes.
- Restart regression: finish H × 8, Restart, finish A × 8 → ZEPHYR; previous KAMEIRA votes do not persist.

Initial tooling issues were resolved: a build overlapped dependency installation and could not yet resolve Playwright; rerunning after installation passed. The local Next.js dev server failed Tailwind resolution from the parent workspace, so E2E uses the deployable static export. Chromium was installed for Playwright.

To repeat: `npm ci`, `npx playwright install chromium`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, `npm run test:e2e`.

## Ambiguity and boundaries

No unresolved KAMEIRA data ambiguity. Restart preserves the existing behavior: fresh question 1; Close returns to the landing screen. The discovery CTA preserves the existing set-selection flow and does not preselect the individual scents within the set.

No live order, payment, form, email or WhatsApp message was submitted. No payment credentials were modified. Browser CTA verification stopped at product selection with an empty cart. Production deployment was performed only after the subsequent explicit user instruction, “Deploy now”.


## Production deployment

- Live quiz: https://tarascents.com/quiz
- Netlify deployment: `6aafd67e588dbc4ae7b59f88`
- Deployment permalink: https://6aafd67e588dbc4ae7b59f88--tarascents.netlify.app
- Published the exact previously tested `out/` production build without rebuilding.
- Post-deployment browser check passed: HTTP 200, KAMEIRA in landing list, H × 8 immediately reveals KAMEIRA with no personal data, both CTA destinations select the correct products, Restart clears the result, no page errors.
- The live browser check blocked all non-GET requests and external hosts. No order, payment, form, email or WhatsApp message was submitted.
