import { scents } from "@/content/scents";
import type { VisualAsset } from "@/types/content";

export type CheckoutProduct = {
  slug: string;
  name: string;
  type: "fragrance" | "promo-set";
  audience: string;
  summary: string;
  price: string;
  priceInSen: number;
  visual: VisualAsset;
};

export const eightMlPromoSet: CheckoutProduct = {
  slug: "three-8ml-promo",
  name: "3 x 8mL Promo Set",
  type: "promo-set",
  audience: "Launch promo",
  summary:
    "Choose any three TARA 8mL Eau de Parfum scents for RM99. Add your preferred scent mix in checkout notes and the house will confirm availability before dispatch.",
  price: "RM99",
  priceInSen: 9900,
  visual: {
    src: "/editorial/tara-popup-8ml-rm99-optimized.webp",
    alt: "TARA 8mL launch special showing any 3 x 8mL Eau de Parfum scents for RM99.",
  },
};

export const checkoutProducts: CheckoutProduct[] = [
  eightMlPromoSet,
  ...scents
    .filter((scent) => scent.status === "available")
    .map((scent) => ({
      slug: scent.slug,
      name: scent.name,
      type: "fragrance" as const,
      audience: scent.audience,
      summary: scent.summary,
      price: scent.launchPrice ?? scent.price ?? "RM169",
      priceInSen: scent.priceInSen ?? 16900,
      visual: scent.visual,
    })),
];

export function getCheckoutProductBySlug(slug?: string | null) {
  if (!slug) {
    return checkoutProducts[0];
  }

  return checkoutProducts.find((product) => product.slug === slug) ?? checkoutProducts[0];
}
