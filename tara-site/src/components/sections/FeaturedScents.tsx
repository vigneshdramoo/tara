import Image from "next/image";

import type { Scent, SectionIntro } from "@/types/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { brand } from "@/content/brand";
import {
  buildSecureCheckoutHref,
  canCheckoutScent,
  paymentsEnabled,
} from "@/lib/payments";
import { cn } from "@/lib/utils";

type FeaturedScentsProps = {
  intro: SectionIntro;
  scents: Scent[];
};

export function FeaturedScents({ intro, scents }: FeaturedScentsProps) {
  return (
    <section className="border-b border-black/10 py-16 sm:py-24">
      <Container>
        <div className="relative isolate overflow-hidden border-y border-black/10 py-12 sm:py-16 lg:py-20">
          <Image
            src="/editorial/tara-featured-scent-identity-bg.webp"
            alt=""
            fill
            sizes="100vw"
            className="-z-20 object-cover object-center opacity-24 saturate-[0.82]"
          />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_38%_48%,rgba(247,243,235,0.08)_0%,rgba(247,243,235,0.5)_42%,rgba(247,243,235,0.92)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(247,243,235,0.92)_0%,rgba(247,243,235,0.72)_34%,rgba(247,243,235,0.48)_62%,rgba(247,243,235,0.86)_100%)]" />
          <div className="grid gap-8 px-4 sm:px-6 lg:grid-cols-[0.32fr_1fr] lg:items-end lg:px-10">
            {intro.eyebrow ? (
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)] sm:tracking-[0.38em]">
                {intro.eyebrow}
              </p>
            ) : null}
            <div>
              <h2 className="max-w-5xl text-[clamp(2.8rem,7vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.06em] text-balance">
                {intro.title}
              </h2>
              <p className="mt-7 max-w-3xl text-base leading-7 text-[var(--color-copy)] sm:text-lg sm:leading-8">
                {intro.body}
              </p>
              {intro.note ? (
                <p className="mt-4 text-sm leading-7 text-black/54">{intro.note}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
          {scents.map((scent, index) => {
            const visual = scent.homeVisual ?? scent.visual;

            return (
              <article
                key={scent.slug}
                className="grid gap-6 py-8 lg:grid-cols-[0.48fr_0.52fr] lg:gap-10 lg:py-12"
              >
                <div
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-[1.35rem] border border-black/10 sm:rounded-[1.8rem]",
                    index % 2 === 1 && "lg:order-2",
                  )}
                >
                  <Image
                    src={visual.src}
                    alt={visual.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition duration-700 ease-out hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.02),rgba(247,243,235,0.34))]" />
                  <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2 sm:left-5 sm:top-5">
                    <p className="rounded-full border border-[rgba(202,158,91,0.36)] bg-[rgba(247,243,235,0.76)] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[var(--color-gold)] backdrop-blur-sm">
                      {scent.launch}
                    </p>
                    <span className="rounded-full border border-black/12 bg-[rgba(247,243,235,0.72)] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-black/66 backdrop-blur-sm">
                      {scent.audience}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="text-right text-xs uppercase tracking-[0.22em] text-black/44">
                        {scent.audience}
                      </p>
                    </div>
                    <h3 className="mt-8 text-[clamp(3.4rem,8vw,7.5rem)] font-medium leading-[0.82] tracking-[-0.07em]">
                      {scent.name}
                    </h3>
                    <p className="mt-5 text-xs uppercase tracking-[0.28em] text-black/46">
                      {scent.line}
                    </p>
                    <p className="mt-8 max-w-2xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
                      {scent.summary}
                    </p>
                    <p className="mt-7 text-sm uppercase tracking-[0.22em] text-[var(--color-gold)]">
                      {scent.launchPrice} first 100 / {scent.regularPrice} regular
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["FPX", "DuitNow", "Card", "ToyyibPay"].map((badge) => (
                        <span
                          key={badge}
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[rgba(255,250,241,0.62)] px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-black/56"
                        >
                          <SiteIcon
                            name={badge === "ToyyibPay" ? "lock" : "wallet"}
                            className="h-3.5 w-3.5 text-[var(--color-gold)]"
                          />
                          {badge}
                        </span>
                      ))}
                    </div>
                    <div className="mt-7 grid border-y border-black/10 sm:grid-cols-4">
                      {scent.notes.top.concat(scent.notes.heart.slice(0, 1)).map((note) => (
                        <span
                          key={note}
                          className="border-t border-black/10 py-3 text-[10px] uppercase tracking-[0.22em] text-black/58 first:border-t-0 sm:border-l sm:border-t-0 sm:px-3 sm:first:border-l-0"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
                    <Button
                      href={`/scents/${scent.slug}`}
                      variant="primary"
                      trackingLocation="homepage_featured_scents"
                      trackingParams={{ selected_scent: scent.slug }}
                    >
                      Explore
                    </Button>
                    {paymentsEnabled && canCheckoutScent(scent) ? (
                      <Button
                        href={buildSecureCheckoutHref(scent.slug)}
                        variant="secondary"
                        trackingLocation="homepage_featured_scents"
                        trackingParams={{ selected_scent: scent.slug }}
                      >
                        Add To Cart
                      </Button>
                    ) : (
                      <Button
                        href="/preorder"
                        variant="secondary"
                        trackingLocation="homepage_featured_scents"
                        trackingParams={{ selected_scent: scent.slug }}
                      >
                        {scent.status === "available" ? "Preorder" : "Join Waitlist"}
                      </Button>
                    )}
                    <Button
                      href={brand.whatsappUrl}
                      variant="secondary"
                      trackingLocation="homepage_featured_scents_whatsapp"
                      trackingParams={{ selected_scent: scent.slug }}
                    >
                      WhatsApp Advice
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
