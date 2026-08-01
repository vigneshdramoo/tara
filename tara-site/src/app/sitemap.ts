import type { MetadataRoute } from "next";

import { journalArticles } from "@/content/journal";
import { legalPages } from "@/content/legal";
import { scents } from "@/content/scents";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/about",
    "/cart",
    "/scents",
    "/popup",
    "/quiz",
    "/preorder",
    "/contact",
    "/links",
    "/journal",
    ...legalPages.map((page) => `/${page.slug}`),
    ...journalArticles.map((article) => `/journal/${article.slug}`),
    ...scents.map((scent) => `/scents/${scent.slug}`),
  ];

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
  }));
}
