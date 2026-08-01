import { brand } from "@/content/brand";
import { getScentBySlug } from "@/lib/catalog";

type PreorderWhatsAppParams = {
  scentSlug?: string;
  quantity?: string | number;
};

export function getPreorderScentName(scentSlug?: string) {
  if (!scentSlug) {
    return "a TARA fragrance";
  }

  if (scentSlug === "both-live") {
    return "Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, and THEON";
  }

  if (scentSlug === "aurora") {
    return "Aureya";
  }

  if (scentSlug === "three-8ml-promo") {
    return "the TARA 3 x 8mL RM99 promo set";
  }

  if (scentSlug === "undecided") {
    return "a scent recommendation";
  }

  return getScentBySlug(scentSlug)?.name ?? "a TARA fragrance";
}

export function buildPreorderSuccessPath({
  scentSlug,
  quantity,
}: PreorderWhatsAppParams) {
  const params = new URLSearchParams();

  if (scentSlug) {
    params.set("scent", scentSlug);
  }

  if (quantity) {
    params.set("quantity", String(quantity));
  }

  const query = params.toString();

  return query ? `/preorder/success?${query}` : "/preorder/success";
}

export function buildPreorderWhatsAppUrl({
  scentSlug,
  quantity,
}: PreorderWhatsAppParams) {
  const scentName = getPreorderScentName(scentSlug);
  const quantityText = quantity ? ` x ${quantity}` : "";
  const message = `Hi TARA, I submitted a preorder request for ${scentName}${quantityText}. Can you confirm availability, payment, and delivery details?`;
  const baseUrl = brand.whatsappUrl.split("?")[0] ?? brand.whatsappUrl;

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
