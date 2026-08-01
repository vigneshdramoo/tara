"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  cartStorageKey,
  maxCartQuantity,
  notifyCartChange,
  sanitizeCartItems,
  type CartItem,
} from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";
import { formatRinggitFromSen, getCheckoutScents } from "@/lib/payments";

export function CartView() {
  const checkoutProducts = useMemo(() => getCheckoutScents(), []);
  const productBySlug = useMemo(
    () => new Map(checkoutProducts.map((product) => [product.slug, product])),
    [checkoutProducts],
  );
  const hasTrackedView = useRef(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const sanitizeItems = useCallback(
    (items: CartItem[]) => sanitizeCartItems(items, (slug) => productBySlug.has(slug)),
    [productBySlug],
  );

  const cartLines = useMemo(
    () =>
      cartItems
        .map((item) => {
          const product = productBySlug.get(item.slug);

          if (!product) {
            return null;
          }

          return {
            ...item,
            product,
            lineTotalInSen: product.priceInSen * item.quantity,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [cartItems, productBySlug],
  );
  const itemCount = cartLines.reduce((total, item) => total + item.quantity, 0);
  const totalInSen = cartLines.reduce(
    (total, item) => total + item.lineTotalInSen,
    0,
  );
  const hasItems = cartLines.length > 0;

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      try {
        const savedCart = window.localStorage.getItem(cartStorageKey);

        if (savedCart) {
          setCartItems(sanitizeItems(JSON.parse(savedCart) as CartItem[]));
        }
      } catch {
        window.localStorage.removeItem(cartStorageKey);
      } finally {
        setHydrated(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [sanitizeItems]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
    notifyCartChange(cartItems);
  }, [cartItems, hydrated]);

  useEffect(() => {
    if (!hydrated || !hasItems || hasTrackedView.current) {
      return;
    }

    hasTrackedView.current = true;
    trackEvent("view_cart", {
      event_category: "commerce",
      item_count: itemCount,
      amount: totalInSen / 100,
      page_location: "cart_page",
    });
  }, [hasItems, hydrated, itemCount, totalInSen]);

  function updateCartQuantity(slug: string, nextQuantity: number) {
    setCartItems((currentCart) =>
      currentCart.flatMap((item) => {
        if (item.slug !== slug) {
          return item;
        }

        if (nextQuantity < 1) {
          return [];
        }

        return {
          ...item,
          quantity: Math.min(maxCartQuantity, nextQuantity),
        };
      }),
    );
  }

  function removeCartItem(slug: string) {
    setCartItems((currentCart) => currentCart.filter((item) => item.slug !== slug));
  }

  function clearCart() {
    setCartItems([]);
  }

  if (!hydrated) {
    return (
      <div className="border-y border-black/10 py-10 text-sm leading-7 text-black/54">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:items-start">
      <section className="border-y border-black/10">
        {hasItems ? (
          <div className="divide-y divide-black/10">
            {cartLines.map((item) => (
              <article
                key={item.slug}
                className="grid gap-5 py-6 sm:grid-cols-[7.5rem_1fr] sm:py-7"
              >
                <div className="relative aspect-square overflow-hidden rounded-[1.1rem] border border-black/10">
                  <Image
                    src={item.product.visual.src}
                    alt={item.product.visual.alt}
                    fill
                    sizes="(min-width: 640px) 7.5rem, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.02),rgba(247,243,235,0.26))]" />
                </div>
                <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                      {item.product.audience}
                    </p>
                    <h2 className="mt-3 text-[clamp(2.4rem,7vw,4.8rem)] font-medium leading-[0.86] tracking-[-0.06em] text-[var(--color-onyx-black)]">
                      {item.product.name}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-black/58">
                      {item.product.summary}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.22em] text-black/44">
                      {item.product.price} each
                    </p>
                  </div>
                  <div className="sm:min-w-48">
                    <p className="text-2xl font-medium tracking-[-0.04em] text-[var(--color-onyx-black)] sm:text-right">
                      {formatRinggitFromSen(item.lineTotalInSen)}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 sm:justify-end">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.slug, item.quantity - 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-black/14 text-[var(--color-onyx-black)] transition duration-300 hover:border-[rgba(202,158,91,0.55)] hover:bg-[rgba(202,158,91,0.08)]"
                        aria-label={`Reduce ${item.product.name} quantity`}
                      >
                        -
                      </button>
                      <span className="min-w-10 text-center text-sm font-semibold text-[var(--color-onyx-black)]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.slug, item.quantity + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-black/14 text-[var(--color-onyx-black)] transition duration-300 hover:border-[rgba(202,158,91,0.55)] hover:bg-[rgba(202,158,91,0.08)]"
                        aria-label={`Increase ${item.product.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCartItem(item.slug)}
                      className="mt-3 text-xs uppercase tracking-[0.22em] text-black/42 transition duration-300 hover:text-[var(--color-gold)] sm:block sm:w-full sm:text-right"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-10">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
              Your cart is empty
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
              Add any 50mL TARA scent, including new launch THEON, or the 3 x
              8mL RM99 promo set to begin your order. Your cart will
              stay saved on this device.
            </p>
          </div>
        )}
      </section>

      <aside className="sticky top-28 border-y border-[rgba(202,158,91,0.26)] py-6">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
          Order Summary
        </p>
        <div className="mt-6 space-y-4 border-y border-black/10 py-5">
          <div className="flex items-center justify-between gap-4 text-sm text-black/58">
            <span>Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm text-black/58">
            <span>Shipping</span>
            <span>Confirmed by concierge</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-2 text-[var(--color-onyx-black)]">
            <span className="text-xs uppercase tracking-[0.22em] text-black/46">
              Total
            </span>
            <span className="text-4xl font-medium tracking-[-0.06em]">
              {formatRinggitFromSen(totalInSen)}
            </span>
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-black/54">
          Checkout will collect your delivery details and redirect to ToyyibPay
          for the combined cart total.
        </p>
        <div className="mt-6 grid gap-3">
          <Button
            href="/cart/checkout"
            variant={hasItems ? "primary" : "secondary"}
            className={!hasItems ? "pointer-events-none opacity-45" : undefined}
            trackingLocation="cart_page"
          >
            Proceed to Checkout
          </Button>
          <Button href="/preorder#secure-checkout" variant="secondary">
            Add More
          </Button>
          <Button href="/scents" variant="ghost">
            Continue Exploring
          </Button>
          {hasItems ? (
            <button
              type="button"
              onClick={clearCart}
              className="mt-2 text-xs uppercase tracking-[0.22em] text-black/42 transition duration-300 hover:text-[var(--color-gold)]"
            >
              Clear Cart
            </button>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
