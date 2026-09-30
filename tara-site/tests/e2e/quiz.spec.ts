import { expect, test, type Page } from "@playwright/test";

async function answer(page: Page, letter: string, index: number) {
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(index));
  await expect(page.locator("main input:visible")).toHaveCount(0);
  await page.getByRole("button", { name: new RegExp(`^${letter} `) }).click();
  if (index < 8) {
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(index + 1));
  } else {
    await expect(page.getByRole("heading", { name: /Your scent is/ })).toBeVisible();
  }
}

test.beforeEach(async ({ page, context }) => {
  // Keep the verification local and prevent any form, order, or analytics submission.
  await context.route("**/*", (route) => {
    const request = route.request();
    if (request.method() !== "GET" || !request.url().startsWith("http://127.0.0.1:3100")) return route.abort();
    return route.continue();
  });
  await page.goto("/quiz");
});

test("KAMEIRA landing, ungated result, analytics, both CTAs and restart", async ({ page }) => {
  await expect(page.locator("main").getByText("KAMEIRA", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Begin The Journey" }).click();
  for (let i = 1; i <= 8; i++) await answer(page, "H", i);
  await expect(page.getByRole("heading", { name: "Your scent is KAMEIRA." })).toBeVisible();
  for (const text of ["No. 08", "Warm gourmand", "Warm, soft, skin-close", "Evenings, close-range, air-conditioned rooms", "Blackcurrant wine", "Velvet rose", "Burnished amber"]) {
    await expect(page.locator("main").getByText(text, { exact: true })).toBeVisible();
  }
  const event = await page.evaluate(() => window.dataLayer?.find((entry) => !Array.isArray(entry) && entry.event === "quiz_complete"));
  expect(event).toEqual({ event: "quiz_complete", event_category: "lead", quiz_name: "find_your_light", quiz_result: "kameira", aureya_score: 0, zephyr_score: 0, maris_score: 0, eliora_score: 0, ashoka_score: 0, ardor_score: 0, theon_score: 0, kameira_score: 8 });
  for (const [label, slug] of [["Reserve 50mL Bottle", "kameira"], ["Try In RM99 Set", "three-8ml-promo"]]) {
    const link = page.getByRole("link", { name: label, exact: true });
    await expect(link).toHaveAttribute("href", `/preorder?checkout=${slug}#secure-checkout`);
    // Open the actual CTA destination in a second tab, keeping the quiz result intact.
    const destination = await page.context().newPage();
    await destination.goto((await link.getAttribute("href"))!);
    await expect(destination.locator("#secure-checkout")).toBeVisible();
    await expect(destination.locator("#secure-checkout select")).toHaveValue(slug);
    await destination.close();
  }
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  await expect(page.getByRole("heading", { name: /Your scent is/ })).toHaveCount(0);
  for (let i = 1; i <= 8; i++) await answer(page, "A", i);
  await expect(page.getByRole("heading", { name: "Your scent is ZEPHYR." })).toBeVisible();
});

test("Back replaces votes, result Back recalculates, and Close resets", async ({ page }) => {
  await page.getByRole("button", { name: "Begin The Journey" }).click();
  await answer(page, "H", 1);
  await page.getByRole("button", { name: "Back", exact: true }).click();
  for (let i = 1; i <= 8; i++) await answer(page, i <= 4 ? "H" : "G", i);
  await expect(page.getByRole("heading", { name: "Your scent is THEON." })).toBeVisible();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await answer(page, "H", 8);
  await expect(page.getByRole("heading", { name: "Your scent is KAMEIRA." })).toBeVisible();
  const event = await page.evaluate(() => window.dataLayer?.filter((entry) => !Array.isArray(entry) && entry.event === "quiz_complete").at(-1));
  expect(event).toMatchObject({ kameira_score: 5, theon_score: 3 });
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.getByRole("button", { name: "Begin The Journey" })).toBeVisible();
});
