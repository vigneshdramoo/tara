import type { CalloutContent } from "@/types/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type ConversionCtaProps = {
  content: CalloutContent;
  trustLine: string;
};

export function ConversionCta({ content, trustLine }: ConversionCtaProps) {
  return (
    <section className="bg-[var(--color-gold)] py-16 text-[var(--color-onyx-black)] sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.36fr_1fr] lg:items-end">
          <p className="text-xs uppercase tracking-[0.34em] text-black/70">
            Order
          </p>
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-black/62">
              First 100 Bottles / RM169
            </p>
            <h2 className="mt-6 max-w-5xl text-[clamp(4rem,11vw,10rem)] font-medium leading-[0.82] tracking-[-0.075em] text-balance">
              {content.title}
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-black/78 sm:text-lg">
              {content.body}
            </p>
            <div className="mt-8 grid max-w-md gap-3 sm:flex sm:max-w-none sm:flex-wrap">
              <Button
                href={content.primary.href}
                variant={content.primary.variant}
                trackingLocation="homepage_reserve_cta"
                className="border-black bg-black !text-[var(--color-ivory)] hover:border-[var(--color-onyx-black)] hover:bg-[var(--color-onyx-black)]"
              >
                {content.primary.label}
              </Button>
              {content.secondary ? (
                <Button
                  href={content.secondary.href}
                  variant={content.secondary.variant}
                  trackingLocation="homepage_reserve_cta"
                  className="border-black/36 text-black hover:border-black hover:bg-black/8"
                >
                  {content.secondary.label}
                </Button>
              ) : null}
            </div>
            <p className="mt-7 border-t border-black/20 pt-5 text-[11px] uppercase leading-6 tracking-[0.22em] text-black/58 sm:text-xs">
              {trustLine}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
