import {
  checkoutProducts,
  getCheckoutProductBySlug,
  type CheckoutProduct,
} from "@/content/products";
import type { Scent } from "@/types/content";

export const paymentProvider =
  process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ?? "toyyibpay";

export const paymentsEnabled =
  process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";

export const duitNowQrEnabled =
  process.env.NEXT_PUBLIC_DUITNOW_QR_ENABLED === "true";

export const malaysiaPaymentMethods = [
  "FPX",
  "Credit Card",
  ...(duitNowQrEnabled ? ["DuitNow QR"] : []),
] as const;

export type PaymentResultStatus = "success" | "pending" | "failed" | "unknown";

export function canCheckoutScent(scent: Scent) {
  return scent.status === "available" && typeof scent.priceInSen === "number";
}

export function getCheckoutProducts() {
  return checkoutProducts.filter(
    (product): product is CheckoutProduct =>
      typeof product.priceInSen === "number" && product.priceInSen > 0,
  );
}

export function getCheckoutScents() {
  return getCheckoutProducts();
}

export function getCheckoutScent(slug?: string | null) {
  if (!slug) {
    return getCheckoutProducts()[0];
  }

  return getCheckoutProductBySlug(slug);
}

export function formatRinggitFromSen(amountInSen: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 2,
  }).format(amountInSen / 100);
}

export function buildSecureCheckoutHref(scentSlug?: string) {
  if (!scentSlug) {
    return "/preorder#secure-checkout";
  }

  return `/preorder?checkout=${encodeURIComponent(scentSlug)}#secure-checkout`;
}

export function mapToyyibStatus(statusId?: string | null): PaymentResultStatus {
  if (statusId === "1") {
    return "success";
  }

  if (statusId === "2" || statusId === "4") {
    return "pending";
  }

  if (statusId === "3") {
    return "failed";
  }

  return "unknown";
}
