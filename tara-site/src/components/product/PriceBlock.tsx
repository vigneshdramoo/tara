import type { Scent } from "@/types/content";
import { cn } from "@/lib/utils";

type PriceBlockProps = {
  scent?: Scent;
  label?: string;
  launchPrice?: string;
  regularPrice?: string;
  price?: string;
  size?: string;
  className?: string;
  compact?: boolean;
};

export function PriceBlock({
  scent,
  label = "Price",
  launchPrice = scent?.launchPrice,
  regularPrice = scent?.regularPrice,
  price = scent?.price,
  size = scent?.size,
  className,
  compact = false,
}: PriceBlockProps) {
  const rows: Array<[string, string | undefined]> = launchPrice
    ? [
        ["Launch", launchPrice],
        ["Regular", regularPrice],
        ["Format", size],
      ]
    : [
        [label, price],
        ["Format", size],
      ];

  return (
    <dl
      className={cn(
        "grid overflow-hidden border-y scent-border border-black/10",
        compact ? "sm:grid-cols-3" : "sm:grid-cols-1 md:grid-cols-3",
        className,
      )}
    >
      {rows
        .filter((row): row is [string, string] => Boolean(row[1]))
        .map(([rowLabel, value]) => (
          <div
            key={rowLabel}
            className="border-t scent-border border-black/10 py-4 first:border-t-0 sm:border-l sm:border-t-0 sm:px-4 sm:first:border-l-0"
          >
            <dt className="text-[10px] uppercase tracking-[0.24em] scent-copy text-black/42">
              {rowLabel}
            </dt>
            <dd
              className={cn(
                "mt-2 uppercase leading-6 tracking-[0.22em]",
                rowLabel === "Launch"
                  ? "text-xs scent-label text-[var(--color-gold)]"
                  : "text-xs scent-copy text-black/54",
              )}
            >
              {value}
            </dd>
          </div>
        ))}
    </dl>
  );
}
