import type { Scent } from "@/types/content";
import { ScentComparisonTags } from "@/components/product/ScentComparisonTags";
import { cn } from "@/lib/utils";

type ProductProfileProps = {
  scent: Scent;
  className?: string;
};

export function ProductProfile({ scent, className }: ProductProfileProps) {
  const rows = [
    ["Family", scent.profile.family],
    ...(scent.fragranceJourney
      ? [["Scent Journey", scent.fragranceJourney.join(" → ")]]
      : [
          ["Top", scent.notes.top.join(", ")],
          ["Heart", scent.notes.heart.join(", ")],
          ["Base", scent.notes.base.join(", ")],
        ]),
    ["Mood", scent.mood.join(" / ")],
    ["Best With", scent.wear.join(" / ")],
    ["Presence", scent.profile.presence],
  ];

  return (
    <section
      className={cn("border-b scent-border border-black/10 py-8", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] scent-label text-[var(--color-gold)]">
            Scent Profile
          </p>
          <h2 className="mt-4 max-w-3xl text-[clamp(2.25rem,4.4vw,4.4rem)] font-medium leading-[0.9] tracking-[-0.06em] scent-heading text-[var(--color-onyx-black)]">
            {scent.profile.audienceLabel}
          </h2>
        </div>
        <ScentComparisonTags scent={scent} className="max-w-3xl" />
      </div>

      <dl className="mt-7 grid border-y scent-border border-black/10 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="border-t scent-border border-black/10 py-5 first:border-t-0 sm:border-l sm:px-5 sm:[&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(odd)]:border-l-0"
          >
            <dt className="text-xs uppercase tracking-[0.24em] scent-label text-[var(--color-gold)]">
              {label}
            </dt>
            <dd className="mt-3 text-sm leading-7 scent-copy text-black/60">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
