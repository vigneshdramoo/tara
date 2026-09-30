import type { Scent } from "@/types/content";
import { cn } from "@/lib/utils";

type ScentComparisonTagsProps = {
  scent: Scent;
  className?: string;
  tone?: "light" | "dark";
};

export function ScentComparisonTags({
  scent,
  className,
  tone = "light",
}: ScentComparisonTagsProps) {
  const tags = [
    scent.profile.audienceLabel,
    scent.profile.family,
    scent.profile.temperature,
    scent.profile.sweetness,
    scent.profile.presence,
    scent.profile.sampleAvailable ? "8mL sample available" : "Full bottle only",
  ];

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <li
          key={tag}
          className={cn(
            "scent-tag rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]",
            tone === "dark"
              ? "border-white/18 bg-white/10 text-white/78"
              : "scent-border border-black/10 bg-[rgba(255,250,241,0.62)] scent-copy text-black/58",
          )}
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
