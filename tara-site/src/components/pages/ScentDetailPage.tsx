import { ScentGallery } from "@/components/product/ScentGallery";
import { ScentImage } from "@/components/product/ScentImage";

import type { Scent } from "@/types/content";
import { ConciergeCallout } from "@/components/product/ConciergeCallout";
import { PriceBlock } from "@/components/product/PriceBlock";
import { ProductProfile } from "@/components/product/ProductProfile";
import { PurchaseReassurance } from "@/components/product/PurchaseReassurance";
import { SampleSetCallout } from "@/components/product/SampleSetCallout";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { commercialOffers } from "@/content/commercial";
import {
  buildSecureCheckoutHref,
  canCheckoutScent,
  paymentsEnabled,
} from "@/lib/payments";

type ScentDetailPageProps = {
  scent: Scent;
};

export function ScentDetailPage({ scent }: ScentDetailPageProps) {
  const sampleSetHref = `/preorder?checkout=${commercialOffers.discoverySet.slug}#secure-checkout`;
  const heroNote = [
    scent.profile.audienceLabel,
    scent.line,
    scent.size,
    scent.travelPrice
      ? `50 ml ${scent.price} / 8 ml ${scent.travelPrice}`
      : (scent.price ?? scent.launch),
  ].join(" / ");
  const primaryCta =
    scent.action?.primary ??
    (paymentsEnabled && canCheckoutScent(scent)
      ? {
          label: "Shop 50mL Bottle",
          href: buildSecureCheckoutHref(scent.slug),
          variant: "primary" as const,
        }
      : {
          label:
            scent.status === "available"
              ? "Reserve 50mL Bottle"
              : "Join the Waitlist",
          href: "/preorder",
          variant: "primary" as const,
        });
  const secondaryCta = scent.action?.secondary ?? {
    label: "Try In RM99 Set",
    href: sampleSetHref,
    variant: "secondary" as const,
  };

  return (
    <div data-scent-theme={scent.theme}>
      <PageHero
        eyebrow={scent.launch}
        title={scent.name}
        introduction={
          scent.primaryHook ? (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.24em]">
                {scent.tagline}
              </p>
              <p className="mt-3 text-2xl">{scent.primaryHook}</p>
            </div>
          ) : undefined
        }
        body={scent.summary}
        note={heroNote}
        visual={scent.interactiveGallery ? undefined : scent.visual}
        visualContent={
          scent.interactiveGallery && scent.gallery ? (
            <ScentGallery scent={scent} />
          ) : undefined
        }
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />

      <section className="py-16 sm:py-24">
        <Container
          className={
            scent.interactiveGallery
              ? "max-w-[1000px]"
              : "grid gap-10 xl:grid-cols-[0.46fr_0.54fr] xl:items-start"
          }
        >
          {!scent.interactiveGallery ? <ScentGallery scent={scent} /> : null}
          <div>
            <div className="border-y scent-border border-black/10 py-8">
              <p className="text-xs uppercase tracking-[0.3em] scent-label text-[var(--color-gold)]">
                Scent Story
              </p>
              <p className="mt-7 max-w-4xl text-[clamp(2.25rem,3.6vw,3.85rem)] font-medium leading-[0.96] tracking-[-0.045em] text-balance">
                {scent.story}
              </p>
              {scent.storyLead ? (
                <p className="mt-7 max-w-2xl text-base leading-8 scent-copy text-[var(--color-copy)] sm:text-lg">
                  {scent.storyLead}
                </p>
              ) : null}
            </div>

            {scent.storySignature ? (
              <p className="mt-6 text-lg">{scent.storySignature}</p>
            ) : null}
            {scent.description ? (
              <div className="scent-description mt-10 rounded-3xl p-6 sm:p-10">
                <h2 className="text-3xl">{scent.primaryHook}</h2>
                <p className="mt-5 text-base leading-8">{scent.description}</p>
              </div>
            ) : null}
            <ProductProfile scent={scent} />
            <div className="mt-6 grid gap-4">
              <PriceBlock
                scent={scent}
                size={scent.travelPrice ? "50 ml Eau de Parfum" : scent.size}
              />
              {scent.travelPrice ? (
                <div className="flex flex-wrap items-center justify-between gap-4 border-b scent-border border-black/10 py-5">
                  <p className="text-sm">
                    8 ml Eau de Parfum / {scent.travelPrice}
                  </p>
                  <Button href="/contact" variant="secondary">
                    Enquire About 8 ml
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </Container>

        {scent.editorial ? (
          <Container className="mt-16 sm:mt-24">
            <section
              aria-label={`${scent.name} fragrance story`}
              className="scent-editorial relative overflow-hidden rounded-[1.35rem]"
            >
              <ScentImage
                asset={scent.editorial}
                mobileAsset={scent.editorialMobile}
                sizes="(min-width: 1200px) 1104px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 32px)"
                className="h-auto w-full object-contain"
              />
              <div
                className={`${scent.editorialMobile ? "absolute inset-x-0 top-0 md:static" : ""} p-6 sm:p-8 lg:absolute lg:inset-y-0 lg:left-0 lg:right-auto lg:flex lg:w-[43%] lg:flex-col lg:justify-center lg:p-10`}
              >
                <p className="text-xs uppercase tracking-[0.3em]">
                  {scent.name} / No. {scent.number}
                </p>
                <h2 className="scent-display mt-3 text-3xl leading-tight tracking-[-0.04em] text-[#CA9E5B] md:mt-5 md:text-4xl lg:text-5xl">
                  {scent.editorialHeading ?? scent.tagline}
                </h2>
                <p className="mt-3 max-w-xs text-sm leading-6 md:mt-5 md:text-base md:leading-7">
                  {scent.editorialBody ?? scent.summary}
                </p>
              </div>
            </section>
          </Container>
        ) : null}

        {scent.storyArc ? (
          <Container className="mt-16 sm:mt-24">
            <div className="grid gap-8 lg:grid-cols-[0.34fr_1fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] scent-label text-[var(--color-gold)]">
                  Emotional Arc
                </p>
                <p className="mt-6 max-w-xs text-sm uppercase leading-6 tracking-[0.22em] scent-copy text-black/46">
                  {scent.quote}
                </p>
              </div>
              <div>
                <h2 className="max-w-4xl text-[clamp(3rem,5.2vw,5.1rem)] font-medium leading-[0.9] tracking-[-0.06em] text-balance">
                  {scent.storyMantra ?? `${scent.name} in three movements.`}
                </h2>
                <div className="mt-10 divide-y scent-dividers divide-black/10 border-y scent-border border-black/10">
                  {scent.storyArc.map((moment, index) => (
                    <article
                      key={moment.label}
                      className="grid gap-4 py-6 sm:grid-cols-[0.18fr_0.82fr] sm:py-8"
                    >
                      <p className="text-xs uppercase tracking-[0.28em] scent-label text-[var(--color-gold)]">
                        {String(index + 1).padStart(2, "0")} / {moment.label}
                      </p>
                      <div>
                        <h3 className="text-3xl font-medium tracking-[-0.04em] scent-heading text-[var(--color-onyx-black)] sm:text-5xl">
                          {moment.title}
                        </h3>
                        <p className="mt-4 max-w-2xl text-sm leading-7 scent-copy text-[var(--color-copy)] sm:text-base sm:leading-8">
                          {moment.body}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        ) : null}

        <Container className="mt-16 sm:mt-24">
          <div className="grid gap-8 lg:grid-cols-[0.34fr_1fr]">
            <p className="text-xs uppercase tracking-[0.3em] scent-label text-[var(--color-gold)]">
              Wear Notes
            </p>
            <div className="divide-y scent-dividers divide-black/10 border-y scent-border border-black/10">
              {[
                ["Tagline", scent.tagline],
                ["Finish", scent.finish],
                ["Character", scent.character],
                [
                  "House Line",
                  `${scent.profile.audienceLabel} / ${scent.line}`,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-3 py-5 sm:grid-cols-[0.22fr_0.78fr]"
                >
                  <p className="text-xs uppercase tracking-[0.24em] scent-label text-[var(--color-gold)]">
                    {label}
                  </p>
                  <p className="text-base leading-8 scent-copy text-[var(--color-copy)]">
                    {value}
                  </p>
                </div>
              ))}
              <div className="grid gap-3 py-6 sm:grid-cols-[0.22fr_0.78fr]">
                <p className="text-xs uppercase tracking-[0.24em] scent-label text-[var(--color-gold)]">
                  {scent.action?.label ?? "Order"}
                </p>
                <div>
                  {scent.action ? (
                    <p className="mb-5 max-w-2xl text-base leading-8 scent-copy text-[var(--color-copy)]">
                      {scent.action.body}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-3">
                    <Button href="/scents#scent-catalog" variant="secondary">
                      Compare Scents
                    </Button>
                    <Button href={sampleSetHref} variant="secondary">
                      Try In RM99 Set
                    </Button>
                    {scent.action?.secondary ? (
                      <Button
                        href={scent.action.secondary.href}
                        variant={scent.action.secondary.variant}
                      >
                        {scent.action.secondary.label}
                      </Button>
                    ) : null}
                    {scent.action ? (
                      <Button
                        href={scent.action.primary.href}
                        variant={scent.action.primary.variant}
                      >
                        {scent.action.primary.label}
                      </Button>
                    ) : paymentsEnabled && canCheckoutScent(scent) ? (
                      <Button
                        href={buildSecureCheckoutHref(scent.slug)}
                        variant="primary"
                      >
                        Shop 50mL Bottle
                      </Button>
                    ) : (
                      <Button href="/preorder" variant="primary">
                        {scent.status === "available"
                          ? "Reserve Launch Bottle"
                          : "Join Upcoming Waitlist"}
                      </Button>
                    )}
                  </div>
                  <PurchaseReassurance compact className="mt-5" />
                </div>
              </div>
            </div>
            <div
              className={
                scent.interactiveGallery
                  ? "mt-6 grid gap-4 lg:col-span-2 lg:grid-cols-2"
                  : "mt-6 grid gap-4 lg:grid-cols-2"
              }
            >
              <SampleSetCallout trackingLocation="scent_detail" />
              <ConciergeCallout
                scentName={scent.name}
                trackingLocation="scent_detail"
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
