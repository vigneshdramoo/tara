import Image from "next/image";
import type { ReactNode } from "react";

import type { Cta, VisualAsset } from "@/types/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  body: string;
  introduction?: ReactNode;
  note?: string;
  visual?: VisualAsset;
  visualContent?: ReactNode;
  variant?: "split" | "banner";
  primaryCta?: Cta;
  secondaryCta?: Cta;
  compact?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  body,
  introduction,
  note,
  visual,
  visualContent,
  variant = "split",
  primaryCta,
  secondaryCta,
  compact = false,
}: PageHeroProps) {
  if (variant === "banner" && visual) {
    return (
      <section className="relative isolate overflow-hidden border-b scent-border border-black/10">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          preload={visual.priority ?? true}
          loading={(visual.priority ?? true) ? "eager" : "lazy"}
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover opacity-[0.32]"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_35%,rgba(202,158,91,0.18),transparent_26%),linear-gradient(90deg,rgba(247,243,235,0.96)_0%,rgba(247,243,235,0.72)_42%,rgba(247,243,235,0.42)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_34%,rgba(247,243,235,0.78)_100%)]" />
        <Container>
          <div className="max-w-5xl py-16 sm:py-24 lg:py-28">
            {eyebrow ? (
              <p className="text-[11px] uppercase tracking-[0.3em] scent-label text-[var(--color-gold)] sm:text-xs sm:tracking-[0.42em]">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="scent-wordmark mt-7 max-w-5xl text-[clamp(3.1rem,13.5vw,5.2rem)] font-medium leading-[0.9] tracking-[-0.055em] scent-heading text-[var(--color-onyx-black)] text-balance sm:text-[clamp(4rem,11vw,9rem)] sm:leading-[0.84] sm:tracking-[-0.075em]">
              {title}
            </h1>
            {introduction}
            <p className="mt-7 max-w-2xl text-base leading-7 scent-copy text-[var(--color-copy)] sm:text-xl sm:leading-8">
              {body}
            </p>
            {note ? (
              <p className="mt-5 max-w-2xl border-y scent-border border-black/10 py-4 text-[11px] uppercase leading-5 tracking-[0.18em] scent-copy text-black/52 sm:text-xs sm:tracking-[0.28em]">
                {note}
              </p>
            ) : null}
            {primaryCta || secondaryCta ? (
              <div className="mt-7 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
                {primaryCta ? (
                  <Button
                    href={primaryCta.href}
                    variant={primaryCta.variant}
                    trackingLocation="page_hero"
                  >
                    {primaryCta.label}
                  </Button>
                ) : null}
                {secondaryCta ? (
                  <Button
                    href={secondaryCta.href}
                    variant={secondaryCta.variant}
                    trackingLocation="page_hero"
                  >
                    {secondaryCta.label}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="border-b scent-border border-black/10">
      <Container>
        <div
          className={cn(
            compact
              ? "grid gap-6 py-8 sm:py-10 lg:py-12"
              : "grid gap-8 py-12 sm:py-16 lg:py-20",
            Boolean(visual || visualContent) && "lg:grid-cols-[0.95fr_0.72fr]",
            visualContent ? "lg:items-center" : "lg:items-end",
          )}
        >
          <div>
            {eyebrow ? (
              <p className="text-[11px] uppercase tracking-[0.3em] scent-label text-[var(--color-gold)] sm:text-xs sm:tracking-[0.42em]">
                {eyebrow}
              </p>
            ) : null}
            <h1 className={cn("scent-wordmark max-w-5xl font-medium leading-[0.9] tracking-[-0.055em] scent-heading text-[var(--color-onyx-black)] text-balance sm:leading-[0.84] sm:tracking-[-0.075em]", compact ? "mt-4 text-[clamp(3rem,9vw,6.3rem)]" : "mt-7 text-[clamp(3.1rem,13.5vw,5.2rem)] sm:text-[clamp(4rem,11vw,9rem)]")}>
              {title}
            </h1>
            {introduction}
            <p className={cn("max-w-2xl text-base leading-7 scent-copy text-[var(--color-copy)]", compact ? "mt-4 sm:text-lg" : "mt-7 sm:text-xl sm:leading-8")}>
              {body}
            </p>
            {note ? (
              <p className="mt-5 max-w-2xl border-y scent-border border-black/10 py-4 text-[11px] uppercase leading-5 tracking-[0.18em] scent-copy text-black/52 sm:text-xs sm:tracking-[0.28em]">
                {note}
              </p>
            ) : null}
            {primaryCta || secondaryCta ? (
              <div className="mt-7 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
                {primaryCta ? (
                  <Button
                    href={primaryCta.href}
                    variant={primaryCta.variant}
                    trackingLocation="page_hero"
                  >
                    {primaryCta.label}
                  </Button>
                ) : null}
                {secondaryCta ? (
                  <Button
                    href={secondaryCta.href}
                    variant={secondaryCta.variant}
                    trackingLocation="page_hero"
                  >
                    {secondaryCta.label}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>

          {visualContent ??
            (visual ? (
              <div className="overflow-hidden rounded-[1.35rem] border scent-border border-black/10 sm:rounded-[1.8rem]">
                <div className={cn("relative overflow-hidden", compact ? "aspect-[4/3] lg:aspect-[5/3]" : "aspect-square")}>
                  <Image
                    src={visual.src}
                    alt={visual.alt}
                    fill
                    preload={visual.priority ?? true}
                    loading={(visual.priority ?? true) ? "eager" : "lazy"}
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.04),rgba(247,243,235,0.4))]" />
                </div>
              </div>
            ) : null)}
        </div>
      </Container>
    </section>
  );
}
