import { conciergeAssistance } from "@/content/commercial";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ConciergeCalloutProps = {
  className?: string;
  scentName?: string;
  trackingLocation?: string;
};

export function ConciergeCallout({
  className,
  scentName,
  trackingLocation = "concierge_callout",
}: ConciergeCalloutProps) {
  const href = scentName
    ? `${conciergeAssistance.primary.href}%20I%27m%20considering%20${encodeURIComponent(scentName)}.`
    : conciergeAssistance.primary.href;

  return (
    <aside
      className={cn(
        "scent-panel rounded-[1.15rem] border scent-border border-black/10 bg-[rgba(255,250,241,0.58)] p-5",
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.26em] scent-label text-[var(--color-gold)]">
        Concierge
      </p>
      <h3 className="mt-4 text-3xl font-medium leading-none tracking-[-0.05em] scent-heading text-[var(--color-onyx-black)]">
        {conciergeAssistance.title}
      </h3>
      <p className="mt-4 text-sm leading-7 scent-copy text-black/60">
        {conciergeAssistance.body}
      </p>
      <p className="mt-3 text-xs uppercase leading-6 tracking-[0.18em] scent-copy text-black/42">
        {conciergeAssistance.note}
      </p>
      <div className="mt-5">
        <Button
          href={href}
          variant={conciergeAssistance.primary.variant}
          size="sm"
          trackingLocation={trackingLocation}
          trackingLabel={conciergeAssistance.primary.label}
        >
          {conciergeAssistance.primary.label}
        </Button>
      </div>
    </aside>
  );
}
