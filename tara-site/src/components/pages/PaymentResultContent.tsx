"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { discoverySetSlug, type DiscoveryConfiguration } from "@/lib/discovery";
import { brand } from "@/content/brand";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  cartStorageKey,
  notifyCartChange,
  cartLineKey,
  type CartItem,
} from "@/lib/cart";
import {
  formatRinggitFromSen,
  mapToyyibStatus,
  type PaymentResultStatus,
} from "@/lib/payments";

type PaymentVerification = {
  status: PaymentResultStatus;
  amountInSen?: number;
  channel?: string;
  invoiceNo?: string;
  billCode?: string;
  orderId?: string;
  items?: Array<{
    slug: string;
    name: string;
    quantity: number;
    priceInSen: number;
    configuration?: DiscoveryConfiguration & {
      scentNames: string[];
      selectionLabel: string;
    };
  }>;
};

const statusCopy: Record<
  PaymentResultStatus,
  { title: string; body: string; note: string }
> = {
  success: {
    title: "Payment received.",
    body: "Your order is in the house system. TARA can now confirm fulfillment, delivery, and any final details personally.",
    note: "Keep this page until the house confirms your order reference.",
  },
  pending: {
    title: "Payment is still processing.",
    body: "Your payment provider has not finalized the result yet. This usually resolves shortly after the hosted checkout finishes.",
    note: "If it takes longer than expected, message the house with your order reference.",
  },
  failed: {
    title: "Payment did not complete.",
    body: "The hosted checkout returned a failed result, so no order has been finalized yet.",
    note: "You can retry secure checkout or switch to concierge preorder.",
  },
  unknown: {
    title: "We are checking your payment status.",
    body: "The return data was incomplete, so TARA is verifying the result before treating it as a confirmed order.",
    note: "Use WhatsApp if you need an immediate confirmation.",
  },
};

