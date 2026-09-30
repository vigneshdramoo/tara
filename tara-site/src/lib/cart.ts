import {
  discoverySetSlug,
  discoverySelectionType,
  type DiscoveryConfiguration,
} from "@/lib/discovery";
export const cartStorageKey = "tara-cart-items";
export const maxCartQuantity = 12;
export type CartItem = {
  slug: string;
  quantity: number;
  configuration?: DiscoveryConfiguration;
};
export function getCartItemCount(items: Array<{ quantity?: number }>) {
  return items.reduce((total, item) => total + Number(item.quantity ?? 0), 0);
}
export function cartLineKey(item: CartItem) {
  return item.slug === discoverySetSlug
    ? `${item.slug}:${JSON.stringify(item.configuration?.scentIds ?? [])}`
    : item.slug;
}
export function sanitizeCartItems(
  items: unknown,
  hasProduct: (slug: string) => boolean,
): CartItem[] {
  const merged = new Map<string, CartItem>();
  if (!Array.isArray(items)) return [];
  for (const item of items) {
    if (!item || typeof item.slug !== "string" || !hasProduct(item.slug))
      continue;
    const quantity = Math.max(
      1,
      Math.min(maxCartQuantity, Math.trunc(Number(item.quantity) || 1)),
    );
    const line: CartItem = { slug: item.slug, quantity };
    // Preserve invalid/missing configurations for visible recovery, never silently repair an order.
    if (
      item.slug === discoverySetSlug &&
      item.configuration?.type === discoverySelectionType &&
      Array.isArray(item.configuration.scentIds) &&
      item.configuration.scentIds.every((id: unknown) => typeof id === "string")
    ) {
      line.configuration = {
        type: discoverySelectionType,
        scentIds: [...item.configuration.scentIds].sort(),
      };
    }
    const key = cartLineKey(line);
    line.quantity = Math.min(
      maxCartQuantity,
      (merged.get(key)?.quantity ?? 0) + quantity,
    );
    merged.set(key, line);
  }
  return [...merged.values()];
}
export function notifyCartChange(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("tara:cart", {
      detail: { itemCount: getCartItemCount(items) },
    }),
  );
}
export function saveCart(items: CartItem[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  notifyCartChange(items);
}
