export const cartStorageKey = "tara-cart-items";
export const maxCartQuantity = 12;

export type CartItem = {
  slug: string;
  quantity: number;
};

export function getCartItemCount(items: Array<{ quantity?: number }>) {
  return items.reduce((total, item) => total + Number(item.quantity ?? 0), 0);
}

export function sanitizeCartItems(
  items: CartItem[],
  hasProduct: (slug: string) => boolean,
) {
  const mergedCart = new Map<string, number>();

  items.forEach((item) => {
    if (!hasProduct(item.slug)) {
      return;
    }

    const quantity = Math.max(
      1,
      Math.min(maxCartQuantity, Math.trunc(Number(item.quantity) || 1)),
    );
    mergedCart.set(item.slug, (mergedCart.get(item.slug) ?? 0) + quantity);
  });

  return Array.from(mergedCart.entries()).map(([slug, quantity]) => ({
    slug,
    quantity: Math.min(maxCartQuantity, quantity),
  }));
}

export function notifyCartChange(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("tara:cart", {
      detail: {
        itemCount: getCartItemCount(items),
      },
    }),
  );
}
