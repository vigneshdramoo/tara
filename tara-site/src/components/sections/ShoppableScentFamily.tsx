import Image from "next/image";
import Link from "next/link";

import { QuickAddButton } from "@/components/cart/QuickAddButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";
import type { Scent } from "@/types/content";

type ShoppableScentFamilyProps = {
  scents: Scent[];
};

const comparisonRows: Array<{
  label: string;
  getValue: (scent: Scent) => string;
}> = [
  {
    label: "Top",
    getValue: (scent) => scent.notes.top.join(" / "),
  },
  {
    label: "Heart",
    getValue: (scent) => scent.notes.heart.join(" / "),
  },
  {
    label: "Base",
    getValue: (scent) => scent.notes.base.join(" / "),
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
      `${scent.launchPrice ?? scent.price} launch / ${scent.regularPrice} regular`,
  },
];

export function ShoppableScentFamily({ scents }: ShoppableScentFamilyProps) {
  return (
    <section className="border-b border-black/10 py-16 sm:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.34fr_1fr] lg:items-end">
          <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-gold)]">
            Scent Family
          </p>
          <div>
            <h2 className="max-w-5xl text-[clamp(3.2rem,8vw,7.1rem)] font-medium leading-[0.86] tracking-[-0.07em] text-balance">
              Seven bottles. One click closer.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
              Each 50mL scent is clickable, comparable, and ready to add to cart.
              Start with the bottle that matches your mood, or compare the full
              family before choosing.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {scents.map((scent) => {
            const visual = scent.homeVisual ?? scent.visual;

            return (
              <article
                key={scent.slug}
                className="group relative overflow-hidden rounded-[1.35rem] border border-black/10 bg-[rgba(255,250,241,0.54)] shadow-[0_18px_70px_rgba(26,51,74,0.06)] sm:rounded-[1.8rem]"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={visual.src}
                    alt={visual.alt}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.02)_0%,rgba(247,243,235,0.16)_48%,rgba(10,10,10,0.58)_100%)]" />
                  <Link
                    href={`/scents/${scent.slug}`}
                    aria-label={`Explore ${scent.name}`}
                    className="absolute inset-0 z-10"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 text-[var(--color-ivory)] sm:p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      {scent.isNew ? (
                        <span className="rounded-full border border-[#CA9E5B]/50 bg-[#F7F3EB]/88 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-[#CA9E5B] backdrop-blur-sm">
                          New
                        </span>
                      ) : null}
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-gold)]">
                        {scent.audience}
                      </p>
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <h3 className="font-editorial text-4xl leading-none">
                          {scent.name}
                        </h3>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/72">
                          {scent.launchPrice} / {scent.regularPrice} regular
                        </p>
                      </div>
                      <SiteIcon
                        name="arrowUpRight"
                        className="h-5 w-5 text-[var(--color-gold)]"
                      />
                    </div>
                    <div className="pointer-events-auto mt-4 grid gap-2 opacity-100 transition duration-300 sm:pointer-events-none sm:translate-y-2 sm:opacity-0 sm:group-hover:pointer-events-auto sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:pointer-events-auto sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
                      <QuickAddButton
                        slug={scent.slug}
                        ariaLabel={`Add ${scent.name} from scent family to cart`}
                        trackingLocation="homepage_shoppable_family"
                        className="w-full border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-onyx-black)]"
                      />
                      <Button
                        href={`/scents/${scent.slug}`}
                        variant="secondary"
                        size="sm"
                        className="w-full border-white/22 bg-white/10 text-white hover:bg-white/16"
                        trackingLocation="homepage_shoppable_family"
                        trackingParams={{ selected_scent: scent.slug }}
                      >
                        Explore
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 grid gap-3 lg:hidden">
          {scents.map((scent) => (
            <details
              key={scent.slug}
              className="group rounded-[1.15rem] border border-black/10 bg-[rgba(255,250,241,0.62)] p-4 open:bg-[rgba(202,158,91,0.06)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span>
                  <span className="block font-editorial text-3xl leading-none">
                    {scent.name}
                  </span>
                  <span className="mt-2 block text-[10px] uppercase tracking-[0.22em] text-[var(--color-gold)]">
                    {scent.isNew ? "New / " : ""}
                    {scent.audience} / {scent.launchPrice}
                  </span>
                </span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/12 text-lg leading-none text-[var(--color-gold)] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <dl className="mt-5 grid gap-3">
                {comparisonRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-1 border-t border-black/10 pt-3"
                  >
                    <dt className="text-[10px] uppercase tracking-[0.24em] text-black/42">
                      {row.label}
                    </dt>
                    <dd className="text-sm leading-7 text-black/64">
                      {row.getValue(scent)}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 grid gap-2">
                <QuickAddButton
                  slug={scent.slug}
                  ariaLabel={`Add ${scent.name} from mobile scent comparison to cart`}
                  trackingLocation="homepage_mobile_scent_comparison"
                  className="w-full border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-onyx-black)]"
                />
                <Button
                  href={`/scents/${scent.slug}`}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  trackingLocation="homepage_mobile_scent_comparison"
                  trackingParams={{ selected_scent: scent.slug }}
                >
                  Explore Notes
                </Button>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 hidden overflow-x-auto border-y border-black/10 lg:block">
          <table className="min-w-[1180px] w-full border-collapse text-left">
            <caption className="sr-only">
              TARA scent comparison by top, heart, base, mood, occasion, and price.
            </caption>
            <thead>
              <tr className="border-b border-black/10">
                <th className="w-40 py-5 pr-5 text-[10px] uppercase tracking-[0.24em] text-black/42">
                  Compare
                </th>
                {scents.map((scent) => (
                  <th
                    key={scent.slug}
                    className="min-w-44 border-l border-black/10 px-5 py-5 text-[10px] uppercase tracking-[0.24em] text-[var(--color-gold)]"
                  >
                    {scent.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label} className="border-b border-black/10 last:border-b-0">
                  <th className="py-5 pr-5 text-[10px] uppercase tracking-[0.24em] text-black/42">
                    {row.label}
                  </th>
                  {scents.map((scent) => (
                    <td
                      key={scent.slug}
                      className="border-l border-black/10 px-5 py-5 text-sm leading-7 text-black/62"
                    >
                      {row.getValue(scent)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
