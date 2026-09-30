import { expect, test, type Page } from "@playwright/test";

const options = (page: Page) => page.locator("main button[aria-pressed]");
const heading = (page: Page) => page.locator("main h2");

async function ready(page: Page, index: number) {
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(index));
  await expect(options(page).first()).toBeEnabled();
  await expect(heading(page)).toBeFocused();
}

async function aligned(page: Page) {
  const position = await heading(page).evaluate((element) => {
    const toolbar = document.querySelector('[role="progressbar"]')!.parentElement!;
    return {
      top: element.getBoundingClientRect().top,
      toolbarBottom: toolbar.getBoundingClientRect().bottom,
      counterTop: document.querySelector("#quiz-question-number")!.getBoundingClientRect().top,
      siteBottom: document.querySelector("header")!.getBoundingClientRect().bottom,
    };
  });
  expect(position.top).toBeGreaterThanOrEqual(position.siteBottom);
  expect(position.top).toBeGreaterThanOrEqual(position.toolbarBottom);
  expect(position.counterTop).toBeGreaterThanOrEqual(position.toolbarBottom);
  // At scrollTop 0, an embedded container may retain its original card padding.
  expect(position.top).toBeLessThan(position.toolbarBottom + 96);
}

test.beforeEach(async ({ context, page }) => {
  await context.route("**/*", (route) => {
    if (route.request().method() !== "GET" || !route.request().url().startsWith("http://127.0.0.1:3100")) return route.abort();
    return route.continue();
  });
  await page.addInitScript(() => {
    const original = HTMLElement.prototype.scrollIntoView;
    const calls: { text: string; disabled: boolean; behavior?: string }[] = [];
    Object.assign(window, { quizScrollCalls: calls });
    HTMLElement.prototype.scrollIntoView = function (options) {
      calls.push({
        text: this.textContent ?? "",
        disabled: [...document.querySelectorAll<HTMLButtonElement>("main button[aria-pressed]")].every(button => button.disabled),
        behavior: typeof options === "object" ? options.behavior : undefined,
      });
      original.call(this, options);
    };
  });
});

