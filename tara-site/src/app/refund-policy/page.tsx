import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPage } from "@/components/pages/PolicyPage";
import { getPolicyPage } from "@/content/legal";
import { buildPageMetadata } from "@/lib/seo";

const page = getPolicyPage("refund-policy");

export const metadata: Metadata = buildPageMetadata({
  title: "Refund And Return Policy",
  description:
    "How TARA handles cancellations, damaged parcels, incorrect items, defective products, hygiene-based fragrance returns, and approved refunds.",
  path: "/refund-policy",
  socialImage: {
    path: "/og/tara-home.jpg",
    alt: "TARA fragrance bottles with editorial styling for refund and return information.",
  },
});

export default function RefundPolicyPage() {
  if (!page) {
    notFound();
  }

  return <PolicyPage page={page} />;
}
