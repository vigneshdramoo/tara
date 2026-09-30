import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPage } from "@/components/pages/PolicyPage";
import { getPolicyPage } from "@/content/legal";
import { buildPageMetadata } from "@/lib/seo";

const page = getPolicyPage("shipping-policy");

export const metadata: Metadata = buildPageMetadata({
  title: "Shipping And Delivery Policy",
  description:
    "Delivery coverage, processing times, preorder dispatch expectations, address rules, courier delays, and customer responsibilities for TARA orders.",
  path: "/shipping-policy",
  socialImage: {
    path: "/og/tara-home.jpg",
    alt: "TARA fragrance bottles with editorial styling for shipping and delivery information.",
  },
});

export default function ShippingPolicyPage() {
  if (!page) {
    notFound();
  }

  return <PolicyPage page={page} />;
}
