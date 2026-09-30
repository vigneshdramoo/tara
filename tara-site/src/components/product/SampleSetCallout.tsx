import { commercialOffers } from "@/content/commercial";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type SampleSetCalloutProps = {
  className?: string;
  trackingLocation?: string;
};

export function SampleSetCallout({
  className,
  trackingLocation = "sample_set_callout",
}: SampleSetCalloutProps) {
  const sampleSet = commercialOffers.discoverySet;

  return (
    <aside
      className={cn(
        "scent-panel rounded-[1.15rem] border border-[rgba(202,158,91,0.28)] bg-[rgba(202,158,91,0.08)] p-5",
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.26em] scent-label text-[var(--color-gold)]">
        Sample Before Commitment
      </p>
      <h3 className="mt-4 text-3xl font-medium leading-none tracking-[-0.05em] scent-heading text-[var(--color-onyx-black)]">
        {sampleSet.name} / {sampleSet.price}
      </h3>
      <p className="mt-4 text-sm leading-7 scent-copy text-black/60">
        {sampleSet.summary}
      </p>
      <div className="mt-5">
        <Button
          href={`/preorder?checkout=${sampleSet.slug}#secure-checkout`}
          variant="primary"
          size="sm"
          trackingLocation={trackingLocation}
          trackingLabel="Try 3 x 8mL"
        >
          Try 3 x 8mL
        </Button>
      </div>
    </aside>
  );
}
