import type { Metadata } from "next";

import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ConversionCta } from "@/components/sections/ConversionCta";
import { Hero } from "@/components/sections/Hero";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { launchFaqs, LaunchFaq } from "@/components/sections/LaunchFaq";
import { JsonLd } from "@/components/seo/JsonLd";
import { ScentDiscoveryExperience } from "@/components/sections/ScentDiscoveryExperience";
import { ShoppableScentFamily } from "@/components/sections/ShoppableScentFamily";
import { StickyMobileCta } from "@/components/sections/StickyMobileCta";
import { ShoppingPaths } from "@/components/sections/ShoppingPaths";
import { WhyTara } from "@/components/sections/WhyTara";
import { commercialOffers } from "@/content/commercial";
import { brand } from "@/content/brand";
import { getHomepageScents } from "@/lib/catalog";
import { buildFaqPageJsonLd } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/utils";

const homeSocialImage = {
  url: absoluteUrl("/og/tara-home.jpg"),
  width: 1200,
  height: 630,
  alt: "TARA fragrance house scent family.",
};

export const metadata: Metadata = {
  title: {
    absolute: `${brand.name} - Luxury Perfume`,
  },
  description: `${brand.description} Discover our latest launches, THEON and KAMEIRA.`,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: `${brand.name} - Luxury Perfume`,
    description: `${brand.description} Discover our latest launches, THEON and KAMEIRA.`,
    url: absoluteUrl("/"),
    siteName: brand.name,
    images: [homeSocialImage],
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} - Luxury Perfume`,
    description: `${brand.description} Discover our latest launches, THEON and KAMEIRA.`,
    images: [homeSocialImage],
  },
};

export default function HomePage() {
  const availableScents = getHomepageScents();
  const stickyPrimary = brand.home.hero.ctas[0] ?? brand.home.preorder.primary;
  const stickySecondary =
    brand.home.hero.ctas[1] ?? brand.home.eightMlPromo.primary;

  return (
    <>
      <JsonLd data={buildFaqPageJsonLd(launchFaqs)} />

      <Hero content={brand.home.hero} />
      <ShoppingPaths />

      <ShoppableScentFamily scents={availableScents} />

      <ScentDiscoveryExperience />
      <WhyTara />

      <AboutTeaser content={brand.home.story} />

      <JournalPreview />

      <LaunchFaq />

      <ConversionCta
        content={brand.home.preorder}
        trustLine={brand.home.trust.guarantee}
      />

      <StickyMobileCta
        primary={{ ...stickyPrimary, variant: "primary" }}
        secondary={{
          ...stickySecondary,
          label: `Try 3 for ${commercialOffers.discoverySet.price}`,
          variant: "secondary",
        }}
      />
    </>
  );
}
