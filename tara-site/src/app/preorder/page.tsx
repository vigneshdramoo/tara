import type { Metadata } from "next";

import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { PreorderForm } from "@/components/forms/PreorderForm";
import { PaymentCheckoutForm } from "@/components/payments/PaymentCheckoutForm";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { brand } from "@/content/brand";
import { checkoutExperience } from "@/content/commercial";
import { buildPageMetadata } from "@/lib/seo";

const preorderHeroVisual = {
  src: "/editorial/tara-preorder-hero-banner-optimized.webp",
  alt: "TARA fragrance bottles on a wide sunlit counter, ready for preorder.",
  priority: true,
};

export const metadata: Metadata = buildPageMetadata({
  title: "Order TARA",
  description:
    "Order Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, THEON, or the 3 x 8mL RM99 discovery set with cart-first checkout and ToyyibPay payment.",
  path: "/preorder",
  socialTitle: "Order TARA - Cart-First Checkout",
  socialImage: {
    path: preorderHeroVisual.src,
    alt: preorderHeroVisual.alt,
  },
});

export default function PreorderPage() {
  return (
    <>
      <PageHero
        eyebrow={brand.preorderPage.eyebrow}
        title={brand.preorderPage.title}
        body={brand.preorderPage.body}
        note={brand.preorderPage.note}
        visual={preorderHeroVisual}
        variant="banner"
        primaryCta={{ label: "Choose Product", href: "#secure-checkout", variant: "primary" }}
        secondaryCta={{
          label: "Concierge Help",
          href: "#concierge-order",
          variant: "ghost",
        }}
      />
      <section className="py-14 sm:py-20">
        <Container>
          <PaymentCheckoutForm />
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container className="grid gap-10 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-10">
            <div className="border-y border-black/10 py-7">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
                Why order this way
              </p>
              <div className="mt-6 divide-y divide-black/10">
                {brand.preorderPage.perks.map((perk) => (
                  <div
                    key={perk}
                    className="py-4 text-sm leading-7 text-black/60"
                  >
                    {perk}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-b border-black/10 pb-7">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
                Normal purchase sequence
              </p>
              <div className="mt-6 divide-y divide-black/10 border-t border-black/10">
                {checkoutExperience.sequence.map((step, index) => (
                  <div
                    key={step}
                    className="grid gap-3 py-5 sm:grid-cols-[0.22fr_0.78fr]"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
                      Step {index + 1}
                    </p>
                    <p className="text-base leading-8 text-[var(--color-copy)]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-b border-black/10 pb-7">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
                Contact options
              </p>
              <div className="mt-6 divide-y divide-black/10 border-t border-black/10">
                {brand.preorderPage.contactOptions.map((option) => (
                  <div
                    key={option.label}
                    className="py-5"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(202,158,91,0.28)] text-[var(--color-gold)]">
                        <SiteIcon name={option.icon ?? "shield"} className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-black/42">
                          {option.label}
                        </p>
                        {option.href ? (
                          <TrackedAnchor
                            href={option.href}
                            trackingLabel={option.label}
                            trackingLocation="preorder_contact_options"
                            className="mt-3 block text-base leading-8 text-[var(--color-copy)] transition duration-300 hover:text-[var(--color-onyx-black)]"
                          >
                            {option.value}
                          </TrackedAnchor>
                        ) : (
                          <p className="mt-3 text-base leading-8 text-[var(--color-copy)]">
                            {option.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <PreorderForm />
          </div>
        </Container>
      </section>
    </>
  );
}
