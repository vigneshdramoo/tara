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

import { Button } from "@/components/ui/Button";
import {
  cartStorageKey,
  sanitizeCartItems,
  type CartItem,
} from "@/lib/cart";
import { analyticsEvents, trackEvent, trackFormStart } from "@/lib/analytics";
import {
  duitNowQrEnabled,
  formatRinggitFromSen,
  getCheckoutScents,
  paymentsEnabled,
} from "@/lib/payments";

const fieldClassName =
  "w-full border-x-0 border-b border-t-0 border-black/14 bg-transparent px-0 py-4 text-sm text-[var(--color-onyx-black)] outline-none transition duration-300 placeholder:text-black/28 focus:border-[var(--color-gold)]";

const paymentOptions = [
  {
    value: "online-banking",
    label: "Online Banking",
    description: "Pay through ToyyibPay using Malaysian-friendly bank checkout.",
    channel: "2",
  },
  {
    value: "secure-checkout",
    label: "ToyyibPay Secure Checkout",
    description: "Continue to ToyyibPay and use the supported methods shown there.",
    channel: "2",
  },
  ...(duitNowQrEnabled
    ? [
        {
          value: "duitnow-qr",
          label: "DuitNow QR",
          description: "Use DuitNow QR if it is available on the hosted payment page.",
          channel: "2",
        },
      ]
    : []),
];

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function CheckoutForm() {
  const checkoutProducts = useMemo(() => getCheckoutScents(), []);
  const productBySlug = useMemo(
    () => new Map(checkoutProducts.map((product) => [product.slug, product])),
    [checkoutProducts],
  );
  const hasTrackedStart = useRef(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]?.value ?? "online-banking");

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
  const selectedPaymentOption =
    paymentOptions.find((option) => option.value === paymentMethod) ?? paymentOptions[0];

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

  async function recordCheckoutLead(formData: FormData) {
    const encodedForm = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      encodedForm.append(key, String(value));
    }

    encodedForm.set("form-name", "tara-cart-checkout");
    encodedForm.set("cart_items", JSON.stringify(cartLines));
    encodedForm.set("cart_total", formatRinggitFromSen(totalInSen));
    encodedForm.set("payment_method", selectedPaymentOption.value);

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
    trackCheckoutFormStart();

    if (!hasItems) {
      setStatus("error");
      setMessage("Your cart is empty. Add a TARA scent before checkout.");
      return;
    }

    if (!paymentsEnabled) {
      setStatus("error");
      setMessage("Secure checkout is being connected. Please use WhatsApp concierge for now.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      items: cartLines.map((item) => ({
        scentSlug: item.slug,
        quantity: item.quantity,
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
      paymentMethod: selectedPaymentOption.value,
      paymentChannel: selectedPaymentOption.channel,
    };

    try {
      await recordCheckoutLead(formData).catch(() => undefined);
      trackEvent(analyticsEvents.paymentCheckoutStart, {
        event_category: "commerce",
        provider: "toyyibpay",
        payment_method: selectedPaymentOption.value,
        item_count: itemCount,
        amount: totalInSen / 100,
      });

      const response = await fetch("/.netlify/functions/create-toyyibpay-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        error?: string;
        paymentUrl?: string;
      };

      if (!response.ok || !result.paymentUrl) {
        throw new Error(result.error ?? "Unable to start secure checkout.");
      }

      window.location.assign(result.paymentUrl);
    } catch (error) {
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
        onSubmit={handleSubmit}
        onFocusCapture={trackCheckoutFormStart}
        onChangeCapture={trackCheckoutFormStart}
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
        <input type="hidden" name="cart_items" value={JSON.stringify(cartLines)} />
        <input type="hidden" name="cart_total" value={formatRinggitFromSen(totalInSen)} />
        <input type="hidden" name="payment_method" value={selectedPaymentOption.value} />

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
              />
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
              />
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
            />
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
              />
            </label>
            <label className="space-y-3">
              <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                Address Line 2
              </span>
              <input
                className={fieldClassName}
                type="text"
                name="address_line_2"
                autoComplete="address-line2"
                required
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
              />
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
              />
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
              />
            </label>
          </div>
        </div>

        <div className="mt-10 border-y border-black/10 py-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            3 / Payment Method
          </p>
          <div className="mt-6 grid gap-3">
            {paymentOptions.map((option) => {
              const isSelected = paymentMethod === option.value;

              return (
                <label
                  key={option.value}
                  className={`cursor-pointer border px-4 py-4 transition duration-300 ${
                    isSelected
                      ? "border-[rgba(202,158,91,0.55)] bg-[rgba(202,158,91,0.08)]"
                      : "border-black/10 hover:border-white/22"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method_choice"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => setPaymentMethod(option.value)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-medium text-[var(--color-onyx-black)]">
                    {option.label}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-black/54">
                    {option.description}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <label className="mt-6 block space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Notes
          </span>
          <textarea
            className={`${fieldClassName} min-h-28 resize-y`}
            name="notes"
            placeholder="Optional: list your preferred 8mL trio, delivery preference, gifting note, or anything the house should know."
          />
        </label>

        <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
          <Button type="submit" variant="primary" disabled={status === "submitting"}>
            {status === "submitting" ? "Redirecting..." : "Checkout Securely"}
          </Button>
          <Button href="/cart" variant="secondary">
            Back To Cart
          </Button>
        </div>
        <p aria-live="polite" className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
          {status === "error" ? message : null}
        </p>
      </form>

      <aside className="sticky top-28 border-y border-[rgba(202,158,91,0.26)] py-6">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
          Order Summary
        </p>
        <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
          {cartLines.map((item) => (
            <article key={item.slug} className="grid grid-cols-[4.5rem_1fr] gap-4 py-4">
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
            <span>Payment</span>
            <span>{selectedPaymentOption.label}</span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-black/10 pt-4 text-[var(--color-onyx-black)]">
            <span className="text-xs uppercase tracking-[0.22em] text-black/46">
              Total
            </span>
            <span className="text-4xl font-medium tracking-[-0.06em]">
              {formatRinggitFromSen(totalInSen)}
            </span>
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-black/54">
          You will be redirected to ToyyibPay after checkout. TARA receives your
          delivery details before payment starts.
        </p>
      </aside>
    </div>
  );
}
