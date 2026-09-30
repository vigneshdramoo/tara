import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPage } from "@/components/pages/PolicyPage";
import { getPolicyPage } from "@/content/legal";
import { buildPageMetadata } from "@/lib/seo";

const page = getPolicyPage("terms");

export const metadata: Metadata = buildPageMetadata({
  title: "Terms Of Service",
  description:
    "The terms that govern use of the TARA website, preorder flow, checkout, product information, and concierge communication.",
  path: "/terms",
  socialImage: {
    path: "/og/tara-home.jpg",
    alt: "TARA fragrance bottles with editorial styling for terms and trust information.",
  },
});

export default function TermsPage() {
  if (!page) {
    notFound();
  }

  return <PolicyPage page={page} />;
}
