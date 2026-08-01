import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPage } from "@/components/pages/PolicyPage";
import { getPolicyPage } from "@/content/legal";

const page = getPolicyPage("privacy");

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How TARA collects, uses, protects, and manages customer information for orders, checkout, forms, analytics, and concierge support.",
};

export default function PrivacyPage() {
  if (!page) {
    notFound();
  }

  return <PolicyPage page={page} />;
}
