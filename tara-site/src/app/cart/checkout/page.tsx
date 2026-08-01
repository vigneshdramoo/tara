import type { Metadata } from "next";

import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Checkout",
  description:
    "Complete your TARA order with personal details, shipment address, preferred payment method, and secure ToyyibPay checkout.",
  path: "/cart/checkout",
  socialTitle: "TARA Secure Checkout",
  socialImage: {
    path: "/editorial/tara-ashoka-ardor-launch-optimized.webp",
    alt: "TARA fragrance bottles styled for secure checkout.",
  },
  robots: {
    index: false,
    follow: false,
  },
});

export default function CartCheckoutPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="grid gap-8 border-b border-black/10 pb-10 lg:grid-cols-[0.36fr_1fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-gold)]">
              Cart / Checkout
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-black/40">
              Cart &gt; Details &gt; Payment
            </p>
          </div>
          <div>
            <h1 className="max-w-5xl text-[clamp(3.6rem,10vw,8.6rem)] font-medium leading-[0.82] tracking-[-0.075em] text-[var(--color-onyx-black)] text-balance">
              Complete your order securely.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
              Fill in your personal and shipment details, choose your payment
              method, then continue to ToyyibPay secure checkout.
            </p>
          </div>
        </div>
        <div className="mt-10 sm:mt-14">
          <CheckoutForm />
        </div>
      </Container>
    </section>
  );
}
