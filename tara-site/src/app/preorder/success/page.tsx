import type { Metadata } from "next";
import { Suspense } from "react";

import { PreorderSuccessContent } from "@/components/pages/PreorderSuccessContent";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Preorder Request Received",
  description:
    "Your TARA preorder request has been received. Follow up with the concierge for payment, allocation, and delivery confirmation.",
  path: "/preorder/success",
  socialTitle: "TARA Preorder Request Received",
  socialImage: {
    path: "/editorial/tara-preorder-hero-banner-optimized.webp",
    alt: "TARA fragrance bottles prepared for preorder confirmation.",
  },
  robots: {
    index: false,
    follow: false,
  },
});

function SuccessFallback() {
  return (
    <main className="pb-24 pt-14 sm:pt-20">
      <Container>
        <div className="border-y border-black/12 py-10 sm:py-14">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Request Received
          </p>
          <h1 className="mt-5 max-w-3xl text-[2.7rem] font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--color-onyx-black)] sm:text-7xl sm:leading-none">
            Preparing your confirmation.
          </h1>
        </div>
      </Container>
    </main>
  );
}

export default function PreorderSuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <PreorderSuccessContent />
    </Suspense>
  );
}
