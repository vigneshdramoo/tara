import type { Metadata } from "next";

import { HiringConfirmationForm } from "@/components/forms/HiringConfirmationForm";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { scentTrailStops } from "@/content/popup";
import { absoluteUrl } from "@/lib/utils";

const pageUrl = absoluteUrl("/tara-and-friends");
const applicationTrailStop =
  scentTrailStops.find((trailStop) => trailStop.stop === "Stop 06") ?? scentTrailStops[5];

export const metadata: Metadata = {
  title: "TARA Scent Trail: Stop 06 Crew Confirmation",
  description:
    "Private TARA Scent Trail: Stop 06 crew application and confirmation form for selected part-time fragrance promoters.",
  alternates: {
    canonical: pageUrl,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TaraAndFriendsPage() {
  return (
    <>
      <PageHero
        eyebrow={`TARA Scent Trail: ${applicationTrailStop.stop}`}
        title="Crew confirmation."
        body="A private crew application and confirmation page for TARA Scent Trail: Stop 06."
        note={`TARA Scent Trail: ${applicationTrailStop.stop} / ${applicationTrailStop.status} / ${applicationTrailStop.dates} / ${applicationTrailStop.venue}.`}
      />
      <section className="border-y border-white/10 py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
                TARA Scent Trail: Stops 01-12
              </p>
              <h2 className="mt-4 max-w-md font-editorial text-4xl font-medium leading-none text-[var(--color-ivory)] sm:text-5xl">
                Twelve stops. One growing scent story.
              </h2>
            </div>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {scentTrailStops.map((trailStop) => (
                <article
                  key={trailStop.stop}
                  className="grid gap-4 py-6 sm:grid-cols-[0.22fr_0.56fr_0.22fr] sm:items-start"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                      TARA Scent Trail: {trailStop.stop}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium tracking-[-0.03em] text-[var(--color-ivory)]">
                      {trailStop.venue}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-copy)]">
                      {trailStop.dates}
                      <br />
                      {trailStop.hours}
                    </p>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/54 sm:text-right">
                    Status: {trailStop.status}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section className="py-16 sm:py-24">
        <Container className="mx-auto max-w-3xl">
          <div className="border-y border-black/10 py-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
              TARA Scent Trail: Stop 06 Application
            </p>
            <h2 className="mt-4 font-editorial text-4xl font-medium leading-none text-[var(--color-onyx-black)] sm:text-5xl">
              Crew confirmation is open.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--color-copy)]">
              Selected crew can complete the form below for TARA Scent Trail:
              Stop 06 at The Street, The Curve.
            </p>
          </div>
          <div className="mt-10">
            <HiringConfirmationForm />
          </div>
        </Container>
      </section>
    </>
  );
}
