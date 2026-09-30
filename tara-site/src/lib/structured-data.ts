import { brand } from "@/content/brand";
import { commercialOffers } from "@/content/commercial";
import type { JournalArticle } from "@/content/journal";
import type { PolicyPageContent } from "@/content/legal";
import type { Scent } from "@/types/content";
import { absoluteUrl } from "@/lib/utils";

type BreadcrumbItem = {
  name: string;
  href: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const organizationId = absoluteUrl("/#organization");

function priceFromSen(priceInSen?: number) {
  return ((priceInSen ?? commercialOffers.fullBottle.priceInSen) / 100).toFixed(2);
}

function imageUrl(path: string) {
  return absoluteUrl(path);
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: brand.name,
    url: absoluteUrl("/"),
    logo: imageUrl("/logos/tara-wordmark.png"),
    description: brand.description,
    email: brand.contactEmail,
    sameAs: [brand.instagramUrl],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+601143042883",
        email: brand.contactEmail,
        areaServed: "MY",
      },
    ],
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function buildProductJsonLd(scent: Scent) {
  const productUrl = absoluteUrl(`/scents/${scent.slug}`);
  const isAvailable = scent.status === "available";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: `${scent.name} Eau de Parfum`,
    description: scent.summary,
    image: [imageUrl(scent.visual.src)],
    ...(scent.slug === "kameira" ? {} : { sku: `TARA-${scent.slug.toUpperCase()}-50ML` }),
    brand: {
      "@type": "Brand",
      name: brand.name,
    },
    category: "Fragrance",
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "MYR",
      price: priceFromSen(scent.priceInSen),
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@id": organizationId,
      },
    },
  };
}

export function buildArticleJsonLd(article: JournalArticle) {
  const articleUrl = absoluteUrl(`/journal/${article.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    headline: article.title,
    description: article.excerpt,
    image: [imageUrl(article.visual.src)],
    mainEntityOfPage: articleUrl,
    inLanguage: "en-MY",
    author: {
      "@type": "Organization",
      name: brand.name,
    },
    publisher: {
      "@id": organizationId,
    },
  };
}

export function buildFaqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildPolicyBreadcrumbJsonLd(page: PolicyPageContent) {
  return buildBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Trust Center", href: "/privacy" },
    { name: page.title, href: `/${page.slug}` },
  ]);
}
