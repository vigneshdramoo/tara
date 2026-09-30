import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const href = "/preorder?checkout=three-8ml-promo#secure-checkout";
const trio = ["AUREYA", "THEON", "KAMEIRA"];
const configuration = {
  type: "three-8ml-discovery-set",
  scentIds: ["aureya", "kameira", "theon"],
};
const cart = [{ slug: "three-8ml-promo", quantity: 1, configuration }];
const picker = (page: Page) => page.locator("#discovery-selection");
async function select(page: Page, names = trio) {
  for (const name of names)
    await picker(page).getByRole("checkbox", { name, exact: true }).check();
}
async function capture(page: Page, name: string) {
  await mkdir("docs/rm99-verification", { recursive: true });
  await page.screenshot({ path: `docs/rm99-verification/${name}.png` });
}

test.beforeEach(async ({ context }) => {
  await context.route("**/*", (route) => {
    if (
      !route.request().url().startsWith("http://127.0.0.1:3100") ||
      route.request().method() !== "GET"
    )
      return route.abort();
    return route.continue();
  });
});

for (const width of [375, 390, 768, 1440]) {
  test(`discovery selection, persistence, variants and checkout review at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(href);
    await expect(picker(page).getByRole("checkbox")).toHaveCount(8);
    await expect(page.locator("#secure-checkout")).toContainText(
      "Dispatch timing to be confirmed",
    );
    const add = picker(page).getByRole("button", {
      name: "Add 3-scent set to cart — RM99",
      exact: true,
    });
    await expect(add).toBeDisabled();
    await expect(picker(page)).toContainText("0 of 3 selected");
    await picker(page).evaluate((element) =>
      window.scrollTo(0, (element as HTMLElement).offsetTop - 130),
    );
    await capture(page, `before-${width}`);
    await picker(page)
      .getByRole("checkbox", { name: "AUREYA", exact: true })
      .focus();
    await page.keyboard.press("Space");
    await expect(picker(page)).toContainText("1 of 3 selected");
    await capture(page, `one-${width}`);
    await page.reload();
    await expect(
      picker(page).getByRole("checkbox", { name: "AUREYA", exact: true }),
    ).toBeChecked();
    await select(page);
    await expect(add).toBeEnabled();
    await picker(page)
      .getByRole("checkbox", { name: "MARIS", exact: true })
      .click();
    await expect(picker(page)).toContainText("You can choose up to 3 scents.");
    await expect(
      picker(page).getByRole("checkbox", { checked: true }),
    ).toHaveCount(3);
    await picker(page)
      .getByText(
        "You can choose up to 3 scents. Remove one to choose another.",
        { exact: true },
      )
      .scrollIntoViewIfNeeded();
    await capture(page, `validation-${width}`);
    await picker(page)
      .getByRole("checkbox", { name: "THEON", exact: true })
      .uncheck();
    await expect(add).toBeDisabled();
    await picker(page)
      .getByRole("checkbox", { name: "THEON", exact: true })
      .check();
    await page.reload();
    await expect(
      picker(page).getByRole("checkbox", { checked: true }),
    ).toHaveCount(3);
    await add.scrollIntoViewIfNeeded();
    await capture(page, `three-${width}`);
    // Two immediate activations cannot create two sets.
    await add.evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });
    await expect(
      picker(page).getByRole("button", { name: "Set added to cart" }),
    ).toBeDisabled();
    expect(
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem("tara-cart-items")!),
      ),
    ).toEqual(cart);
    await picker(page)
      .getByRole("checkbox", { name: "AUREYA", exact: true })
      .uncheck();
    await picker(page)
      .getByRole("checkbox", { name: "MARIS", exact: true })
      .check();
    await add.click();
    await page.goto("/cart");
    await expect(page.locator("main article")).toHaveCount(2);
    await expect(page.locator("main")).toContainText(
      "AUREYA · KAMEIRA · THEON",
    );
    await expect(page.locator("main")).toContainText("KAMEIRA · MARIS · THEON");
    await expect(page.locator("main")).toContainText("198.00");
    await expect(page.locator("main")).toContainText(
      "Estimated total before shipping",
    );
    await expect(page.locator("main")).toContainText(
      "Calculated after delivery details",
    );
    await page
      .getByText("AUREYA · KAMEIRA · THEON", { exact: true })
      .first()
      .evaluate((element) =>
        window.scrollTo({
          top: window.scrollY + element.getBoundingClientRect().top - 240,
          behavior: "instant",
        }),
      );
    await capture(page, `cart-${width}`);
    await page.reload();
    await page.getByRole("link", { name: "Proceed to Checkout" }).click();
    await expect(page).toHaveURL(/\/cart\/checkout$/);
    await expect(page.locator("main aside").first()).toContainText(
      "AUREYA · KAMEIRA · THEON",
    );
    await expect(page.locator("main aside").first()).toContainText(
      "KAMEIRA · MARIS · THEON",
    );
    await expect(page.locator("main aside").first()).toContainText(
      "Dispatch timing to be confirmed",
    );
    await expect(page.locator("main")).toContainText(
      "Pay securely via ToyyibPay",
    );
    await page
      .locator("main aside")
      .first()
      .evaluate((element) =>
        window.scrollTo({
          top: window.scrollY + element.getBoundingClientRect().top - 140,
          behavior: "instant",
        }),
      );
    await capture(page, `checkout-${width}`);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("legacy and tampered sets remain visible and block payment, with a remove-and-reselect route", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "tara-cart-items",
      JSON.stringify([
        { slug: "three-8ml-promo", quantity: 1 },
        { slug: "theon", quantity: 1 },
      ]),
    ),
  );
  await page.goto("/cart");
  await expect(
    page.getByRole("button", { name: "Proceed to Checkout" }),
  ).toBeDisabled();
  await expect(page.locator("main")).toContainText(
    "Choose 3 scents to continue.",
  );
  await page.goto("/cart/checkout");
  await expect(
    page.getByRole("button", { name: "Checkout Securely" }),
  ).toBeDisabled();
  await expect(page.locator("main")).toContainText(
    "Return to cart to replace this set.",
  );
  await page.goto("/cart");
  await page
    .locator("main article")
    .first()
    .getByRole("button", { name: "Remove", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Proceed to Checkout" }),
  ).toBeVisible();
  await expect(page.locator("main article")).toHaveCount(1);
});

test("stale draft recovers, storage failure is visible, back navigation retains choices, no-JS fallback", async ({
  page,
  browser,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "tara-discovery-selection-v1",
      JSON.stringify(["aureya", "theon", "removed-scent"]),
    ),
  );
  await page.goto(href + "&scent=ignored");
  await expect(picker(page)).toContainText(
    "One selected scent is no longer available.",
  );
  await expect(picker(page)).toContainText("2 of 3 selected");
  await select(page);
  await page.goto("/scents");
  await page.goBack();
  await expect(
    picker(page).getByRole("checkbox", { checked: true }),
  ).toHaveCount(3);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("denied");
    };
  });
  await picker(page)
    .getByRole("button", {
      name: "Add 3-scent set to cart — RM99",
      exact: true,
    })
    .click();
  await expect(picker(page)).toContainText(
    "We could not save your selection. Please try again.",
  );
  const context = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await context.newPage();
  await nojs.goto(href);
  await expect(
    nojs.getByText(/Enable JavaScript to select your trio/),
  ).toBeVisible();
  await context.close();
});

async function fillCheckout(page: Page) {
  for (const [name, value] of Object.entries({
    name: "Test customer",
    email: "test@example.test",
    phone: "00000000",
    address_line_1: "Test address",
    address_line_2: "Test district",
    city: "Test city",
    zipcode: "00000",
    country: "Malaysia",
  }))
    await page.locator(`main input[name="${name}"]`).fill(value);
}

test("delivery payload retains configuration, prevents repeated submit, and recovers from network failure", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(
    (items) => localStorage.setItem("tara-cart-items", JSON.stringify(items)),
    cart,
  );
  await page.goto("/cart/checkout");
  const submit = page.getByRole("button", {
    name: "Checkout Securely",
    exact: true,
  });
  await page.locator('main input[name="country"]').fill("");
  await submit.click();
  await expect(page.getByText("Enter your full name.")).toBeVisible();
  await expect(page.getByText("Enter your email address.")).toBeVisible();
  await expect(
    page.getByText("Enter your WhatsApp or phone number."),
  ).toBeVisible();
  await expect(page.getByText("Enter your delivery address.")).toBeVisible();
  await expect(page.getByText("Enter your city.")).toBeVisible();
  await expect(page.getByText("Enter your postcode.")).toBeVisible();
  await expect(page.getByText("Enter your country.")).toBeVisible();
  await expect(page.locator('main input[name="name"]')).toBeFocused();
  await page.locator('main input[name="name"]').fill("Test customer");
  await page.locator('main input[name="email"]').fill("invalid");
  await page.locator('main input[name="phone"]').fill("12");
  await page.locator('main input[name="address_line_1"]').fill("Test address");
  await page.locator('main input[name="city"]').fill("Test city");
  await page.locator('main input[name="zipcode"]').fill("00000");
  await submit.click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(
    page.getByText("Enter a valid phone number with 8 to 15 digits."),
  ).toBeVisible();
  await expect(page.locator('main input[name="email"]')).toBeFocused();
  await fillCheckout(page);
  await page.route("http://127.0.0.1:3100/", (route) =>
    route.fulfill({ status: 200, body: "OK" }),
  );
  let calls = 0;
  let payload: Record<string, unknown> | undefined;
  await page.route("**/create-toyyibpay-bill", async (route) => {
    calls++;
    payload = route.request().postDataJSON();
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Please try again. Your cart is safe." }),
    });
  });
  await submit.evaluate((button: HTMLButtonElement) => {
    button.click();
    button.click();
  });
  if (process.env.RM99_PAYMENT_E2E === "1") {
    await expect(
      page.getByText("Please try again. Your cart is safe.", { exact: true }),
    ).toBeVisible();
    expect(calls).toBe(1);
    expect(payload?.items).toEqual([
      { scentSlug: "three-8ml-promo", quantity: 1, configuration },
    ]);
    await expect(submit).toBeEnabled();
    await page.unroute("**/create-toyyibpay-bill");
    await page.route("**/create-toyyibpay-bill", (route) =>
      route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          paymentUrl: "http://127.0.0.1:3100/payment/mock",
          billCode: "mock-bill",
          receiptToken: "mock-token",
        }),
      }),
    );
    await submit.click();
    await expect(page).toHaveURL(/\/payment\/mock$/);
    expect(
      await page.evaluate(() => localStorage.getItem("tara-receipt-mock-bill")),
    ).toBe("mock-token");
  } else {
    await expect(
      page.getByText(/Secure checkout is being connected/),
    ).toBeVisible();
    expect(calls).toBe(0);
  }
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("tara-cart-items")!),
    ),
  ).toEqual(cart);
});

test("verified receipt shows scents; pending, failed and spoofed success preserve cart", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate((items) => {
    localStorage.setItem("tara-cart-items", JSON.stringify(items));
    localStorage.setItem("tara-receipt-testbill", "test-token");
  }, cart);
  for (const status of ["pending", "failed", "success"]) {
    await page.route("**/get-toyyibpay-bill-status?*", async (route) => {
      expect(route.request().headers()["x-tara-receipt"]).toBe("test-token");
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          status,
          billCode: "testbill",
          amountInSen: 9900,
          items: [
            {
              ...cart[0],
              name: "3 x 8mL Promo Set",
              priceInSen: 9900,
              configuration: {
                ...configuration,
                scentNames: trio,
                selectionLabel: "AUREYA · KAMEIRA · THEON",
              },
            },
          ],
        }),
      });
    });
    await page.goto(`/payment/result?billcode=testbill&status_id=1`);
    await expect(
      page.getByRole("region", { name: "Your order" }),
    ).toContainText("AUREYA · KAMEIRA · THEON");
    if (status !== "success")
      expect(
        await page.evaluate(() => localStorage.getItem("tara-cart-items")),
      ).not.toBeNull();
    else
      await expect
        .poll(() =>
          page.evaluate(() => localStorage.getItem("tara-cart-items")),
        )
        .toBeNull();
    await page.unroute("**/get-toyyibpay-bill-status?*");
  }
  await page.evaluate(
    (items) => localStorage.setItem("tara-cart-items", JSON.stringify(items)),
    cart,
  );
  await page.route("**/get-toyyibpay-bill-status?*", (route) => route.abort());
  await page.goto("/payment/result?billcode=testbill&status_id=1");
  await expect(
    page.getByRole("heading", { name: "We are checking your payment status." }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("tara-cart-items")),
  ).not.toBeNull();
});

test("paid receipt removes only purchased quantities and does not clear new items on refresh", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate((items) => {
    localStorage.setItem(
      "tara-cart-items",
      JSON.stringify([
        { ...items[0], quantity: 2 },
        { slug: "theon", quantity: 1 },
      ]),
    );
    localStorage.setItem("tara-receipt-once", "token");
  }, cart);
  await page.route("**/get-toyyibpay-bill-status?*", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        status: "success",
        items: [
          {
            ...cart[0],
            name: "3 x 8mL Promo Set",
            priceInSen: 9900,
            configuration: {
              ...configuration,
              scentNames: trio,
              selectionLabel: "AUREYA · KAMEIRA · THEON",
            },
          },
        ],
      }),
    }),
  );
  await page.goto("/payment/result?billcode=once&status_id=1");
  const expected = [...cart, { slug: "theon", quantity: 1 }];
  await expect
    .poll(() =>
      page.evaluate(() => JSON.parse(localStorage.getItem("tara-cart-items")!)),
    )
    .toEqual(expected);
  await page.reload();
  await expect(page.getByRole("region", { name: "Your order" })).toBeVisible();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("tara-cart-items")!),
    ),
  ).toEqual(expected);
});