for (const viewport of [{ width: 390, height: 844 }, { width: 360, height: 800 }, { width: 1440, height: 900 }]) {
  test.describe(`${viewport.width}px transitions`, () => {
    test.use({ viewport, hasTouch: true });
    test("rapid taps, scroll alignment, scoring, result once and restart", async ({ page }) => {
      test.setTimeout(60000);
      await page.goto("/quiz");
      await page.getByRole("button", { name: "Begin The Journey" }).click();
      await ready(page, 1);
      for (let index = 1; index <= 8; index++) {
        await ready(page, index);
        const lastOption = options(page).last();
        await lastOption.scrollIntoViewIfNeeded();
        const box = (await lastOption.boundingBox())!;
        await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
        await expect(page.locator("main button[aria-pressed]:enabled")).toHaveCount(0);
        // A real second tap at the same coordinates must not answer the next question.
        await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
        // Also exercise a synchronous burst of selection events while locked.
        await options(page).last().evaluate(button => {
          button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        if (index < 8) {
          await ready(page, index + 1);
          await aligned(page);
          if (index === 1) await page.screenshot({ path: test.info().outputPath("question-2.png") });
        }
      }
      await expect(heading(page)).toHaveText("Your scent is KAMEIRA.");
      await expect(heading(page)).toBeFocused();
      await expect.poll(() => heading(page).evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(250);
      const events = await page.evaluate(() => window.dataLayer?.filter(event => !Array.isArray(event) && event.event === "quiz_complete"));
      expect(events).toHaveLength(1);
      expect(events![0]).toMatchObject({ kameira_score: 8, theon_score: 0, quiz_result: "kameira" });
      const scrolls = await page.evaluate(() => (window as unknown as { quizScrollCalls: { text: string; disabled: boolean; behavior: string }[] }).quizScrollCalls);
      expect(scrolls.every(call => call.disabled)).toBe(true);
      expect(scrolls.some(call => call.text.includes("Choose the hour"))).toBe(true);
      expect(scrolls.some(call => call.behavior === "smooth")).toBe(true);
      await page.getByRole("button", { name: "Restart", exact: true }).click();
      await ready(page, 1);
      await aligned(page);
      await expect(heading(page)).toHaveAttribute("tabindex", "-1");
      await expect(heading(page)).toHaveAttribute("aria-describedby", "quiz-question-number");
      await expect(page.locator("#quiz-question-number")).toHaveText("01 / 08");
    });
  });
}

test("reduced motion and keyboard activation announce the new heading", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/quiz");
  await page.getByRole("button", { name: "Begin The Journey" }).press("Enter");
  await ready(page, 1);
  // Safari uses Option-Tab for all controls when full keyboard access is off.
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(options(page).first()).toBeFocused();
  await page.keyboard.press("Enter");
  await ready(page, 2);
  await aligned(page);
  const behaviors = await page.evaluate(() => (window as unknown as { quizScrollCalls: { behavior: string }[] }).quizScrollCalls.map(call => call.behavior));
  expect(behaviors).not.toContain("smooth");
});

test("nested scroll owner and unavailable smooth scrolling release controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/quiz");
  await page.evaluate(() => {
    const main = document.querySelector("main")!;
    main.style.height = "600px";
    main.style.overflowY = "auto";
    const original = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = function (options) {
      if (typeof options === "object" && options.behavior === "smooth") throw new Error("Unsupported smooth scroll");
      original.call(this, options);
    };
  });
  await page.getByRole("button", { name: "Begin The Journey" }).click();
  await ready(page, 1);
  await options(page).last().scrollIntoViewIfNeeded();
  const previousScroll = await page.locator("main").evaluate(el => el.scrollTop);
  expect(previousScroll).toBeGreaterThan(0);
  await options(page).last().click();
  await ready(page, 2);
  await aligned(page);
  expect(await page.locator("main").evaluate(el => el.scrollTop)).toBeLessThan(previousScroll);
});

test("restart and close cancel an in-flight answer and restore focus", async ({ page }) => {
  await page.goto("/quiz");
  await page.getByRole("button", { name: "Begin The Journey" }).click();
  await ready(page, 1);
  // Dispatch in one task to exercise cancellation before the 420ms selection timer.
  await options(page).last().evaluate(button => {
    (button as HTMLButtonElement).click();
    [...document.querySelectorAll<HTMLButtonElement>("main button")].find(el => el.textContent === "Restart")!.click();
  });
  await ready(page, 1);
  await options(page).first().click();
  await ready(page, 2);
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.locator("main h1")).toBeFocused();
  await page.getByRole("button", { name: "Begin The Journey" }).click();
  await ready(page, 1);
  await expect(options(page).first()).toHaveAttribute("aria-pressed", "false");
});

test("interrupted scroll watchdog cannot leave answers locked", async ({ page }) => {
  await page.goto("/quiz");
  await page.getByRole("button", { name: "Begin The Journey" }).click();
  await ready(page, 1);
  await page.evaluate(() => {
    const original = HTMLElement.prototype.getBoundingClientRect;
    Object.assign(window, { restoreQuizGeometry: () => { HTMLElement.prototype.getBoundingClientRect = original; } });
    let movement = 0;
    // Simulate geometry that keeps moving, including the newly mounted heading.
    HTMLElement.prototype.getBoundingClientRect = function () {
      const rect = original.call(this);
      return this.matches("main h2")
        ? new DOMRect(rect.x, rect.y + ++movement, rect.width, rect.height)
        : rect;
    };
  });
  await options(page).last().click();
  await ready(page, 2);
  await page.evaluate(() => (window as unknown as { restoreQuizGeometry: () => void }).restoreQuizGeometry());
  await aligned(page);
});
