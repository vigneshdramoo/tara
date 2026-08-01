"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  cartStorageKey,
  maxCartQuantity,
  notifyCartChange,
  sanitizeCartItems,
  type CartItem,
} from "@/lib/cart";
import { trackEvent, trackFormStart } from "@/lib/analytics";
import { formatRinggitFromSen, getCheckoutScent, getCheckoutScents } from "@/lib/payments";

const fieldClassName =
  "w-full border-x-0 border-b border-t-0 border-black/14 bg-transparent px-0 py-4 text-sm text-[var(--color-onyx-black)] outline-none transition duration-300 placeholder:text-black/28 focus:border-[var(--color-gold)]";

export function PaymentCheckoutForm() {
  const searchParams = useSearchParams();
  const checkoutProducts = useMemo(() => getCheckoutScents(), []);
  const productBySlug = useMemo(
    () => new Map(checkoutProducts.map((product) => [product.slug, product])),
    [checkoutProducts],
  );
  const requestedProduct = searchParams.get("checkout");
  const initialProduct = getCheckoutScent(requestedProduct);
  const hasTrackedStart = useRef(false);
  const [selectedSlug, setSelectedSlug] = useState(initialProduct?.slug ?? "aureya");
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [notice, setNotice] = useState("");

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
  const hasCartItems = cartLines.length > 0;
  const selectedProduct = productBySlug.get(selectedSlug) ?? checkoutProducts[0];

  const trackPickerStart = useCallback(() => {
    if (hasTrackedStart.current) {
      return;
    }

    hasTrackedStart.current = true;
    trackFormStart({
      formName: "tara-cart-builder",
      formLocation: "preorder_page",
    });
  }, []);

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
        setCartReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [sanitizeItems]);

  useEffect(() => {
    if (!cartReady) {
      return;
    }

    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
    notifyCartChange(cartItems);
  }, [cartItems, cartReady]);

  function addSelectedProductToCart() {
    if (!selectedProduct) {
      return;
    }

    trackPickerStart();
    setNotice("");
    setCartItems((currentCart) =>
      sanitizeItems([
        ...currentCart,
        {
          slug: selectedSlug,
          quantity,
        },
      ]),
    );
    setNotice(`${selectedProduct.name} x ${quantity} added to your cart.`);
    trackEvent("add_to_cart", {
      event_category: "commerce",
      selected_scent: selectedSlug,
      quantity,
      amount: (selectedProduct.priceInSen * quantity) / 100,
    });
  }

  function viewCart() {
    if (!hasCartItems) {
      setNotice("Add at least one TARA item before viewing your cart.");
      return;
    }

    trackEvent("view_cart", {
      event_category: "commerce",
      item_count: itemCount,
      amount: totalInSen / 100,
      page_location: "preorder_page",
    });
    window.location.assign("/cart");
  }

  if (checkoutProducts.length === 0) {
    return null;
  }

  return (
    <section
      id="secure-checkout"
      onFocusCapture={trackPickerStart}
      onChangeCapture={trackPickerStart}
      className="border-y border-black/10 py-7 sm:py-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Add To Cart
          </p>
          <h2 className="mt-4 text-[clamp(2.5rem,5vw,4.8rem)] font-medium leading-[0.88] tracking-[-0.06em] text-[var(--color-onyx-black)]">
            Build your TARA order first.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/58">
            Add a full bottle or the 3 x 8mL RM99 promo set, review your cart,
            then proceed to checkout for delivery details and secure payment.
          </p>
        </div>
        <div className="border-b border-black/14 py-2 text-[10px] uppercase tracking-[0.22em] text-black/58">
          Cart first / Checkout next
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.45fr_auto] lg:items-end">
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Product
          </span>
          <select
            className={fieldClassName}
            value={selectedSlug}
            onChange={(event) => setSelectedSlug(event.target.value)}
          >
            {checkoutProducts.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name} - {product.price}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Quantity
          </span>
          <input
            className={fieldClassName}
            type="number"
            min="1"
            max={maxCartQuantity}
            value={quantity}
            onChange={(event) =>
              setQuantity(
                Math.max(
                  1,
                  Math.min(maxCartQuantity, Number(event.target.value) || 1),
                ),
              )
            }
          />
        </label>

        <div className="grid gap-3 sm:flex sm:flex-wrap lg:justify-end">
          <Button type="button" variant="primary" onClick={addSelectedProductToCart}>
            Add To Cart
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={viewCart}
            disabled={!hasCartItems}
            className={!hasCartItems ? "cursor-not-allowed opacity-45" : undefined}
          >
            View My Cart
          </Button>
        </div>
      </div>

      <div className="mt-8 border-y border-[rgba(202,158,91,0.26)] py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-black/46">
              Current Cart
            </p>
            <p className="mt-3 text-4xl font-medium tracking-[-0.05em] text-[var(--color-onyx-black)]">
              {formatRinggitFromSen(totalInSen)}
            </p>
            <p className="mt-2 text-sm leading-7 text-black/58">
              {hasCartItems
                ? `${itemCount} item${itemCount === 1 ? "" : "s"} ready for review`
                : "Your cart is empty."}
            </p>
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <Button
              href="/cart"
              variant={hasCartItems ? "primary" : "secondary"}
              className={!hasCartItems ? "pointer-events-none opacity-45" : undefined}
              trackingLocation="preorder_cart_builder"
            >
              View Cart
            </Button>
            <Button
              href="/cart/checkout"
              variant="secondary"
              className={!hasCartItems ? "pointer-events-none opacity-45" : undefined}
              trackingLocation="preorder_cart_builder"
            >
              Checkout
            </Button>
          </div>
        </div>

        {hasCartItems ? (
          <div className="mt-5 divide-y divide-black/10 border-y border-black/10">
            {cartLines.map((item) => (
              <div
                key={item.slug}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm text-black/58"
              >
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>{formatRinggitFromSen(item.lineTotalInSen)}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <p aria-live="polite" className="mt-4 text-sm leading-7 text-black/54">
        {notice}
      </p>
    </section>
  );
}
