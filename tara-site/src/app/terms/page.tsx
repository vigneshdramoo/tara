import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPage } from "@/components/pages/PolicyPage";
import { getPolicyPage } from "@/content/legal";

const page = getPolicyPage("terms");

export const metadata: Metadata = {
  title: "Terms Of Service",
  description:
    "The terms that govern use of the TARA website, preorder flow, checkout, product information, and concierge communication.",
};

export default function TermsPage() {
  if (!page) {
    notFound();
  }

  return <PolicyPage page={page} />;
}
