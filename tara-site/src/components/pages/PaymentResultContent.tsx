"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { brand } from "@/content/brand";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cartStorageKey, notifyCartChange } from "@/lib/cart";
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
  const hasTrackedView = useRef(false);
  const hasTrackedPaymentSuccess = useRef(false);
  const [verification, setVerification] = useState<PaymentVerification | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const billCode = searchParams.get("billcode");
  const orderId = searchParams.get("order_id");
  const statusId = searchParams.get("status_id");
  const fallbackStatus = useMemo(() => mapToyyibStatus(statusId), [statusId]);
  const trackedStatus =
    verification?.status ?? (billCode && isLoading ? undefined : fallbackStatus);
  const status = verification?.status ?? fallbackStatus;
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

    window.localStorage.removeItem(cartStorageKey);
    notifyCartChange([]);
  }, [status]);

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
                { label: "Order Reference", value: verification?.orderId ?? orderId ?? undefined },
                { label: "Bill Code", value: verification?.billCode ?? billCode ?? undefined },
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
