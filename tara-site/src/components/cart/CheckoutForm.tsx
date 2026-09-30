"use client";

import Image from "next/image";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { discoveryError, discoverySelectionLabel } from "@/lib/discovery";
import { PurchaseReassurance } from "@/components/product/PurchaseReassurance";
import { ProductAvailability } from "@/components/product/ProductAvailability";
import { Button } from "@/components/ui/Button";
import {
  cartStorageKey,
  cartLineKey,
  sanitizeCartItems,
  type CartItem,
} from "@/lib/cart";
import { checkoutExperience } from "@/content/commercial";
import { analyticsEvents, trackEvent, trackFormStart } from "@/lib/analytics";
import {
  firstCheckoutError,
  validateCheckoutDetails,
  type CheckoutFieldErrors,
  type CheckoutFieldName,
} from "@/lib/checkout-validation";
import {
  formatRinggitFromSen,
  getCheckoutScents,
  paymentsEnabled,
} from "@/lib/payments";

const fieldClassName =
  "w-full border-x-0 border-b border-t-0 border-black/14 bg-transparent px-0 py-4 text-sm text-[var(--color-onyx-black)] outline-none transition duration-300 placeholder:text-black/28 focus:border-[var(--color-gold)]";

const paymentMethod = "toyyibpay";
const paymentChannel = "2";

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function FieldError({
  name,
  errors,
}: {
  name: CheckoutFieldName;
  errors: CheckoutFieldErrors;
}) {
  return errors[name] ? (
    <span id={`${name}-error`} role="alert" className="block text-sm text-[#8b321f]">
      {errors[name]}
    </span>
  ) : null;
}

