"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { brand } from "@/content/brand";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getScentBySlug } from "@/lib/catalog";
import {
  buildPreorderWhatsAppUrl,
  getPreorderScentName,
} from "@/lib/preorder";

export function PreorderSuccessContent() {
  const searchParams = useSearchParams();
  const hasTrackedSuccessView = useRef(false);
  const scentSlug = searchParams.get("scent") ?? undefined;
  const quantity = searchParams.get("quantity") ?? "1";
  const scent = scentSlug ? getScentBySlug(scentSlug) : undefined;
  const scentName = getPreorderScentName(scentSlug);
  const whatsappUrl = buildPreorderWhatsAppUrl({ scentSlug, quantity });

  useEffect(() => {
    if (hasTrackedSuccessView.current) {
      return;
    }

    hasTrackedSuccessView.current = true;
    trackEvent(analyticsEvents.preorderSuccessView, {
      event_category: "lead",
      selected_scent: scentSlug ?? "unknown",
      selected_scent_name: scentName,
      quantity: Number(quantity),
    });
  }, [quantity, scentName, scentSlug]);

  return (
    <main className="pb-24 pt-14 sm:pt-20">
      <Container>
        <div className="grid gap-10 border-y border-black/12 py-10 sm:py-14 xl:grid-cols-[0.95fr_1.05fr]">
          <section>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
              {brand.preorderPage.confirmation.eyebrow}
            </p>
            <h1 className="mt-5 max-w-3xl text-[2.7rem] font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--color-onyx-black)] sm:text-7xl sm:leading-none">
              {brand.preorderPage.confirmation.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
              {brand.preorderPage.confirmation.body}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-black/54">
              {brand.preorderPage.confirmation.note}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={whatsappUrl}
                variant="primary"
                trackingLabel={`WhatsApp ${scentName}`}
                trackingLocation="preorder_success"
              >
                Follow Up On WhatsApp
              </Button>
              <Button href="/scents" variant="secondary">
                Browse Scents
              </Button>
            </div>
          </section>

          <aside className="border-t border-black/12 pt-8 xl:border-l xl:border-t-0 xl:pl-10 xl:pt-0">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
              Request Summary
            </p>

            {scent ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-[10rem_1fr]">
                <div className="relative min-h-52 overflow-hidden border border-black/12">
                  <Image
                    src={scent.visual.src}
                    alt={scent.visual.alt}
                    fill
                    sizes="(min-width: 640px) 10rem, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.02),rgba(247,243,235,0.56))]" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-black/42">
                    {scent.profile.audienceLabel} / {scent.launch}
                  </p>
                  <h2 className="mt-3 font-editorial text-4xl leading-none">
                    {scent.name}
                  </h2>
                  <p className="mt-3 text-sm uppercase tracking-[0.2em] text-black/42">
                    Quantity {quantity}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-black/58">
                    {scent.summary}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 border-y border-black/12 py-6">
                <h2 className="text-4xl font-semibold leading-none tracking-[-0.04em]">
                  {scentName}
                </h2>
                <p className="mt-4 text-sm leading-7 text-black/58">
                  The concierge will help confirm the right TARA scent before
                  payment and delivery are finalized.
                </p>
              </div>
            )}

            <div className="mt-8 grid gap-4">
              {brand.preorderPage.confirmation.steps.map((step, index) => (
                <div
                  key={step}
                  className="border-t border-black/12 pt-5"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-black/42">
                    Next Step {index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-copy)]">
                    {step}
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
