import type { Metadata } from "next";

import { CartView } from "@/components/cart/CartView";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cart",
  description:
    "Review your TARA cart before secure checkout for Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, THEON, or the 3 x 8mL RM99 promo set.",
  path: "/cart",
  socialTitle: "TARA Cart",
  socialImage: {
    path: "/editorial/tara-ashoka-ardor-launch-optimized.webp",
    alt: "TARA fragrance bottles styled for cart and checkout.",
  },
  robots: {
    index: false,
    follow: false,
  },
});

export default function CartPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="grid gap-8 border-b border-black/10 pb-10 lg:grid-cols-[0.36fr_1fr] lg:items-end">
          <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-gold)]">
            Cart
          </p>
          <div>
            <h1 className="max-w-5xl text-[clamp(3.6rem,10vw,8.6rem)] font-medium leading-[0.82] tracking-[-0.075em] text-[var(--color-onyx-black)] text-balance">
              Review what stays with you.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
              Edit your TARA selection, then continue to secure checkout to add
              delivery details and complete payment.
            </p>
          </div>
        </div>
        <div className="mt-10 sm:mt-14">
          <CartView />
        </div>
      </Container>
    </section>
  );
}
