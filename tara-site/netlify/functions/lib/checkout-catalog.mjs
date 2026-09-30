import generated from "./generated-checkout-catalog.mjs";
import {
  discoverySetSlug,
  discoverySelectionType,
  validateDiscoverySelection,
} from "../../../shared/discovery-set.mjs";
export const maxCheckoutQuantityPerLine = 12;
export const maxCheckoutQuantityTotal = 24;
export const checkoutCatalog = Object.freeze({
  ...generated.products,
  marin: { ...generated.products.maris, canonicalSlug: "maris" },
});
export const requiredCheckoutSlugs = Object.freeze(
  Object.keys(generated.products),
);
export const eligibleDiscoveryScents = generated.eligibleScents;
export class CheckoutValidationError extends Error {}
export function getCheckoutProduct(slug) {
  return typeof slug === "string" && Object.hasOwn(checkoutCatalog, slug)
    ? checkoutCatalog[slug]
    : undefined;
}
export function normalizeCheckoutItems(body) {
  const rawItems = Array.isArray(body?.items)
    ? body.items
    : body?.scentSlug
      ? [
          {
            scentSlug: body.scentSlug,
            quantity: body.quantity ?? 1,
            configuration: body.configuration,
          },
        ]
      : [];
  if (!rawItems.length || rawItems.length > maxCheckoutQuantityTotal)
    throw new CheckoutValidationError(
      "Please review your cart before checkout.",
    );
  const merged = new Map();
  for (const item of rawItems) {
    const requestedSlug = item?.scentSlug ?? item?.slug;
    const product = getCheckoutProduct(requestedSlug);
    const quantity = Number(item?.quantity ?? 1);
    if (
      !product ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > maxCheckoutQuantityPerLine
    )
      throw new CheckoutValidationError(
        "Please review your cart before checkout.",
      );
    const slug = product.canonicalSlug ?? requestedSlug;
    const line = { slug, ...checkoutCatalog[slug], quantity };
    if (slug === discoverySetSlug) {
      const selection = validateDiscoverySelection(
        item.configuration,
        Object.keys(eligibleDiscoveryScents),
      );
      if (!selection.valid) throw new CheckoutValidationError(selection.error);
      const scentNames = selection.scentIds.map(
        (id) => eligibleDiscoveryScents[id].name,
      );
      line.configuration = {
        type: discoverySelectionType,
        scentIds: selection.scentIds,
        scentNames,
        selectionLabel: scentNames.join(" · "),
      };
    }
    const key = `${slug}:${JSON.stringify(line.configuration?.scentIds ?? [])}`;
    line.quantity += merged.get(key)?.quantity ?? 0;
    if (line.quantity > maxCheckoutQuantityPerLine)
      throw new CheckoutValidationError(
        "Please reduce the quantity in your cart.",
      );
    merged.set(key, line);
  }
  const lines = [...merged.values()];
  if (
    lines.reduce((total, item) => total + item.quantity, 0) >
    maxCheckoutQuantityTotal
  )
    throw new CheckoutValidationError(
      "Please reduce the quantity in your cart.",
    );
  return lines;
}
export function checkoutItemSummary(items) {
  return items
    .map(
      (item) =>
        `${item.name}${item.configuration ? ` (${item.configuration.selectionLabel})` : ""} x ${item.quantity}`,
    )
    .join(", ");
}
