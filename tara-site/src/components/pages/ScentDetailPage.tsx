import Image from "next/image";

import type { Scent } from "@/types/content";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  buildSecureCheckoutHref,
  canCheckoutScent,
  paymentsEnabled,
} from "@/lib/payments";
import { cn } from "@/lib/utils";

type ScentDetailPageProps = {
  scent: Scent;
};

export function ScentDetailPage({ scent }: ScentDetailPageProps) {
  const heroNote = [
    scent.audience,
    scent.line,
    scent.size,
    scent.price ?? scent.launch,
  ].join(" / ");
  const primaryCta =
    scent.action?.primary ??
    (paymentsEnabled && canCheckoutScent(scent)
      ? {
          label: "Pay Securely",
          href: buildSecureCheckoutHref(scent.slug),
          variant: "primary" as const,
        }
      : {
          label:
            scent.status === "available" ? "Preorder This Scent" : "Join the Waitlist",
          href: "/preorder",
          variant: "primary" as const,
        });
  const secondaryCta =
    scent.action?.secondary ?? {
      label: "Explore All Scents",
      href: "/scents",
      variant: "secondary" as const,
    };

  return (
    <>
      <PageHero
        eyebrow={scent.launch}
        title={scent.name}
        body={scent.summary}
        note={heroNote}
        visual={scent.visual}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 xl:grid-cols-[0.46fr_0.54fr] xl:items-start">
          <div className="xl:sticky xl:top-28">
            <div className="relative aspect-square overflow-hidden rounded-[1.35rem] border border-black/10 sm:rounded-[1.8rem]">
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
            {scent.gallery?.length ? (
              <div className="mt-5" aria-label={`${scent.name} image carousel`}>
                <div className="flex snap-x gap-3 overflow-x-auto pb-3">
                  {scent.gallery.map((item) => (
                    <figure
                      key={item.src}
                      className="w-[10.25rem] shrink-0 snap-start sm:w-[11.5rem]"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-2xl border border-black/10 bg-white/40">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 640px) 42vw, 184px"
                          className={cn(
                            item.fit === "contain" ? "object-contain" : "object-cover",
                          )}
                          style={
                            item.position
                              ? { objectPosition: item.position }
                              : undefined
                          }
                          loading="lazy"
                        />
                      </div>
                      <figcaption className="mt-3">
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                          {item.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-black/55">
                          {item.caption}
                        </p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <div className="border-y border-black/10 py-8">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
                Scent Story
              </p>
              <p className="mt-7 max-w-4xl text-[clamp(2.25rem,3.6vw,3.85rem)] font-medium leading-[0.96] tracking-[-0.045em] text-balance">
                {scent.story}
              </p>
              {scent.storyLead ? (
                <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
                  {scent.storyLead}
                </p>
              ) : null}
            </div>

            <div className="grid border-b border-black/10 sm:grid-cols-3">
              {[
                ["Top", scent.notes.top.join(", ")],
                ["Heart", scent.notes.heart.join(", ")],
                ["Base", scent.notes.base.join(", ")],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-t border-black/10 py-5 sm:border-l sm:border-t-0 sm:px-5 sm:first:border-l-0"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                    {label}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-black/60">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {scent.storyArc ? (
          <Container className="mt-16 sm:mt-24">
            <div className="grid gap-8 lg:grid-cols-[0.34fr_1fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
                  Emotional Arc
                </p>
                <p className="mt-6 max-w-xs text-sm uppercase leading-6 tracking-[0.22em] text-black/46">
                  {scent.quote}
                </p>
              </div>
              <div>
                <h2 className="max-w-4xl text-[clamp(3rem,5.2vw,5.1rem)] font-medium leading-[0.9] tracking-[-0.06em] text-balance">
                  {scent.storyMantra ?? `${scent.name} in three movements.`}
                </h2>
                <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
                  {scent.storyArc.map((moment, index) => (
                    <article
                      key={moment.label}
                      className="grid gap-4 py-6 sm:grid-cols-[0.18fr_0.82fr] sm:py-8"
                    >
                      <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
                        {String(index + 1).padStart(2, "0")} / {moment.label}
                      </p>
                      <div>
                        <h3 className="text-3xl font-medium tracking-[-0.04em] text-[var(--color-onyx-black)] sm:text-5xl">
                          {moment.title}
                        </h3>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-copy)] sm:text-base sm:leading-8">
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
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
              Wear Notes
            </p>
            <div className="divide-y divide-black/10 border-y border-black/10">
              {[
                ["Tagline", scent.tagline],
                ["Finish", scent.finish],
                ["Character", scent.character],
                ["Mood", scent.mood.join(" / ")],
                ["Best With", scent.wear.join(" / ")],
                ["House Line", `${scent.audience} / ${scent.line}`],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-3 py-5 sm:grid-cols-[0.22fr_0.78fr]">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                    {label}
                  </p>
                  <p className="text-base leading-8 text-[var(--color-copy)]">{value}</p>
                </div>
              ))}
              <div className="grid gap-3 py-6 sm:grid-cols-[0.22fr_0.78fr]">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  {scent.action?.label ?? "Order"}
                </p>
                <div>
                  {scent.action ? (
                    <p className="mb-5 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
                      {scent.action.body}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-3">
                    {scent.action?.secondary ? (
                      <Button
                        href={scent.action.secondary.href}
                        variant={scent.action.secondary.variant}
                      >
                        {scent.action.secondary.label}
                      </Button>
                    ) : (
                      <Button href="/scents" variant="secondary">
                        Explore All Scents
                      </Button>
                    )}
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
                        Add To Cart
                      </Button>
                    ) : (
                      <Button href="/preorder" variant="primary">
                        {scent.status === "available"
                          ? "Reserve Launch Bottle"
                          : "Join Upcoming Waitlist"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