export function PaymentResultContent() {
  const searchParams = useSearchParams();
  const clearedBill = useRef<string | null>(null);
  const hasTrackedView = useRef(false);
  const hasTrackedPaymentSuccess = useRef(false);
  const [verification, setVerification] = useState<PaymentVerification | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const billCode = searchParams.get("billcode");
  const orderId = searchParams.get("order_id");
  const statusId = searchParams.get("status_id");
  const fallbackStatus = useMemo(() => mapToyyibStatus(statusId), [statusId]);
  const trackedStatus =
    verification?.status ??
    (billCode && isLoading ? undefined : fallbackStatus);
  const status =
    verification?.status ??
    (fallbackStatus === "success" ? "unknown" : fallbackStatus);
  const copy = statusCopy[status];

  useEffect(() => {
    if (!billCode) {
      return;
    }

    const currentBillCode = billCode;
    let isCancelled = false;

    async function verifyPayment() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/.netlify/functions/get-toyyibpay-bill-status?billcode=${encodeURIComponent(currentBillCode)}`,
          {
            headers: (() => {
              try {
                const token = window.localStorage.getItem(
                  `tara-receipt-${currentBillCode}`,
                );
                return token ? { "X-Tara-Receipt": token } : {};
              } catch {
                return {};
              }
            })() as Record<string, string>,
          },
        );

        if (!response.ok) {
          throw new Error("Unable to verify payment.");
        }

        const data = (await response.json()) as PaymentVerification;

        if (!isCancelled) {
          setVerification(data);
        }
      } catch {
        if (!isCancelled) {
          setVerification(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void verifyPayment();

    return () => {
      isCancelled = true;
    };
  }, [billCode]);

  useEffect(() => {
    if (hasTrackedView.current || !trackedStatus) {
      return;
    }

    hasTrackedView.current = true;
    trackEvent(analyticsEvents.paymentStatusView, {
      event_category: "commerce",
      provider: "toyyibpay",
      payment_status: trackedStatus,
      bill_code: billCode ?? "missing",
      order_id: orderId ?? "missing",
    });
  }, [billCode, orderId, trackedStatus]);

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    if (clearedBill.current === billCode) return;
    try {
      const marker = `tara-paid-cart-${billCode}`;
      if (window.localStorage.getItem(marker)) {
        clearedBill.current = billCode;
        return;
      }
      const saved = JSON.parse(
        window.localStorage.getItem(cartStorageKey) ?? "[]",
      ) as CartItem[];
      if (!Array.isArray(saved)) return;
      if (
        saved.some((item) => item.slug === discoverySetSlug) &&
        !verification?.items
      )
        return;
      if (verification?.items) {
        const paid = new Map(
          verification.items.map((item) => [cartLineKey(item), item.quantity]),
        );
        const remaining = saved.flatMap((item) => {
          const quantity = item.quantity - (paid.get(cartLineKey(item)) ?? 0);
          return quantity > 0 ? [{ ...item, quantity }] : [];
        });
        if (remaining.length)
          window.localStorage.setItem(
            cartStorageKey,
            JSON.stringify(remaining),
          );
        else window.localStorage.removeItem(cartStorageKey);
        notifyCartChange(remaining);
      } else {
        window.localStorage.removeItem(cartStorageKey);
        notifyCartChange([]);
      }
      window.localStorage.setItem(marker, "1");
      clearedBill.current = billCode;
    } catch {
      /* Receipt remains visible when device storage is unavailable. */
    }
  }, [status, billCode, verification]);

  useEffect(() => {
    if (status !== "success" || hasTrackedPaymentSuccess.current) {
      return;
    }

    hasTrackedPaymentSuccess.current = true;
    trackEvent(analyticsEvents.paymentSuccess, {
      event_category: "commerce",
      provider: "toyyibpay",
      bill_code: billCode ?? "missing",
      order_id: orderId ?? "missing",
      amount: verification?.amountInSen
        ? verification.amountInSen / 100
        : undefined,
    });
  }, [billCode, orderId, status, verification?.amountInSen]);

  return (
    <main className="pb-24 pt-14 sm:pt-20">
      <Container>
        <div className="grid gap-10 border-y border-black/12 py-10 sm:py-14 xl:grid-cols-[0.92fr_1.08fr]">
          <section>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
              Payment Result
            </p>
            <h1 className="mt-5 max-w-3xl text-[2.7rem] font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--color-onyx-black)] sm:text-7xl sm:leading-none">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
              {copy.body}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-black/54">
              {copy.note}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={brand.whatsappUrl}
                variant="primary"
                trackingLocation="payment_result"
              >
                WhatsApp Concierge
              </Button>
              <Button href="/cart/checkout" variant="secondary">
                Retry Checkout
              </Button>
            </div>
          </section>

          <aside className="border-t border-black/12 pt-8 xl:border-l xl:border-t-0 xl:pl-10 xl:pt-0">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
                Payment Details
              </p>
              {isLoading ? (
                <span className="text-xs uppercase tracking-[0.22em] text-black/42">
                  Verifying...
                </span>
              ) : null}
            </div>

            {verification?.items && (
              <section className="mt-6" aria-label="Your order">
                <h2 className="text-xl font-medium">Your order</h2>
                {verification.items.map((item, index) => (
                  <article
                    key={`${item.slug}-${index}`}
                    className="border-b border-black/15 py-4"
                  >
                    <h3 className="font-semibold">
                      {item.name} × {item.quantity}
                    </h3>
                    {item.configuration && (
                      <p className="mt-2 text-sm leading-7">
                        {item.configuration.selectionLabel}
                      </p>
                    )}
                    <p className="mt-2 text-sm">
                      {formatRinggitFromSen(item.priceInSen * item.quantity)}
                    </p>
                  </article>
                ))}
              </section>
            )}
            <div className="mt-6 grid gap-4">
              <div className="border-y border-black/12 py-5">
                <p className="text-xs uppercase tracking-[0.22em] text-black/42">
                  Status
                </p>
                <p className="mt-3 text-3xl font-semibold uppercase tracking-[-0.03em] text-[var(--color-onyx-black)]">
                  {status}
                </p>
              </div>

              {verification?.amountInSen ? (
                <div className="border-b border-black/12 pb-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-black/42">
                    Amount
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--color-onyx-black)]">
                    {formatRinggitFromSen(verification.amountInSen)}
                  </p>
                </div>
              ) : null}

              {[
                {
                  label: "Order Reference",
                  value: verification?.orderId ?? orderId ?? undefined,
                },
                {
                  label: "Bill Code",
                  value: verification?.billCode ?? billCode ?? undefined,
                },
                { label: "Payment Channel", value: verification?.channel },
                { label: "Invoice", value: verification?.invoiceNo },
              ]
                .filter((item) => item.value)
                .map((item) => (
                  <div
                    key={item.label}
                    className="border-b border-black/12 pb-5"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-black/42">
                      {item.label}
                    </p>
                    <p className="mt-3 text-base leading-8 text-[var(--color-copy)]">
                      {item.value}
                    </p>
                  </div>
                ))}
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
