import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPage } from "@/components/pages/PolicyPage";
import { getPolicyPage } from "@/content/legal";

const page = getPolicyPage("refund-policy");

export const metadata: Metadata = {
  title: "Refund And Return Policy",
  description:
    "How TARA handles cancellations, damaged parcels, incorrect items, defective products, hygiene-based fragrance returns, and approved refunds.",
};

export default function RefundPolicyPage() {
  if (!page) {
    notFound();
  }

  return <PolicyPage page={page} />;
}
