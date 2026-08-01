import Image from "next/image";

import type { CalloutContent } from "@/types/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { eightMlPromoSet } from "@/content/products";

type EightMlPromoOfferProps = {
  content: CalloutContent;
};

export function EightMlPromoOffer({ content }: EightMlPromoOfferProps) {
  return (
    <section className="border-b border-black/10 bg-[linear-gradient(135deg,rgba(10,10,10,1)_0%,rgba(26,51,74,0.96)_56%,rgba(75,48,106,0.84)_100%)] py-16 text-[var(--color-ivory)] sm:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-gold)]">
              {eightMlPromoSet.name} / {eightMlPromoSet.price}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["FPX", "DuitNow", "Credit Card", "ToyyibPay Secure"].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-white/8 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-white/68"
                >
                  <SiteIcon
                    name={badge === "ToyyibPay Secure" ? "lock" : "wallet"}
                    className="h-3.5 w-3.5 text-[var(--color-gold)]"
                  />
                  {badge}
                </span>
              ))}
            </div>
            <h2 className="mt-7 max-w-4xl text-[clamp(3.4rem,8vw,7.5rem)] font-medium leading-[0.84] tracking-[-0.07em] text-balance">
              {content.title}
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              {content.body}
            </p>
            {content.note ? (
              <p className="mt-6 border-y border-white/14 py-4 text-xs uppercase tracking-[0.26em] text-white/54">
                {content.note}
              </p>
            ) : null}
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Button
                href={content.primary.href}
                variant={content.primary.variant}
                trackingLocation="homepage_8ml_promo"
              >
                {content.primary.label}
              </Button>
              {content.secondary ? (
                <Button
                  href={content.secondary.href}
                  variant={content.secondary.variant}
                  className="border-white/20 text-white hover:border-[rgba(202,158,91,0.55)] hover:bg-white/10"
                  trackingLocation="homepage_8ml_promo"
                >
                  {content.secondary.label}
                </Button>
              ) : null}
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[1.35rem] border border-white/14 sm:min-h-[520px] sm:rounded-[1.8rem]">
            <Image
              src={eightMlPromoSet.visual.src}
              alt={eightMlPromoSet.visual.alt}
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0)_36%,rgba(10,10,10,0.5)_100%),linear-gradient(180deg,rgba(10,10,10,0.05),rgba(10,10,10,0.34))]" />
          </div>
        </div>
      </Container>
    </section>
  );
}
