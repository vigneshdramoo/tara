import Link from "next/link";

import { purchaseReassurance } from "@/content/commercial";
import { cn } from "@/lib/utils";

type PurchaseReassuranceProps = {
  className?: string;
  compact?: boolean;
};

export function PurchaseReassurance({
  className,
  compact = false,
}: PurchaseReassuranceProps) {
  const items = compact
    ? [
        purchaseReassurance.shippingFeeSummary,
        purchaseReassurance.dispatchSummary,
        purchaseReassurance.paymentSummary,
      ]
    : [
        purchaseReassurance.shippingSummary,
        purchaseReassurance.dispatchSummary,
        purchaseReassurance.shippingFeeSummary,
        purchaseReassurance.returnSummary,
        purchaseReassurance.paymentSummary,
      ];

  return (
    <aside
      aria-label={purchaseReassurance.title}
      className={cn(
        "scent-panel rounded-[1.15rem] border scent-border border-black/10 bg-[rgba(255,250,241,0.58)] p-5",
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.26em] scent-label text-[var(--color-gold)]">
        {purchaseReassurance.title}
      </p>
      <ul
        className={cn(
          "mt-4 grid gap-3 text-sm leading-7 scent-copy text-black/60",
          compact ? "sm:grid-cols-2" : "sm:grid-cols-1",
        )}
      >
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="mt-5 divide-y scent-dividers divide-black/10 border-y scent-border border-black/10">
        {purchaseReassurance.decisionDetails.map((item) => (
          <details key={item.title} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.22em] scent-heading text-[var(--color-onyx-black)]">
              <span>{item.title}</span>
              <span className="scent-label text-[var(--color-gold)] transition duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-7 scent-copy text-black/60">
              {item.body}
            </p>
          </details>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {purchaseReassurance.policyLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border-b border-[rgba(202,158,91,0.42)] text-xs uppercase tracking-[0.2em] scent-label text-[var(--color-gold)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
