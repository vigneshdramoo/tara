import type { HeroContent } from "@/types/content";
import { ScentImage } from "@/components/product/ScentImage";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { analyticsEvents } from "@/lib/analytics";
import { getLatestLaunches } from "@/lib/catalog";

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="border-b border-black/10 py-8 sm:py-12 lg:py-16">
      <Container className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-copy)]">
            {content.eyebrow}
          </p>
          <h1 className="mt-5 text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[1.02] tracking-[-0.06em]">
            THEON <span className="font-editorial italic">+</span>
            <br className="hidden lg:block" /> KAMEIRA
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-[var(--color-copy)]">
            {content.body}
          </p>
          <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
            {content.ctas.map((cta, index) => (
              <Button
                key={cta.href}
                href={cta.href}
                variant={cta.variant}
                trackingLocation="homepage_hero"
                trackingEventName={
                  index === 0
                    ? analyticsEvents.heroPrimaryCtaClick
                    : analyticsEvents.discoverySetClick
                }
                trackingParams={{
                  hero_cta_position: index + 1,
                  offer_type: index === 0 ? "standard" : "discovery_set",
                }}
              >
                {cta.label}
              </Button>
            ))}
          </div>
        </div>
        <div
          id="latest-launches"
          className="grid scroll-mt-28 grid-cols-2 gap-3 sm:gap-5"
        >
          {getLatestLaunches().map((scent) => (
            <article key={scent.slug} className="min-w-0">
              <div className="aspect-[3/4] overflow-hidden rounded-t-[6rem] bg-[#e9e1d4]">
                <ScentImage
                  asset={scent.visual}
                  priority
                  sizes="(min-width: 1024px) 26vw, 46vw"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-[#775426]">
                Latest launch
              </p>
              <h2 className="mt-1 text-xl font-medium sm:text-2xl">
                {scent.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-copy)]">
                {scent.slug === "theon" ? scent.profile.family : scent.line}
              </p>
              <Button
                href={`/scents/${scent.slug}`}
                variant="ghost"
                size="sm"
                className="mt-2 !w-auto !px-0 !text-[#775426]"
                trackingLocation="homepage_launch_product"
                trackingParams={{ selected_scent: scent.slug }}
              >
                Explore {scent.name} →
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
