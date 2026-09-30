import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPage } from "@/components/pages/PolicyPage";
import { getPolicyPage } from "@/content/legal";
import { buildPageMetadata } from "@/lib/seo";

const page = getPolicyPage("privacy");

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How TARA collects, uses, protects, and manages customer information for orders, checkout, forms, analytics, and concierge support.",
  path: "/privacy",
  socialImage: {
    path: "/og/tara-home.jpg",
    alt: "TARA fragrance bottles with editorial styling for privacy and trust information.",
  },
});

export default function PrivacyPage() {
  if (!page) {
    notFound();
  }

  return <PolicyPage page={page} />;
}
