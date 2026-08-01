import type { Metadata } from "next";

import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ConversionCta } from "@/components/sections/ConversionCta";
import { EightMlPromoOffer } from "@/components/sections/EightMlPromoOffer";
import { FeaturedScents } from "@/components/sections/FeaturedScents";
import { Hero } from "@/components/sections/Hero";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { LaunchFaq } from "@/components/sections/LaunchFaq";
import { LaunchUpdates } from "@/components/sections/LaunchUpdates";
import { LaunchUrgency } from "@/components/sections/LaunchUrgency";
import { PaymentLocalizationBar } from "@/components/sections/PaymentLocalizationBar";
import { PhilosophyMoment } from "@/components/sections/PhilosophyMoment";
import { ScentDiscoveryExperience } from "@/components/sections/ScentDiscoveryExperience";
import { ScentFilmTeaser } from "@/components/sections/ScentFilmTeaser";
import { ShoppableScentFamily } from "@/components/sections/ShoppableScentFamily";
import { SocialFeed } from "@/components/sections/SocialFeed";
import { StickyMobileCta } from "@/components/sections/StickyMobileCta";
import { TheonLaunchFeature } from "@/components/sections/TheonLaunchFeature";
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
      {/* Hero section: one clear promise plus the two highest-value actions. */}
      <Hero content={brand.home.hero} />
      <TheonLaunchFeature />
      <LaunchUrgency />
      <PaymentLocalizationBar />
      <LaunchUpdates />
      <EightMlPromoOffer content={brand.home.eightMlPromo} />
      <WhyTara />
      <ScentDiscoveryExperience />
      <ShoppableScentFamily scents={availableScents} />
      <ScentFilmTeaser />
      <PhilosophyMoment quote={brand.home.story.quote} />
      <FeaturedScents intro={brand.home.featuredScents} scents={availableScents} />
      <SocialFeed content={brand.home.social} />
      <JournalPreview />
      <AboutTeaser content={brand.home.story} />
      <LaunchFaq />
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
