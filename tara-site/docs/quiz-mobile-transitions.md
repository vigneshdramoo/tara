# Scent Quiz mobile transitions

Branch: `codex/quiz-mobile-transitions`. Deployed on 21 September 2026 following the explicit request “Deploy now”.

## Root cause and scope

`/quiz` renders `FindYourLightQuiz`. Its answer handler stores answer records and derived scores in React state, briefly shows the selected answer for 420ms, then changes `currentQuestionIndex`. Previously, clearing `selectedOption` immediately unlocked the new answers; nothing repositioned the viewport or announced the newly rendered question. On long mobile option lists, the next question appeared above the current viewport.

Existing working-tree changes were preserved. This task changes only:

- `src/components/forms/FindYourLightQuiz.tsx`
- `src/lib/quiz-transition.ts` (new)
- `tests/e2e/quiz-transitions.spec.ts` (new)
- `docs/quiz-mobile-transitions.md` (this report)

Questions, answer ordering/text, profiles, recommendation logic, CTA destinations and analytics names/payloads are unchanged. An AST comparison against the starting component confirms identical analytics and scoring calls. There are no answer-selection analytics events to duplicate; completion remains once per finished run.

## Transition behavior

A synchronous ref guards the first answer before React commits native `disabled` attributes. React state supplies disabled buttons, pressed styling and a subtle dimmed transition state. The original 420ms selection feedback remains. After the question index changes, an effect reads the newly committed heading and schedules focus/scroll with requestAnimationFrame. The new heading is keyed by question and restart revision to ensure a fresh focus target, including Safari pointer interactions that retain heading focus.

`scrollIntoView` scrolls the relevant ancestors, including nested scrollports. ResizeObserver measures the site header and quiz toolbar. CSS scroll margins leave the heading and counter visible below sticky controls; a nested toolbar sticks to its own scrollport instead of applying the outer header offset twice. `overflow-clip` preserves the quiz decoration without creating an unintended scrolling ancestor that breaks sticky positioning.

Animation-frame geometry checks release the lock after the heading has stopped moving for 120ms. This quiet period covers delayed scroll starts and touch momentum, and does not depend on Safari's support for `scrollend`. A 1500ms safety watchdog finishes alignment instantly and releases the lock if scrolling is interrupted or frames are throttled. It is a fallback, not the normal completion signal. Unsupported scroll options fall back to the legacy API.

Reduced motion explicitly uses `instant`: this is necessary because the site's existing `html { scroll-behavior: smooth }` would make `auto` animate. Headings use `tabIndex=-1` and `focus({ preventScroll: true })`, avoiding a second focus-induced scroll. The question number is associated through `aria-describedby`, and the existing progressbar remains available. Answer groups expose `aria-busy` during transitions.

The final answer focuses/scrolls the result heading, not a removed question. Restart, Close, Back and unmount cancel pending timers/frames. Restart resets answers, scores and question index, then releases a fresh transition lock after positioning question 1; Close restores the landing heading.

## Verification

- ESLint and TypeScript checks pass.
- Production static build passes (34 pages).
- All 29 unit/export tests pass.
- Chromium: all 9 relevant quiz E2E tests pass (7 new transition cases plus 2 existing quiz regressions).
- WebKit: all 7 transition E2E tests pass.
- Viewports: 390×844, 360×800 and 1440×900.
- Tests cover repeated real taps and synchronous click bursts, one answer per question, disabled controls during post-render scrolling, heading/counter spacing, re-enabled controls, reduced motion, keyboard activation, focus and accessible question number, one correct final result, restart/close cancellation, nested scroll containers, unsupported smooth options and watchdog release.
- Existing tests retain coverage of all fragrance scoring paths, Back score recalculation and clean scoring after Restart.
- Desktop browser inspection and mobile WebKit screenshots confirm the heading, counter and progress are visible beneath sticky navigation.
- No formatter is configured in this project; existing formatting conventions and `git diff --check` were used.

Repeat after building: `npm run test:e2e -- tests/e2e/quiz-transitions.spec.ts tests/e2e/quiz.spec.ts`; WebKit: `npm run test:e2e -- tests/e2e/quiz-transitions.spec.ts --browser=webkit` (requires `npx playwright install webkit`).

## Limits

WebKit automation is not a physical iPhone test. Hardware-specific Safari browser chrome and VoiceOver speech output were not directly exercised; DOM focus, keyboard behavior, reduced motion and accessible descriptions were verified. The normal page uses one site-level `header`; nested embedding was tested with an overflow-scrolling parent around the quiz. No unrelated page was redesigned and no live order, form, payment or message was submitted.


## Production verification

Published the previously tested production export to https://tarascents.com/quiz.
Netlify deployment: `6ab0248d3a9457e3c7dd3d00`.

Post-deployment Chromium checks passed at 390×844 and 360×800: HTTP 200, heading focus and sticky spacing across all eight questions, native disabled controls, rapid repeated taps, one KAMEIRA result with exactly eight votes, and Restart resetting to usable question 1. No page errors. All non-GET and external requests were blocked during verification; no order, payment, form or message was submitted.
