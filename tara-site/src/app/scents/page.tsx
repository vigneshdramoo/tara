import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getAvailableScents } from "@/lib/catalog";
import {
  buildSecureCheckoutHref,
  canCheckoutScent,
  paymentsEnabled,
} from "@/lib/payments";
import { absoluteUrl, cn } from "@/lib/utils";

const scentsSocialImage = {
  url: absoluteUrl("/og/tara-theon.jpg"),
  width: 1200,
  height: 630,
  alt: "THEON Eau de Parfum bottle in warm golden light for the TARA new launch.",
};

const scentLineupVisual = {
  src: "/editorial/tara-theon-duo.png",
  alt: "THEON 50mL and 8mL Eau de Parfum bottles announcing the TARA new launch.",
  priority: true,
};

export const metadata: Metadata = {
  title: "Scents",
  description:
    "Explore the TARA scent lineup online: Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, and THEON.",
  alternates: {
    canonical: absoluteUrl("/scents"),
  },
  openGraph: {
    title: "TARA Scents - Meet The Lineup",
    description:
      "Explore Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, and THEON online.",
    url: absoluteUrl("/scents"),
    images: [scentsSocialImage],
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TARA Scents - Meet The Lineup",
    description:
      "Explore Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, and THEON online.",
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
        body="A warm tea gourmand joins Aureya, Zephyr, Maris, Eliora, Ashoka, and Ardor in TARA's online fragrance chapter. Each 50mL Eau de Parfum is RM239 regular, with launch allocation at RM169."
        note="Need help deciding? Explore THEON, compare the lineup, or try any 3 x 8mL EDP for RM99."
        visual={scentLineupVisual}
        primaryCta={{
          label: "Take The Quiz",
          href: "/quiz",
          variant: "primary",
        }}
        secondaryCta={{
          label: "Order 3 x 8mL",
          href: "/preorder?checkout=three-8ml-promo#secure-checkout",
          variant: "secondary",
        }}
      />

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.34fr_1fr] lg:items-end">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
              Scent Family
            </p>
            <h2 className="max-w-5xl text-[clamp(3.4rem,8vw,7.5rem)] font-medium leading-[0.84] tracking-[-0.07em] text-balance">
              Seven formulas. Seven forms of presence.
            </h2>
          </div>

          <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
            {availableScents.map((scent, index) => (
              <article
                key={scent.slug}
                className="grid gap-6 py-8 lg:grid-cols-[0.46fr_0.54fr] lg:gap-10 lg:py-12"
              >
                <div
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-[1.35rem] border border-black/10 sm:rounded-[1.8rem]",
                    index % 2 === 1 && "lg:order-2",
                  )}
                >
                    <Image
                      src={scent.visual.src}
                      alt={scent.visual.alt}
                      fill
                      className={cn(
                        scent.visual.fit === "contain" ? "object-contain" : "object-cover",
                      )}
                      style={
                        scent.visual.position
                          ? { objectPosition: scent.visual.position }
                          : undefined
                      }
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.04),rgba(247,243,235,0.34))]" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="text-right text-xs uppercase tracking-[0.22em] text-black/44">
                        {scent.isNew ? (
                          <span className="mb-2 block text-[#CA9E5B]">New</span>
                        ) : null}
                        {scent.audience}
                      </p>
                    </div>
                    <h2 className="mt-8 text-[clamp(3.5rem,9vw,8rem)] font-medium leading-[0.82] tracking-[-0.075em]">
                      {scent.name}
                    </h2>
                    <p className="mt-5 text-xs uppercase tracking-[0.28em] text-black/46">
                      {scent.line}
                    </p>
                    <p className="mt-8 max-w-2xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
                      {scent.summary}
                    </p>
                    <div className="mt-7 grid border-y border-black/10 sm:grid-cols-3">
                      <p className="py-4 text-xs uppercase leading-6 tracking-[0.22em] text-[var(--color-gold)]">
                        {scent.launchPrice} launch
                      </p>
                      <p className="border-t border-black/10 py-4 text-xs uppercase leading-6 tracking-[0.22em] text-black/54 sm:border-l sm:border-t-0 sm:px-4">
                        {scent.regularPrice} regular
                      </p>
                      <p className="border-t border-black/10 py-4 text-xs uppercase leading-6 tracking-[0.22em] text-black/54 sm:border-l sm:border-t-0 sm:px-4">
                        {scent.size}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button href={`/scents/${scent.slug}`} variant="primary">
                      Explore
                    </Button>
                    {paymentsEnabled && canCheckoutScent(scent) ? (
                      <Button
                        href={buildSecureCheckoutHref(scent.slug)}
                        variant="secondary"
                      >
                        Add To Cart
                      </Button>
                    ) : (
                      <Button href="/preorder" variant="secondary">
                        Preorder
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

        </Container>
      </section>
    </>
  );
}