export function CheckoutForm() {
  const checkoutProducts = useMemo(() => getCheckoutScents(), []);
  const productBySlug = useMemo(
    () => new Map(checkoutProducts.map((product) => [product.slug, product])),
    [checkoutProducts],
  );
  const submitLock = useRef(false);
  const hasTrackedStart = useRef(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});

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
  const hasItems = cartLines.length > 0;
  const invalidDiscovery = cartItems.some((item) => discoveryError(item));
  const trackCheckoutFormStart = useCallback(() => {
    if (hasTrackedStart.current) {
      return;
    }

    hasTrackedStart.current = true;
    trackFormStart({
      formName: "tara-cart-checkout",
      formLocation: "cart_checkout_page",
    });
  }, []);

  function handleFormChange(event: FormEvent<HTMLFormElement>) {
    trackCheckoutFormStart();
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const name = target.name as CheckoutFieldName;
    if (!fieldErrors[name]) return;
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

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
        setMessage(
          "We could not load your cart. Please return to your cart and try again.",
        );
        setStatus("error");
      } finally {
        setHydrated(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [sanitizeItems]);

  async function recordCheckoutLead(formData: FormData) {
    const encodedForm = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      encodedForm.append(key, String(value));
    }

    encodedForm.set("form-name", "tara-cart-checkout");
    encodedForm.set("cart_items", JSON.stringify(cartLines));
    encodedForm.set("cart_total", formatRinggitFromSen(totalInSen));
    encodedForm.set("payment_method", paymentMethod);

    await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: encodedForm.toString(),
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current) return;
    trackCheckoutFormStart();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextFieldErrors = validateCheckoutDetails(formData);
    const firstInvalidField = firstCheckoutError(nextFieldErrors);
    setFieldErrors(nextFieldErrors);
    if (firstInvalidField) {
      setStatus("error");
      setMessage("Review the highlighted details before continuing.");
      const field = form.elements.namedItem(firstInvalidField);
      if (field instanceof HTMLElement) {
        field.focus({ preventScroll: true });
        field.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (invalidDiscovery) {
      setStatus("error");
      setMessage(
        "Choose 3 different available scents for every discovery set before checkout.",
      );
      return;
    }
    try {
      const current = sanitizeItems(
        JSON.parse(window.localStorage.getItem(cartStorageKey) ?? "[]"),
      );
      if (JSON.stringify(current) !== JSON.stringify(cartItems)) {
        setCartItems(current);
        setStatus("error");
        setMessage(
          "Your cart changed. Review the updated order summary before continuing.",
        );
        return;
      }
    } catch {
      setStatus("error");
      setMessage("We could not read your cart. Please try again.");
      return;
    }

    if (!hasItems) {
      setStatus("error");
      setMessage("Your cart is empty. Add a TARA scent before checkout.");
      return;
    }

    if (!paymentsEnabled) {
      setStatus("error");
      setMessage(
        "Secure checkout is being connected. Please use WhatsApp concierge for now.",
      );
      return;
    }

    submitLock.current = true;
    setStatus("submitting");
    setMessage("");

    const payload = {
      items: cartLines.map((item) => ({
        scentSlug: item.slug,
        quantity: item.quantity,
        configuration: item.configuration,
      })),
      name: getFormValue(formData, "name"),
      email: getFormValue(formData, "email"),
      phone: getFormValue(formData, "phone"),
      addressLine1: getFormValue(formData, "address_line_1"),
      addressLine2: getFormValue(formData, "address_line_2"),
      addressLine3: getFormValue(formData, "address_line_3"),
      city: getFormValue(formData, "city"),
      zipcode: getFormValue(formData, "zipcode"),
      country: getFormValue(formData, "country"),
      notes: getFormValue(formData, "notes"),
      paymentMethod,
      paymentChannel,
    };

    try {
      await recordCheckoutLead(formData).catch(() => undefined);
      trackEvent(analyticsEvents.paymentCheckoutStart, {
        event_category: "commerce",
        provider: "toyyibpay",
        payment_method: paymentMethod,
        item_count: itemCount,
        amount: totalInSen / 100,
      });

      const response = await fetch(
        "/.netlify/functions/create-toyyibpay-bill",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as {
        error?: string;
        paymentUrl?: string;
        billCode?: string;
        receiptToken?: string;
      };

      if (!response.ok || !result.paymentUrl) {
        throw new Error(result.error ?? "Unable to start secure checkout.");
      }

      trackEvent(analyticsEvents.paymentRedirect, {
        event_category: "commerce",
        provider: "toyyibpay",
        payment_method: paymentMethod,
        item_count: itemCount,
        amount: totalInSen / 100,
      });
      if (result.receiptToken && result.billCode) {
        try {
          window.localStorage.setItem(
            `tara-receipt-${result.billCode}`,
            result.receiptToken,
          );
        } catch {
          throw new Error(
            "We could not save your order reference on this device. Please try again before payment.",
          );
        }
      }
      window.location.assign(result.paymentUrl);
    } catch (error) {
      submitLock.current = false;
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Secure checkout is unavailable right now. Please use WhatsApp concierge.",
      );
    }
  }

  if (!hydrated) {
    return (
      <div className="border-y border-black/10 py-10 text-sm leading-7 text-black/54">
        Loading checkout...
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="grid gap-8 border-y border-black/10 py-8 lg:grid-cols-[1fr_0.42fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Cart Required
          </p>
          <h2 className="mt-4 text-[clamp(2.8rem,7vw,5.8rem)] font-medium leading-[0.86] tracking-[-0.065em] text-[var(--color-onyx-black)]">
            Add a scent before checkout.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
            Checkout starts with your cart so TARA can calculate one secure
            total for the full order.
          </p>
        </div>
        <div className="grid content-start gap-3">
          <Button href="/preorder#secure-checkout" variant="primary">
            Add Products
          </Button>
          <Button href="/cart" variant="secondary">
            View Cart
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-9 lg:grid-cols-[1fr_0.42fr] lg:items-start">
      <form
        name="tara-cart-checkout"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        noValidate
        onSubmit={handleSubmit}
        onFocusCapture={trackCheckoutFormStart}
        onChangeCapture={handleFormChange}
        className="border-y border-black/10 py-8"
      >
        <input type="hidden" name="form-name" value="tara-cart-checkout" />
        <input type="hidden" name="bot-field" />
        <input
          type="hidden"
          name="subject"
          value="New lead from %{formName} (%{submissionId})"
        />
        <input type="hidden" name="submission_source" value="cart-checkout" />
        <input
          type="hidden"
          name="cart_items"
          value={JSON.stringify(cartLines)}
        />
        <input
          type="hidden"
          name="cart_total"
          value={formatRinggitFromSen(totalInSen)}
        />
        <input
          type="hidden"
          name="payment_method"
          value={paymentMethod}
        />

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            1 / Personal Details
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label className="space-y-3">
              <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                Full Name
              </span>
              <input
                className={fieldClassName}
                type="text"
                name="name"
                autoComplete="name"
                required
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
              />
              <FieldError name="name" errors={fieldErrors} />
            </label>
            <label className="space-y-3">
              <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                Email
              </span>
              <input
                className={fieldClassName}
                type="email"
                name="email"
                autoComplete="email"
                required
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              <FieldError name="email" errors={fieldErrors} />
            </label>
          </div>
          <label className="mt-6 block space-y-3">
            <span className="text-xs uppercase tracking-[0.24em] text-black/58">
              WhatsApp / Phone
            </span>
            <input
              className={fieldClassName}
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="+60..."
              required
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            />
            <FieldError name="phone" errors={fieldErrors} />
          </label>
        </div>

        <div className="mt-10 border-t border-black/10 pt-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            2 / Shipment Details
          </p>
          <div className="mt-6 grid gap-6">
            <label className="space-y-3">
              <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                Address Line 1
              </span>
              <input
                className={fieldClassName}
                type="text"
                name="address_line_1"
                autoComplete="address-line1"
                required
                aria-invalid={Boolean(fieldErrors.address_line_1)}
                aria-describedby={
                  fieldErrors.address_line_1
                    ? "address_line_1-error"
                    : undefined
                }
              />
              <FieldError name="address_line_1" errors={fieldErrors} />
            </label>
            <label className="space-y-3">
              <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                Address Line 2 <span className="text-black/32">(optional)</span>
              </span>
              <input
                className={fieldClassName}
                type="text"
                name="address_line_2"
                autoComplete="address-line2"
              />
            </label>
            <label className="space-y-3">
              <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                Address Line 3 <span className="text-black/32">(optional)</span>
              </span>
              <input
                className={fieldClassName}
                type="text"
                name="address_line_3"
                autoComplete="address-line3"
              />
            </label>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <label className="space-y-3">
              <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                City
              </span>
              <input
                className={fieldClassName}
                type="text"
                name="city"
                autoComplete="address-level2"
                required
                aria-invalid={Boolean(fieldErrors.city)}
                aria-describedby={fieldErrors.city ? "city-error" : undefined}
              />
              <FieldError name="city" errors={fieldErrors} />
            </label>
            <label className="space-y-3">
              <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                Zipcode
              </span>
              <input
                className={fieldClassName}
                type="text"
                name="zipcode"
                autoComplete="postal-code"
                required
                aria-invalid={Boolean(fieldErrors.zipcode)}
                aria-describedby={
                  fieldErrors.zipcode ? "zipcode-error" : undefined
                }
              />
              <FieldError name="zipcode" errors={fieldErrors} />
            </label>
            <label className="space-y-3">
              <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                Country
              </span>
              <input
                className={fieldClassName}
                type="text"
                name="country"
                defaultValue="Malaysia"
                autoComplete="country-name"
                required
                aria-invalid={Boolean(fieldErrors.country)}
                aria-describedby={
                  fieldErrors.country ? "country-error" : undefined
                }
              />
              <FieldError name="country" errors={fieldErrors} />
            </label>
          </div>
        </div>

        <div className="mt-10 border-y border-black/10 py-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            3 / Payment Method
          </p>
          <div className="mt-6 border border-[rgba(202,158,91,0.55)] bg-[rgba(202,158,91,0.08)] px-4 py-4">
            <p className="text-base font-medium text-[var(--color-onyx-black)]">
              Pay securely via ToyyibPay
            </p>
            <p className="mt-2 text-sm leading-7 text-black/54">
              Continue to ToyyibPay to use the payment methods available for
              your order, including Malaysian-friendly online banking options
              where enabled.
            </p>
          </div>
          <p className="mt-5 text-sm leading-7 text-black/54">
            {checkoutExperience.paymentFinality}
          </p>
        </div>

        <label className="mt-6 block space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Notes
          </span>
          <textarea
            className={`${fieldClassName} min-h-28 resize-y`}
            name="notes"
            placeholder="Optional: delivery preference, gifting note, or anything the house should know. Your selected discovery scents are already attached to the order."
          />
        </label>

        <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
          <Button
            type="submit"
            variant="primary"
            disabled={status === "submitting" || invalidDiscovery}
          >
            {status === "submitting" ? "Redirecting..." : "Checkout Securely"}
          </Button>
          <Button href="/cart" variant="secondary">
            Back To Cart
          </Button>
        </div>
        <p
          aria-live="polite"
          className="mt-4 text-sm leading-7 text-[var(--color-copy)]"
        >
          {status === "error" ? message : null}
        </p>
      </form>

      <aside className="sticky top-28 border-y border-[rgba(202,158,91,0.26)] py-6">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
          Order Summary
        </p>
        <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
          {cartLines.map((item) => (
            <article
              key={cartLineKey(item)}
              className="grid grid-cols-[4.5rem_1fr] gap-4 py-4"
            >
              <div className="relative aspect-square overflow-hidden rounded-[0.85rem] border border-black/10">
                <Image
                  src={item.product.visual.src}
                  alt={item.product.visual.alt}
                  fill
                  sizes="4.5rem"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-base font-medium tracking-[-0.03em] text-[var(--color-onyx-black)]">
                  {item.product.name}
                </p>
                {item.configuration && (
                  <p className="mt-2 text-sm font-semibold leading-7">
                    {discoverySelectionLabel(item.configuration)}
                  </p>
                )}
                <ProductAvailability product={item.product} className="mt-2" />
                {discoveryError(item) && (
                  <p role="alert" className="mt-2 text-sm text-[#8b321f]">
                    {discoveryError(item)}{" "}
                    <a href="/cart" className="underline">
                      Return to cart to replace this set.
                    </a>
                  </p>
                )}
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-black/42">
                  {item.product.price} / Qty {item.quantity}
                </p>
                <p className="mt-2 text-sm text-black/60">
                  {formatRinggitFromSen(item.lineTotalInSen)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between gap-4 text-sm text-black/58">
            <span>Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm text-black/58">
            <span>Subtotal</span>
            <span>{formatRinggitFromSen(totalInSen)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm text-black/58">
            <span>Shipping</span>
            <span className="max-w-48 text-right">
              {checkoutExperience.shippingAtCheckout}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm text-black/58">
            <span>Payment</span>
            <span>ToyyibPay</span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-black/10 pt-4 text-[var(--color-onyx-black)]">
            <span className="text-xs uppercase tracking-[0.22em] text-black/46">
              Estimated total before shipping
            </span>
            <span className="text-4xl font-medium tracking-[-0.06em]">
              {formatRinggitFromSen(totalInSen)}
            </span>
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-black/54">
          ToyyibPay will show {formatRinggitFromSen(totalInSen)} for the items in
          this order. Shipping is not included in that amount and will not be
          silently added during this handoff.
        </p>
        <PurchaseReassurance compact className="mt-4" />
      </aside>
    </div>
  );
}
