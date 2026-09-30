import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { test } from "node:test";

const homepagePath = new URL("../out/index.html", import.meta.url);
const sourcePaths = [
  new URL("../src/content/brand.ts", import.meta.url),
  new URL("../src/components/sections/Hero.tsx", import.meta.url),
  new URL("../src/app/page.tsx", import.meta.url),
];
const hasFreshExport =
  existsSync(homepagePath) &&
  statSync(homepagePath).mtimeMs >=
    Math.max(...sourcePaths.map((sourcePath) => statSync(sourcePath).mtimeMs));

test(
  "homepage export renders Stage 2 CTA hierarchy and prices",
  {
    skip: hasFreshExport ? false : "Run npm run build before this check.",
  },
  () => {
    const html = readFileSync(homepagePath, "utf8");
    const heroHtml = html.slice(
      html.indexOf("<main"),
      html.indexOf('id="scent-family"'),
    );
    assert.match(heroHtml, /THEON/);
    assert.match(heroHtml, /KAMEIRA/);
    assert.match(heroHtml, /Explore latest launches/);
    assert.match(heroHtml, /\/scents\/theon/);
    assert.match(heroHtml, /\/scents\/kameira/);
    assert.match(heroHtml, /Try Any 3 For RM99/);
    assert.match(
      heroHtml,
      /\/preorder\?checkout=three-8ml-promo#secure-checkout/,
    );
    assert.match(heroHtml, /Choose your bottle/);
    assert.match(heroHtml, /Start with skin/);
    assert.doesNotMatch(heroHtml, /Purchase reassurance/);
    assert.match(html, /Purchase reassurance/);
    assert.match(html, /RM169/);
    assert.match(html, /RM239/);
  },
);
