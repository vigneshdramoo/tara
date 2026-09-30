import { expect, test, type Page } from "@playwright/test";

async function clearState(page: Page) {
  await page.goto("/scents");
  await page.evaluate(() => {
    localStorage.removeItem("tara-cart-items");
    localStorage.removeItem("tara-discovery-selection-v1");
    sessionStorage.clear();
  });
  await page.reload();
}

for (const viewport of [
  { width: 320, height: 700 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`catalogue renders all products without page overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/scents");
    await expect(page.locator("#scent-catalog article")).toHaveCount(8);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await expect(page.getByRole("heading", { name: "What are you in the mood for?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Build your 3-scent discovery set" })).toBeVisible();
  });
}

test("mood, filters, sorting and URL history work together", async ({ page }) => {
  await clearState(page);
  await page.getByRole("option", { name: "Soft and intimate" }).click();
  await expect(page).toHaveURL(/mood=soft-intimate/);
  await expect(page.getByText("Showing scents for: Soft and intimate")).toBeVisible();
  await expect(page.locator("#scent-catalog article h3").first()).toHaveText("Ashoka");
  await page.getByRole("button", { name: "Fresh / Mineral" }).click();
  await expect(page).toHaveURL(/filter=fresh-mineral/);
  await expect(page.locator("#scent-catalog article")).toHaveCount(2);
  await page.getByLabel("Sort").selectOption("newest");
  await expect(page).toHaveURL(/sort=newest/);
  await page.goBack();
  await expect(page.getByLabel("Sort")).toHaveValue("recommended");
  await page.getByRole("button", { name: "Clear all" }).last().click();
  await expect(page.locator("#scent-catalog article")).toHaveCount(8);
  await expect(page).not.toHaveURL(/mood=|filter=|sort=/);
});

test("quick view closes with Escape and restores focus", async ({ page }) => {
  await clearState(page);
  const trigger = page.locator("#scent-catalog article").first().getByRole("button", { name: "Quick view" });
  await trigger.focus();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: /quick view/ });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Key notes:");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("product media stages stay equal and apply configured presentation metadata", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/scents");
  const media = page.locator("[data-product-media]");
  await expect(media).toHaveCount(8);
  const heights = await media.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().height));
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
  await expect(media.locator('img[data-fit="cover"]')).toHaveCount(6);
  await expect(media.locator('img[data-fit="contain"]')).toHaveCount(2);
  await expect(page.locator('[data-product-media="aureya"] img')).toHaveAttribute("data-image-scale", "1.1");
  await expect(page.locator('[data-product-media="aureya"] img')).toHaveAttribute("data-image-padding", "5.5%");
  await expect(page.locator('[data-product-media="theon"] img')).toHaveCSS("object-fit", "cover");
  await expect(page.locator('[data-product-media="kameira"] img')).toHaveCSS("object-fit", "contain");
  for (const image of await media.locator("img").all()) await expect(image).toHaveAttribute("alt", /.+/);
});

test("comparison caps at three and supports keyboard-accessible removal", async ({ page }) => {
  await clearState(page);
  const cards = page.locator("#scent-catalog article");
  for (let index = 0; index < 3; index++) {
    await cards.nth(index).scrollIntoViewIfNeeded();
    await cards.nth(index).getByRole("button", { name: "Compare", exact: true }).click();
  }
  const drawer = page.getByRole("region", { name: "Scent comparison" });
  await expect(drawer).toContainText("Compare 3 of 3 scents");
  await expect(cards.nth(3).getByRole("button", { name: "Compare limit reached" })).toBeDisabled();
  await drawer.getByRole("button", { name: "View comparison" }).click();
  const remove = drawer.getByRole("button", { name: /Remove .* from comparison/ }).first();
  await remove.focus();
  await page.keyboard.press("Enter");
  await expect(drawer).toContainText("Compare 2 of 3 scents");
  await drawer.getByRole("button", { name: "Clear comparison" }).click();
  await expect(drawer).toBeHidden();
});

test("sample tray persists through filtering and adds one configured trio", async ({ page }) => {
  await clearState(page);
  const cards = page.locator("#scent-catalog article");
  for (let index = 0; index < 3; index++) await cards.nth(index).getByRole("button", { name: "Try in 8mL set" }).click();
  await expect(page.getByText("3 of 3 selected", { exact: true })).toBeVisible();
  const remove = page.getByRole("button", { name: /Remove .* from discovery set/ }).first();
  await remove.click();
  await expect(page.getByText("2 of 3 selected", { exact: true })).toBeVisible();
  await cards.nth(0).getByRole("button", { name: "Try in 8mL set" }).click();
  await page.getByRole("button", { name: "Fresh / Mineral" }).click();
  await expect(page.getByText("3 of 3 selected", { exact: true })).toBeVisible();
  const add = page.getByRole("button", { name: "Add trio to cart — RM99" });
  await add.evaluate((button: HTMLButtonElement) => { button.click(); button.click(); });
  await expect(page.getByRole("button", { name: "Trio added" })).toBeDisabled();
  await expect(page.getByText("View cart", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Checkout" })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("tara-cart-items")!))).toHaveLength(1);
});

test("mobile purchase bar follows inline visibility and respects reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await clearState(page);
  await expect(page.locator('[data-mobile-sticky-cta="true"]')).toBeHidden();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-mobile-sticky-cta="true"]')).toBeVisible();
  await expect(page.getByRole("link", { name: /Cart \(0\)/ })).toBeVisible();
  expect(Number.parseFloat(await page.locator('[data-mobile-sticky-cta="true"]').evaluate((element) => getComputedStyle(element).transitionDuration))).toBeLessThanOrEqual(0.001);
  await page.getByRole("button", { name: "Dismiss purchase bar" }).click();
  await expect(page.locator('[data-mobile-sticky-cta="true"]')).toBeHidden();
  await context.close();
});
