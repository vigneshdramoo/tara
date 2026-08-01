import type { Metadata } from "next";
import { Suspense } from "react";

import { PaymentResultContent } from "@/components/pages/PaymentResultContent";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Payment Result",
  description:
    "View the result of your TARA hosted checkout and confirm whether your payment succeeded, is pending, or needs another attempt.",
  path: "/payment/result",
  socialTitle: "TARA Payment Result",
  socialImage: {
    path: "/editorial/tara-ashoka-ardor-launch-optimized.webp",
    alt: "TARA fragrance bottles styled for hosted payment confirmation.",
  },
  robots: {
    index: false,
    follow: false,
  },
});

function PaymentResultFallback() {
  return (
    <main className="pb-24 pt-14 sm:pt-20">
      <Container>
        <div className="border-y border-black/12 py-10 sm:py-14">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Payment Result
          </p>
          <h1 className="mt-5 max-w-3xl text-[2.7rem] font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--color-onyx-black)] sm:text-7xl sm:leading-none">
            Checking your payment.
          </h1>
        </div>
      </Container>
    </main>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PaymentResultFallback />}>
      <PaymentResultContent />
    </Suspense>
  );
}
