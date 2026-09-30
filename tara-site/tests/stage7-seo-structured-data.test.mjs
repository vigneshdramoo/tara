import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { test } from "node:test";

const paths = {
  home: new URL("../out/index.html", import.meta.url),
  product: new URL("../out/scents/theon.html", import.meta.url),
  journalArticle: new URL(
    "../out/journal/perfume-malaysia-humid-weather.html",
    import.meta.url,
  ),
  policy: new URL("../out/privacy.html", import.meta.url),
  cart: new URL("../out/cart.html", import.meta.url),
  links: new URL("../out/links.html", import.meta.url),
  sitemap: new URL("../out/sitemap.xml", import.meta.url),
};

const sourcePaths = [
  new URL("../src/components/seo/JsonLd.tsx", import.meta.url),
  new URL("../src/lib/structured-data.ts", import.meta.url),
  new URL("../src/app/layout.tsx", import.meta.url),
  new URL("../src/app/page.tsx", import.meta.url),
  new URL("../src/app/scents/[slug]/page.tsx", import.meta.url),
  new URL("../src/app/journal/[slug]/page.tsx", import.meta.url),
  new URL("../src/components/pages/PolicyPage.tsx", import.meta.url),
  new URL("../src/app/sitemap.ts", import.meta.url),
  new URL("../src/app/cart/page.tsx", import.meta.url),
  new URL("../src/app/links/page.tsx", import.meta.url),
];

const hasFreshExport =
  Object.values(paths).every((path) => existsSync(path)) &&
  Math.min(...Object.values(paths).map((path) => statSync(path).mtimeMs)) >=
    Math.max(...sourcePaths.map((sourcePath) => statSync(sourcePath).mtimeMs));

function readHtml(path) {
  return readFileSync(path, "utf8");
}

function extractJsonLd(html) {
  return [
    ...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g),
  ].map((match) => JSON.parse(match[1]));
}

function flattenJsonLd(jsonLd) {
  return jsonLd.flatMap((item) => (Array.isArray(item) ? item : [item]));
}

test("Stage 7 source adds structured-data builders and utility-page SEO rules", () => {
  const structuredData = readHtml(sourcePaths[1]);
  const sitemap = readHtml(sourcePaths[7]);
  const cartPage = readHtml(sourcePaths[8]);
  const linksPage = readHtml(sourcePaths[9]);

  assert.match(structuredData, /buildOrganizationJsonLd/);
  assert.match(structuredData, /buildProductJsonLd/);
  assert.match(structuredData, /priceCurrency: "MYR"/);
  assert.match(structuredData, /buildBreadcrumbJsonLd/);
  assert.match(structuredData, /buildArticleJsonLd/);
  assert.match(structuredData, /buildFaqPageJsonLd/);
  assert.doesNotMatch(sitemap, /"\/cart"/);
  assert.doesNotMatch(sitemap, /"\/links"/);
  assert.match(cartPage, /index: false/);
  assert.match(linksPage, /index: false/);
});

test(
  "Stage 7 exported HTML contains valid JSON-LD and sitemap/noindex rules",
  {
    skip: hasFreshExport ? false : "Run npm run build before this check.",
  },
  () => {
    const homeJsonLd = flattenJsonLd(extractJsonLd(readHtml(paths.home)));
    const productJsonLd = flattenJsonLd(extractJsonLd(readHtml(paths.product)));
    const articleJsonLd = flattenJsonLd(
      extractJsonLd(readHtml(paths.journalArticle)),
    );
    const policyJsonLd = flattenJsonLd(extractJsonLd(readHtml(paths.policy)));
    const sitemapXml = readHtml(paths.sitemap);
    const cartHtml = readHtml(paths.cart);
    const linksHtml = readHtml(paths.links);

    assert.ok(homeJsonLd.some((item) => item["@type"] === "Organization"));
    assert.ok(homeJsonLd.some((item) => item["@type"] === "FAQPage"));

    const product = productJsonLd.find((item) => item["@type"] === "Product");
    assert.equal(product?.name, "THEON Eau de Parfum");
    assert.equal(product?.offers?.priceCurrency, "MYR");
    assert.equal(product?.offers?.price, "169.00");
    assert.equal(product?.offers?.availability, "https://schema.org/InStock");
    assert.match(
      product?.image?.[0] ?? "",
      /scents\/theon\/theon-50ml-hero\.webp/,
    );
    assert.ok(productJsonLd.some((item) => item["@type"] === "BreadcrumbList"));

    assert.ok(articleJsonLd.some((item) => item["@type"] === "Article"));
    assert.ok(articleJsonLd.some((item) => item["@type"] === "BreadcrumbList"));
    assert.ok(policyJsonLd.some((item) => item["@type"] === "BreadcrumbList"));

    assert.match(sitemapXml, /https:\/\/tarascents\.com\/scents\/theon/);
    assert.match(
      sitemapXml,
      /https:\/\/tarascents\.com\/journal\/perfume-malaysia-humid-weather/,
    );
    assert.doesNotMatch(sitemapXml, /https:\/\/tarascents\.com\/cart/);
    assert.doesNotMatch(sitemapXml, /https:\/\/tarascents\.com\/links/);
    assert.match(cartHtml, /noindex/);
    assert.match(linksHtml, /noindex/);
  },
);
