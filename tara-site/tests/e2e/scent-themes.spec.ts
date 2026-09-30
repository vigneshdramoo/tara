import { test, expect } from "@playwright/test";

const palettes = {
  aureya: {
    canvas: "rgb(248, 235, 221)",
    text: "rgb(122, 78, 86)",
    soft: "#f6c6d0",
    micro: "#b9828a",
    accent: "#ca9e5b",
  },
  kameira: {
    canvas: "rgb(74, 24, 40)",
    text: "rgb(247, 243, 235)",
    soft: "rgb(247 243 235 / 5%)",
    micro: "#8f4054",
    accent: "#ca9e5b",
  },
  zephyr: {
    canvas: "rgb(24, 54, 90)",
    text: "rgb(232, 231, 225)",
    soft: "rgb(113 137 154 / 24%)",
    micro: "#71899a",
    accent: "#ca9e5b",
  },
  maris: {
    canvas: "rgb(46, 52, 55)",
    text: "rgb(220, 226, 225)",
    soft: "rgb(0 85 90 / 72%)",
    micro: "#c08a4a",
    accent: "#cbb98a",
  },
  eliora: {
    canvas: "rgb(62, 47, 61)",
    text: "rgb(237, 227, 214)",
    soft: "rgb(122 100 112 / 36%)",
    micro: "#8c7b6e",
    accent: "#e8c879",
  },
  ardor: {
    canvas: "rgb(15, 13, 12)",
    text: "rgb(201, 168, 140)",
    soft: "rgb(90 47 36 / 42%)",
    micro: "#8a5a34",
    accent: "#c87a38",
  },
  ashoka: {
    canvas: "rgb(36, 22, 33)",
    text: "rgb(239, 228, 214)",
    soft: "rgb(107 85 112 / 34%)",
    micro: "#8e7d70",
    accent: "#c2a97a",
  },
  theon: {
    canvas: "rgb(247, 243, 235)",
    text: "rgb(10, 10, 10)",
    soft: "rgb(202 158 91 / 18%)",
    micro: "#ca9e5b",
    accent: "#c88e4d",
  },
};
for (const scent of [
  "aureya",
  "kameira",
  "zephyr",
  "maris",
  "eliora",
  "ardor",
  "ashoka",
  "theon",
] as const) {
  for (const width of [375, 390, 430, 768, 1280, 1440, 1920]) {
    test(`${scent} scoped palette and gallery at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      await page.goto(`/scents/${scent}`);
      const root = page.locator(`[data-scent-theme="${scent}"]`);
      await expect(root).toHaveCount(1);
      await expect(page.locator("[data-scent-theme]")).toHaveCount(1);
      await expect(page.locator(".scent-dawn")).toHaveCount(0);
      await expect(root).toHaveCSS("background-color", palettes[scent].canvas);
      await expect(root.locator(".scent-label").first()).toHaveCSS(
        "color",
        palettes[scent].text,
      );
      await expect(root.locator(".scent-tag").first()).toHaveCSS(
        "background-color",
        scent === "aureya"
          ? "rgb(246, 198, 208)"
          : scent === "kameira"
            ? "rgba(247, 243, 235, 0.05)"
            : scent === "zephyr"
              ? "rgba(113, 137, 154, 0.24)"
              : scent === "maris"
                ? "rgba(0, 85, 90, 0.72)"
                : scent === "eliora"
                  ? "rgba(122, 100, 112, 0.36)"
                  : scent === "ardor"
                    ? "rgba(90, 47, 36, 0.42)"
                    : scent === "ashoka"
                      ? "rgba(107, 85, 112, 0.34)"
                      : "rgba(202, 158, 91, 0.18)",
      );
      expect(
        await root.evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--scent-accent").trim(),
        ),
      ).toBe(palettes[scent].accent);
      expect(
        await root.evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--scent-micro-accent").trim(),
        ),
      ).toBe(palettes[scent].micro);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await page
          .locator("header")
          .evaluate((el) =>
            getComputedStyle(el).getPropertyValue("--scent-canvas"),
          ),
      ).toBe("");
      expect(
        await page
          .locator("footer")
          .evaluate((el) =>
            getComputedStyle(el).getPropertyValue("--scent-canvas"),
          ),
      ).toBe("");
      const first = root.getByRole("button", {
        name: "View 50 ml",
        exact: true,
      });
      await first.focus();
      await expect(first).toHaveCSS("outline-style", "solid");
      await first.press("ArrowRight");
      await expect(
        root.getByRole("button", { name: "View Alternate angle", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await first.click();
      await expect(root.locator("figure img")).toHaveJSProperty(
        "complete",
        true,
      );
      expect(
        await root
          .locator("figure img")
          .evaluate((el: HTMLImageElement) => el.naturalWidth),
      ).toBeGreaterThan(0);
      await expect(
        root
          .getByRole("link", { name: "Try In RM99 Set", exact: true })
          .first(),
      ).toHaveAttribute(
        "href",
        "/preorder?checkout=three-8ml-promo#secure-checkout",
      );
      if (scent === "aureya")
        await expect(root.locator(".scent-description")).toHaveCSS(
          "background-color",
          "rgb(246, 198, 208)",
        );
      if (
        [
          "kameira",
          "zephyr",
          "maris",
          "eliora",
          "ardor",
          "ashoka",
          "theon",
        ].includes(scent)
      )
        await expect(root.locator(".scent-panel").first()).toHaveCSS(
          "background-color",
          scent === "kameira"
            ? "rgb(247, 243, 235)"
            : scent === "zephyr"
              ? "rgb(232, 231, 225)"
              : scent === "maris"
                ? "rgb(220, 226, 225)"
                : scent === "eliora"
                  ? "rgb(237, 227, 214)"
                  : scent === "ardor"
                    ? "rgb(201, 168, 140)"
                    : scent === "ashoka"
                      ? "rgb(239, 228, 214)"
                      : "rgb(10, 10, 10)",
        );
      if (width === 390 || width === 1440) {
        await page.screenshot({
          path: `../tmp/themes-${scent}-${width}-hero.png`,
        });
        await root.locator(".scent-editorial").scrollIntoViewIfNeeded();
        await page.waitForFunction(
          () =>
            (document.querySelector(".scent-editorial img") as HTMLImageElement)
              ?.naturalWidth > 0,
        );
        await root.locator(".scent-editorial").screenshot({
          path: `../tmp/themes-${scent}-${width}-editorial.png`,
        });
        await root
          .getByText("Scent Story", { exact: true })
          .scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `../tmp/themes-${scent}-${width}-story.png`,
        });
      }
      expect(errors).toEqual([]);
    });
  }
}
test("other fragrances, catalogue and checkout retain house presentation", async ({
  page,
}) => {
  for (const route of ["/scents", "/", "/cart/checkout"]) {
    await page.goto(route);
    await expect(page.locator("[data-scent-theme]")).toHaveCount(0);
    expect(
      await page
        .locator("body")
        .evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--scent-canvas"),
        ),
    ).toBe("");
  }
});
test("fragrance palette persists under dark mode and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  for (const scent of [
    "aureya",
    "kameira",
    "zephyr",
    "maris",
    "eliora",
    "ardor",
    "ashoka",
    "theon",
  ] as const) {
    await page.goto(`/scents/${scent}`);
    await expect(page.locator("[data-scent-theme]")).toHaveCSS(
      "background-color",
      palettes[scent].canvas,
    );
  }
});
