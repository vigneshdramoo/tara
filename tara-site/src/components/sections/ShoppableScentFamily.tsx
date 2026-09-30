"use client";
import { useState } from "react";
import { QuickAddButton } from "@/components/cart/QuickAddButton";
import { ScentImage } from "@/components/product/ScentImage";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { isLatestLaunch } from "@/lib/catalog";
import type { Scent } from "@/types/content";
const comparisonRows: Array<{
  label: string;
  getValue: (scent: Scent) => string;
}> = [
  {
    label: "Family",
    getValue: (scent) => scent.profile.family,
  },
  {
    label: "Temperature",
    getValue: (scent) => scent.profile.temperature,
  },
  {
    label: "Sweetness",
    getValue: (scent) => scent.profile.sweetness,
  },
  {
    label: "Presence",
    getValue: (scent) => scent.profile.presence,
  },
  {
    label: "Top",
    getValue: (scent) => scent.notes.top.join(" / ") || "See fragrance journey",
  },
  {
    label: "Heart",
    getValue: (scent) =>
      scent.notes.heart.join(" / ") || "See fragrance journey",
  },
  {
    label: "Base",
    getValue: (scent) =>
      scent.notes.base.join(" / ") || "See fragrance journey",
  },
  {
    label: "Mood",
    getValue: (scent) => scent.mood.join(" / "),
  },
  {
    label: "Occasion",
    getValue: (scent) => scent.wear.slice(0, 2).join(" / "),
  },
  {
    label: "Price",
    getValue: (scent) =>
      scent.launchPrice && scent.regularPrice
        ? `${scent.launchPrice} launch / ${scent.regularPrice} regular`
        : (scent.price ?? "See scent page"),
  },
];

export function ShoppableScentFamily({ scents }: { scents: Scent[] }) {
  const [filter, setFilter] = useState("All");
  const visible = scents.filter(
    (scent) =>
      filter === "All" ||
      [
        scent.profile.temperature,
        scent.profile.sweetness,
        scent.profile.presence,
      ].some((value) => value === filter),
  );
  return (
    <section
      id="scent-family"
      className="scroll-mt-28 border-b border-black/10 py-10 sm:py-16"
    >
      <Container>
        <p className="text-xs uppercase tracking-[0.25em] text-[#775426]">
          Scent Family
        </p>
        <h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] sm:text-6xl">
          Find the one that feels like you.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-black/70">
          Begin with our latest launches, THEON and KAMEIRA. Compare the family
          by warmth, sweetness, and presence.
        </p>
        <div
          role="group"
          aria-label="Filter scents by profile"
          className="mt-6 flex flex-wrap gap-2"
        >
          {[
            "All",
            "Warm",
            "Cool",
            "Soft",
            "Dry",
            "Skin-close",
            "Noticeable",
          ].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={`min-h-11 rounded-full border px-4 text-sm ${filter === value ? "border-black bg-black text-white" : "border-black/20"}`}
            >
              {value}
            </button>
          ))}
        </div>
        <p role="status" className="mt-4 text-sm text-black/70">
          {visible.length} scents
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {visible.map((scent) => (
            <article
              key={scent.slug}
              className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-black/15 bg-[#fbf8f1]"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#e9e1d4]">
                <ScentImage
                  asset={scent.visual}
                  sizes="(min-width:1280px) 24vw, (min-width:640px) 48vw, 100vw"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                {isLatestLaunch(scent.slug) && (
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#775426]">
                    Latest launch
                  </p>
                )}
                <h3 className="text-2xl font-medium">{scent.name}</h3>
                <p className="mt-2 text-sm leading-6">
                  {scent.slug === "kameira" ? scent.line : scent.profile.family}
                </p>
                <p className="mt-3 text-xs leading-6 text-black/70">
                  {scent.profile.temperature} · {scent.profile.sweetness} ·{" "}
                  {scent.profile.presence}
                </p>
                <p className="mt-4 text-sm font-semibold">
                  {scent.launchPrice ?? scent.price}
                  {scent.regularPrice && (
                    <span className="block text-xs font-normal leading-6 text-black/70">
                      Launch · {scent.regularPrice} regular
                    </span>
                  )}
                </p>
                <div className="mt-auto pt-5">
                  <QuickAddButton
                    slug={scent.slug}
                    ariaLabel={`Add ${scent.name} to cart`}
                    trackingLocation="homepage_shoppable_family"
                    className="w-full"
                  />
                  <Button
                    href={`/scents/${scent.slug}`}
                    variant="ghost"
                    size="sm"
                    className="mt-2 !w-full !text-[#775426]"
                    trackingLocation="homepage_shoppable_family"
                    trackingParams={{ selected_scent: scent.slug }}
                  >
                    View {scent.name}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <details className="mt-8 rounded-2xl border border-black/15 p-5">
          <summary className="cursor-pointer py-2 font-semibold">
            Compare notes, mood & occasion
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {scents.map((scent) => (
              <details
                key={scent.slug}
                className="rounded-xl border border-black/15 p-4"
              >
                <summary className="cursor-pointer py-2 font-medium">
                  {scent.name}
                </summary>
                <dl className="mt-3 space-y-3">
                  {comparisonRows
                    .filter(
                      (row) =>
                        !scent.fragranceJourney ||
                        !["Top", "Heart", "Base"].includes(row.label),
                    )
                    .map((row) => (
                      <div key={row.label}>
                        <dt className="text-xs font-semibold">{row.label}</dt>
                        <dd className="text-sm leading-6 text-black/70">
                          {row.getValue(scent)}
                        </dd>
                      </div>
                    ))}
                  {scent.fragranceJourney && (
                    <div>
                      <dt className="text-xs font-semibold">
                        Fragrance journey
                      </dt>
                      <dd className="text-sm leading-6">
                        {scent.fragranceJourney.join(" / ")}
                      </dd>
                    </div>
                  )}
                </dl>
                <Button
                  href={`/scents/${scent.slug}`}
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                >
                  View {scent.name}
                </Button>
              </details>
            ))}
          </div>
        </details>
      </Container>
    </section>
  );
}
