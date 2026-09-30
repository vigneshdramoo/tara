"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { DiscoverySetPicker } from "@/components/product/DiscoverySetPicker";
import {
  discoverySetSlug,
  discoveryError,
  discoverySelectionLabel,
  type DiscoveryConfiguration,
} from "@/lib/discovery";
import { Button } from "@/components/ui/Button";
import { PurchaseReassurance } from "@/components/product/PurchaseReassurance";
import { ProductAvailability } from "@/components/product/ProductAvailability";
import {
  cartStorageKey,
  maxCartQuantity,
  saveCart,
  cartLineKey,
  sanitizeCartItems,
  type CartItem,
} from "@/lib/cart";
import { checkoutExperience } from "@/content/commercial";
import { analyticsEvents, trackEvent, trackFormStart } from "@/lib/analytics";
import {
  formatRinggitFromSen,
  getCheckoutScent,
  getCheckoutScents,
} from "@/lib/payments";

const fieldClassName =
  "w-full border-x-0 border-b border-t-0 border-black/14 bg-transparent px-0 py-4 text-sm text-[var(--color-onyx-black)] outline-none transition duration-300 placeholder:text-black/28 focus:border-[var(--color-gold)]";

function subscribeToUrlChanges(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getCheckoutQuerySnapshot() {
  return new URLSearchParams(window.location.search).get("checkout") ?? "";
}

function getServerCheckoutQuerySnapshot() {
  return "";
}

export function PaymentCheckoutForm() {
  const requestedProduct = useSyncExternalStore(
    subscribeToUrlChanges,
    getCheckoutQuerySnapshot,
    getServerCheckoutQuerySnapshot,
  );
  const checkoutProducts = useMemo(() => getCheckoutScents(), []);
  const productBySlug = useMemo(
    () => new Map(checkoutProducts.map((product) => [product.slug, product])),
    [checkoutProducts],
  );
  const initialProduct = getCheckoutScent(requestedProduct);
  const hasTrackedStart = useRef(false);
  const [userSelectedSlug, setUserSelectedSlug] = useState<string | null>(null);
  const selectedSlug = userSelectedSlug ?? initialProduct?.slug ?? "aureya";
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [notice, setNotice] = useState("");

  const sanitizeItems = useCallback(
    (items: CartItem[]) =>
      sanitizeCartItems(items, (slug) => productBySlug.has(slug)),
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
  const selectedProduct =
    productBySlug.get(selectedSlug) ?? checkoutProducts[0];
  const selectedSubtotalInSen = (selectedProduct?.priceInSen ?? 0) * quantity;

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
        setNotice("We could not load your cart. Please try again.");
      } finally {
        setCartReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [sanitizeItems]);

  function addSelectedProductToCart(
    configuration?: DiscoveryConfiguration,
  ): boolean {
    if (!selectedProduct || !cartReady) return false;
    const line: CartItem = {
      slug: selectedSlug,
      quantity,
      ...(configuration ? { configuration } : {}),
    };
    const validationError = discoveryError(line);
    if (validationError) {
      setNotice(validationError);
      return false;
    }
    trackPickerStart();
    try {
      const latest = sanitizeItems(
        JSON.parse(window.localStorage.getItem(cartStorageKey) ?? "[]"),
      );
      const next = sanitizeItems([...latest, line]);
      saveCart(next);
      setCartItems(next);
      setNotice(
        `${selectedProduct.name} x ${quantity} added to your cart. Review the cart when you are ready.`,
      );
      trackEvent(analyticsEvents.productAddToCart, {
        event_category: "commerce",
        selected_scent: selectedSlug,
        item_id: selectedProduct.slug,
        item_name: selectedProduct.name,
        quantity,
        amount: (selectedProduct.priceInSen * quantity) / 100,
        link_location: "preorder_cart_builder",
      });
      if (configuration)
        trackEvent(analyticsEvents.discoverySetAddToCart, {
          selected_count: 3,
          scent_ids: configuration.scentIds.join(","),
          quantity,
        });
      return true;
    } catch {
      setNotice("We could not save your cart. Please try again.");
      return false;
    }
  }

  function viewCart() {
    if (!hasCartItems) {
      setNotice("Add at least one TARA item before viewing your cart.");
      return;
    }

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
            {checkoutExperience.cartBuilder.eyebrow}
          </p>
          <h2 className="mt-4 text-[clamp(2.5rem,5vw,4.8rem)] font-medium leading-[0.88] tracking-[-0.06em] text-[var(--color-onyx-black)]">
            {checkoutExperience.cartBuilder.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/58">
            {checkoutExperience.cartBuilder.body}
          </p>
        </div>
        <div className="border-b border-black/14 py-2 text-[10px] uppercase tracking-[0.22em] text-black/58">
          {checkoutExperience.cartBuilder.badge}
        </div>
      </div>

      <ol className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {checkoutExperience.sequence.map((step, index) => (
          <li
            key={step}
            className="rounded-[1rem] border border-black/10 bg-[rgba(255,250,241,0.54)] p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-gold)]">
              Step {index + 1}
            </p>
            <p className="mt-3 text-sm leading-7 text-black/60">{step}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.45fr_auto] lg:items-end">
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Product
          </span>
          <select
            className={fieldClassName}
            value={selectedSlug}
            onChange={(event) => setUserSelectedSlug(event.target.value)}
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
                  Math.min(
                    maxCartQuantity,
                    Math.trunc(Number(event.target.value)) || 1,
                  ),
                ),
              )
            }
          />
        </label>

        <div className="grid gap-3 sm:flex sm:flex-wrap lg:justify-end">
          {selectedSlug !== discoverySetSlug && (
            <Button
              type="button"
              variant="primary"
              disabled={!cartReady}
              onClick={() => addSelectedProductToCart()}
            >
              Add To Cart
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            onClick={viewCart}
            disabled={!hasCartItems}
            className={
              !hasCartItems ? "cursor-not-allowed opacity-45" : undefined
            }
          >
            View My Cart
          </Button>
        </div>
      </div>

      {selectedSlug === discoverySetSlug && (
        <DiscoverySetPicker
          ready={cartReady}
          onAdd={addSelectedProductToCart}
        />
      )}

      <div className="mt-6 grid gap-4 rounded-[1.1rem] border border-black/10 bg-[rgba(255,250,241,0.58)] p-5 sm:grid-cols-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-black/42">
            Selected Product
          </p>
          <p className="mt-2 text-base font-medium tracking-[-0.02em] text-[var(--color-onyx-black)]">
            {selectedProduct?.name ?? "Select a product"}
          </p>
          <p className="mt-1 text-sm leading-6 text-black/54">
            {selectedProduct?.price ?? "RM0"} each
          </p>
          {selectedProduct ? (
            <ProductAvailability
              product={selectedProduct}
              className="mt-2"
              showDetail
            />
          ) : null}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-black/42">
            Quantity
          </p>
          <p className="mt-2 text-base font-medium tracking-[-0.02em] text-[var(--color-onyx-black)]">
            {quantity}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-black/42">
            Subtotal Before Shipping
          </p>
          <p className="mt-2 text-3xl font-medium tracking-[-0.05em] text-[var(--color-onyx-black)]">
            {formatRinggitFromSen(selectedSubtotalInSen)}
          </p>
        </div>
      </div>

      <div className="mt-8 border-y border-[rgba(202,158,91,0.26)] py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-black/46">
              Items subtotal
            </p>
            <p className="mt-3 text-4xl font-medium tracking-[-0.05em] text-[var(--color-onyx-black)]">
              {formatRinggitFromSen(totalInSen)}
            </p>
            <p className="mt-2 text-sm leading-7 text-black/58">
              {hasCartItems
                ? `${itemCount} item${itemCount === 1 ? "" : "s"} ready for review`
                : "Your cart is empty."}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-black/52">
              {checkoutExperience.cartTotalNote}
            </p>
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <Button
              href="/cart"
              variant={hasCartItems ? "primary" : "secondary"}
              className={
                !hasCartItems ? "pointer-events-none opacity-45" : undefined
              }
              trackingLocation="preorder_cart_builder"
              trackingParams={{
                item_count: itemCount,
                amount: totalInSen / 100,
              }}
            >
              View Cart
            </Button>
            <Button
              href="/cart/checkout"
              variant="secondary"
              className={
                !hasCartItems ? "pointer-events-none opacity-45" : undefined
              }
              trackingLocation="preorder_cart_builder"
              trackingEventName={analyticsEvents.checkoutStart}
              trackingParams={{
                item_count: itemCount,
                amount: totalInSen / 100,
              }}
            >
              Checkout
            </Button>
          </div>
        </div>

        {hasCartItems ? (
          <div className="mt-5 divide-y divide-black/10 border-y border-black/10">
            {cartLines.map((item) => (
              <div
                key={cartLineKey(item)}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm text-black/58"
              >
                <span>
                  {item.product.name} x {item.quantity}
                  {item.configuration && (
                    <span className="block text-sm">
                      {discoverySelectionLabel(item.configuration)}
                    </span>
                  )}
                  <ProductAvailability product={item.product} className="mt-1" />
                  {discoveryError(item) && (
                    <span className="block text-sm text-[#8b321f]">
                      {discoveryError(item)} Remove this set in your cart and
                      choose again.
                    </span>
                  )}
                </span>
                <span>{formatRinggitFromSen(item.lineTotalInSen)}</span>
              </div>
            ))}
            <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm text-black/58">
              <span>Shipping</span>
              <span>{checkoutExperience.shippingAtCheckout}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm text-[var(--color-onyx-black)]">
              <span className="text-xs uppercase tracking-[0.22em] text-black/46">
                Estimated total before shipping
              </span>
              <span className="text-2xl font-medium tracking-[-0.04em]">
                {formatRinggitFromSen(totalInSen)}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="mt-4 grid gap-3 text-sm leading-7 text-black/54 sm:flex sm:flex-wrap sm:items-center"
      >
        <span>{notice}</span>
        {notice && hasCartItems ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={viewCart}
          >
            View Cart
          </Button>
        ) : null}
      </div>
      <p className="mt-5 border-t border-black/10 pt-5 text-sm leading-7 text-black/54">
        {checkoutExperience.paymentFinality}
      </p>
      <PurchaseReassurance compact className="mt-5" />
    </section>
  );
}
