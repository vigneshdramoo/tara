import { scents } from "@/content/scents";
import { commercialOffers } from "@/content/commercial";
import type { VisualAsset } from "@/types/content";

export type CheckoutProduct = {
  slug: string;
  name: string;
  type: "fragrance" | "promo-set";
  audience: string;
  summary: string;
  price: string;
  priceInSen: number;
  availability: "in-stock" | "preorder" | "dispatch-unconfirmed";
  availabilityLabel: string;
  availabilityDetail: string;
  visual: VisualAsset;
};

export const eightMlPromoSet: CheckoutProduct = {
  slug: commercialOffers.discoverySet.slug,
  name: commercialOffers.discoverySet.name,
  type: commercialOffers.discoverySet.type,
  audience: commercialOffers.discoverySet.audience,
  summary: commercialOffers.discoverySet.summary,
  price: commercialOffers.discoverySet.price,
  priceInSen: commercialOffers.discoverySet.priceInSen,
  availability: "dispatch-unconfirmed",
  availabilityLabel: "Dispatch timing to be confirmed",
  availabilityDetail:
    "TARA will confirm dispatch timing for this discovery set after your order is received.",
  visual: commercialOffers.discoverySet.visual,
};

export const checkoutProducts: CheckoutProduct[] = [
  eightMlPromoSet,
  ...scents
    .filter((scent) => scent.status === "available")
    .map((scent) => ({
      slug: scent.slug,
      name: scent.name,
      type: "fragrance" as const,
      audience: scent.profile.audienceLabel,
      summary: scent.summary,
      price: scent.launchPrice ?? scent.price ?? "RM169",
      priceInSen: scent.priceInSen ?? 16900,
      availability: "in-stock" as const,
      availabilityLabel: "In stock",
      availabilityDetail:
        "Usually prepared within 1 to 3 working days after payment confirmation.",
      visual: scent.visual,
    })),
];

export function getCheckoutProductBySlug(slug?: string | null) {
  if (!slug) {
    return checkoutProducts[0];
  }

  return checkoutProducts.find((product) => product.slug === slug) ?? checkoutProducts[0];
}
