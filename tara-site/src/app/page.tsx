import type { Metadata } from "next";

import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ConversionCta } from "@/components/sections/ConversionCta";
import { Hero } from "@/components/sections/Hero";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { LaunchFaq } from "@/components/sections/LaunchFaq";
import { ScentDiscoveryExperience } from "@/components/sections/ScentDiscoveryExperience";
import { ShoppableScentFamily } from "@/components/sections/ShoppableScentFamily";
import { StickyMobileCta } from "@/components/sections/StickyMobileCta";
import { WhyTara } from "@/components/sections/WhyTara";
import { brand } from "@/content/brand";
import { scentDiscoveryExperience } from "@/content/homepage";
import { getAvailableScents } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/utils";

const homeSocialImage = {
  url: absoluteUrl("/og/tara-theon.jpg"),
  width: 1200,
  height: 630,
  alt: "THEON Eau de Parfum bottle in warm golden light for the TARA new launch.",
};

export const metadata: Metadata = {
  title: {
    absolute: `${brand.name} - Luxury Perfume`,
  },
  description: brand.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: `${brand.name} - Luxury Perfume`,
    description: brand.description,
    url: absoluteUrl("/"),
    siteName: brand.name,
    images: [homeSocialImage],
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} - Luxury Perfume`,
    description: brand.description,
    images: [homeSocialImage],
  },
};

export default function HomePage() {
  const availableScents = getAvailableScents();

  return (
    <>
      {/* 1. Hero: the house's single clear promise, plus the two highest-value actions. */}
      <Hero content={brand.home.hero} />

      {/* 2. Scent Family: the one canonical product listing (grid + comparison table). */}
      <ShoppableScentFamily scents={availableScents} />

      {/* 3. Why TARA: trust credentials and launch stats, kept to a single tight pass. */}
      <WhyTara />

      {/* 4. Find Your Scent: the interactive quiz teaser, the page's one signature moment. */}
      <ScentDiscoveryExperience />

      {/* 5. About + Philosophy: brand story and the house quote, merged into one beat. */}
      <AboutTeaser content={brand.home.story} />

      {/* 6. Journal: practical content, keeps scroll depth earning its keep. */}
      <JournalPreview />

      {/* 7. FAQ: pre-purchase objections handled before the final ask. */}
      <LaunchFaq />

      {/* 8. Final CTA: the one closing conversion moment. */}
      <ConversionCta
        content={brand.home.preorder}
        trustLine={brand.home.trust.guarantee}
      />

      <StickyMobileCta
        primary={{ ...scentDiscoveryExperience.secondary, variant: "primary" }}
        secondary={{ ...brand.home.eightMlPromo.primary, variant: "secondary" }}
      />
    </>
  );
}
