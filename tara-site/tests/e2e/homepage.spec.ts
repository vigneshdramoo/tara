import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";

test.beforeEach(async ({ context }) => {
  await context.route("**/*", (route) => {
    if (
      route.request().method() !== "GET" ||
      !route.request().url().startsWith("http://127.0.0.1:3100")
    )
      return route.abort();
    return route.continue();
  });
});

for (const width of [375, 390, 768, 1440]) {
  test(`homepage journey and layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("THEON + KAMEIRA");
    await expect(page.locator("#latest-launches article")).toHaveCount(2);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await mkdir("docs/ui-verification", { recursive: true });
    await page.screenshot({ path: `docs/ui-verification/home-${width}.png` });
    await page
      .locator("#scent-family")
      .evaluate((element) =>
        window.scrollTo({
          top: (element as HTMLElement).offsetTop - 140,
          behavior: "instant",
        }),
      );
    await page
      .locator("#scent-family img")
      .evaluateAll((images) =>
        Promise.all(
          images
            .slice(0, 2)
            .map((image) => (image as HTMLImageElement).decode()),
        ),
      );
    const cards = page.locator("#scent-family > div > div article");
    await expect(cards).toHaveCount(8);
    await expect(cards.nth(0).getByRole("heading")).toHaveText("THEON");
    await expect(cards.nth(1).getByRole("heading")).toHaveText("KAMEIRA");
    await page.screenshot({ path: `docs/ui-verification/family-${width}.png` });
    await page.getByRole("button", { name: "Cool", exact: true }).click();
    await expect(cards).toHaveCount(2);
    await page.getByRole("button", { name: "All", exact: true }).click();
    await page
      .getByRole("button", { name: "Add THEON to cart", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Add KAMEIRA to cart", exact: true })
      .click();
    await expect(
      page
        .getByRole("link", { name: "View cart", exact: true })
        .filter({ visible: true }),
    ).toHaveText("2");
    await page
      .getByText("Compare notes, mood & occasion", { exact: true })
      .click();
    const compare = page.locator("#scent-family > div > details");
    await compare
      .locator("summary")
      .filter({ hasText: /^KAMEIRA$/ })
      .click();
    await expect(
      compare.getByText("Fragrance journey", { exact: true }),
    ).toBeVisible();
    await compare.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `docs/ui-verification/compare-${width}.png`,
    });
    if (width < 1280) {
      await page
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
      await expect(
        page.getByRole("dialog", { name: "Main menu" }),
      ).toBeVisible();
      await expect(page.locator("[data-mobile-sticky-cta]")).toBeHidden();
      await page.screenshot({ path: `docs/ui-verification/menu-${width}.png` });
      await page.keyboard.press("Shift+Tab");
      expect(
        await page.evaluate(() => !!document.activeElement?.closest("dialog")),
      ).toBe(true);
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toBeHidden();
      await expect(
        page.getByRole("button", { name: "Open menu", exact: true }),
      ).toBeFocused();
    }
    await page
      .getByRole("link", { name: "View cart", exact: true })
      .filter({ visible: true })
      .click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.locator("main")).toContainText("THEON");
    await expect(page.locator("main")).toContainText("KAMEIRA");
    await page.goto("/preorder?checkout=three-8ml-promo#secure-checkout");
    await expect(page.locator("#secure-checkout select")).toHaveValue(
      "three-8ml-promo",
    );
    expect(errors).toEqual([]);
  });
}

test("homepage is readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("#latest-launches article")).toHaveCount(2);
  await expect(
    page.getByRole("link", { name: "Explore THEON →", exact: true }),
  ).toHaveAttribute("href", "/scents/theon");
  await expect(
    page.getByRole("link", { name: "Explore KAMEIRA →", exact: true }),
  ).toHaveAttribute("href", "/scents/kameira");
  await context.close();
});

test("mini quiz, analytics and accessible mobile states", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("link", { name: "Explore latest launches", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Work", exact: true }).click();
  await page.getByRole("button", { name: "Fresh", exact: true }).click();
  await page.getByRole("button", { name: "Citrus", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: /We recommend/ }),
  ).toBeVisible();
  const events = await page.evaluate(() =>
    window.dataLayer
      ?.filter((entry) => !Array.isArray(entry))
      .map((entry) => (entry as Record<string, unknown>).event),
  );
  expect(events).toEqual(
    expect.arrayContaining([
      "hero_primary_cta_click",
      "quiz_start",
      "quiz_complete",
      "quiz_result_revealed",
    ]),
  );
  await page.screenshot({ path: "docs/ui-verification/quiz-390.png" });
  await page.getByRole("button", { name: "Retake Quiz" }).click();
  await expect(
    page.getByRole("heading", { name: "When do you wear fragrance?" }),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "Email address" }).focus();
  await expect(page.locator("[data-mobile-sticky-cta]")).toBeHidden();
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Preorder", exact: true })
    .click();
  await expect(page).toHaveURL(/preorder/);
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
