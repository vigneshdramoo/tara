import Image from "next/image";

import type { HeroContent } from "@/types/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";

type HeroProps = {
  content: HeroContent;
};

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-black/10">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#fbf8f1_0%,#f7f3eb_100%)]" />
      <div className="absolute inset-x-0 bottom-0 top-[20%] -z-10 sm:top-[18%]">
        <Image
          src={content.visual.src}
          alt={content.visual.alt}
          fill
          preload={content.visual.priority}
          loading={content.visual.priority ? "eager" : "lazy"}
          sizes="100vw"
          className="object-cover object-center opacity-[0.34] saturate-[0.92]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_54%,rgba(247,243,235,0.06)_0%,rgba(247,243,235,0.46)_42%,rgba(247,243,235,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.82)_0%,rgba(247,243,235,0.18)_42%,rgba(247,243,235,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,243,235,0.94)_0%,rgba(247,243,235,0.56)_44%,rgba(247,243,235,0.28)_76%,rgba(247,243,235,0.72)_100%)]" />
      </div>
      <Container className="py-8 sm:py-9 lg:py-10">
        <div className="grid gap-8 lg:min-h-[calc(100svh-13rem)] lg:content-between lg:gap-8">
          <div className="relative z-10 max-w-5xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-gold)] sm:text-xs sm:tracking-[0.42em]">
              {content.eyebrow}
            </p>
            <h1 className="mt-5 max-w-5xl text-[clamp(3.05rem,12vw,5rem)] font-medium leading-[0.9] tracking-[-0.055em] text-[var(--color-onyx-black)] text-balance sm:mt-6 sm:text-[clamp(3.8rem,8.8vw,6.85rem)] sm:leading-[0.86] sm:tracking-[-0.07em]">
              {content.title}
            </h1>
          </div>

          <div className="relative z-10 grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="max-w-lg text-base leading-7 text-[var(--color-copy)] sm:text-lg sm:leading-7">
                {content.body}
              </p>
              <p className="mt-4 max-w-lg text-[10px] uppercase leading-5 tracking-[0.2em] text-black/56 sm:text-[11px] sm:tracking-[0.26em]">
                {content.note}
              </p>
              <div className="mt-5 grid max-w-sm gap-3 sm:flex sm:max-w-none sm:flex-wrap">
                {content.ctas.map((cta) => (
                  <Button
                    key={cta.href}
                    href={cta.href}
                    variant={cta.variant}
                    size="sm"
                    trackingLocation="homepage_hero"
                  >
                    {cta.label}
                  </Button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["FPX", "DuitNow", "Credit Card", "ToyyibPay Secure"].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[rgba(255,250,241,0.7)] px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-black/58 backdrop-blur-sm"
                  >
                    <SiteIcon
                      name={badge === "ToyyibPay Secure" ? "lock" : "wallet"}
                      className="h-3.5 w-3.5 text-[var(--color-gold)]"
                    />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {content.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="min-h-28 border border-black/12 bg-[rgba(247,243,235,0.76)] p-4 shadow-[0_18px_60px_rgba(26,51,74,0.08)] backdrop-blur-[3px] sm:p-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-gold)]">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-medium tracking-[-0.05em] text-[var(--color-onyx-black)] sm:text-[2.15rem]">
                    {metric.value}
                  </p>
                  <p className="mt-1.5 max-w-xs text-xs leading-5 text-black/56">
                    {metric.description}
                  </p>
                  {metric.badges?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {metric.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full border border-black/10 bg-[rgba(255,250,241,0.7)] px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-black/54"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
