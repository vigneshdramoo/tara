import type { Metadata } from "next";

import { ScentCatalogExplorer } from "@/components/product/ScentCatalogExplorer";
import { PageHero } from "@/components/sections/PageHero";
import { getAvailableScents } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/utils";

const scentsSocialImage = {
  url: absoluteUrl("/og/tara-theon.jpg"),
  width: 1200,
  height: 630,
  alt: "THEON Eau de Parfum bottle in warm golden light for the TARA new launch.",
};

const scentLineupVisual = {
  src: "/editorial/tara-theon-duo-optimized.webp",
  alt: "THEON 50mL and 8mL Eau de Parfum bottles announcing the TARA new launch.",
  priority: true,
};

export const metadata: Metadata = {
  title: "Scents",
  description:
    "Explore the TARA scent lineup online: Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, THEON, and KAMEIRA.",
  alternates: {
    canonical: absoluteUrl("/scents"),
  },
  openGraph: {
    title: "TARA Scents - Meet The Lineup",
    description:
      "Explore Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, THEON, and KAMEIRA online.",
    url: absoluteUrl("/scents"),
    images: [scentsSocialImage],
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TARA Scents - Meet The Lineup",
    description:
      "Explore Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, THEON, and KAMEIRA online.",
    images: [scentsSocialImage],
  },
};

export default function ScentsPage() {
  const availableScents = getAvailableScents();

  return (
    <>
      <PageHero
        eyebrow="Scents"
        title="THEON joins the house."
        body="A warm tea gourmand joins Aureya, Zephyr, Maris, Eliora, Ashoka, and Ardor in TARA's online fragrance chapter. Explore KAMEIRA, No. 08, alongside the house. 50mL Eau de Parfum is RM169."
        note="Need help deciding? Explore THEON, compare the lineup, or try any 3 x 8mL EDP for RM99."
        visual={scentLineupVisual}
        primaryCta={{
          label: "Take The Quiz",
          href: "/quiz",
          variant: "primary",
        }}
        secondaryCta={{
          label: "Try 3 × 8mL — RM99",
          href: "#build-discovery-set",
          variant: "secondary",
        }}
        compact
      />

      <section aria-label="Catalogue summary" className="border-b border-black/10 bg-[#fbf8f1]">
        <div className="mx-auto grid w-full max-w-[1200px] divide-y divide-black/10 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
          <p className="py-4 text-center text-xs font-semibold uppercase tracking-[0.2em]">{availableScents.length} scents</p>
          <p className="py-4 text-center text-xs font-semibold uppercase tracking-[0.2em]">50mL Eau de Parfum from {availableScents.map((scent) => scent.launchPrice ?? scent.price).find(Boolean)}</p>
          <p className="py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">Try any 3 × 8mL for RM99</p>
        </div>
      </section>

      <ScentCatalogExplorer scents={availableScents} />
    </>
  );
}
