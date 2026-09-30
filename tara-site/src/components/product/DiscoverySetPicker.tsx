"use client";
import { useEffect, useRef, useState } from "react";
import { ScentImage } from "@/components/product/ScentImage";
import { Button } from "@/components/ui/Button";
import { commercialOffers } from "@/content/commercial";
import {
  discoveryDraftKey,
  discoverySelectionType,
  eligibleDiscoveryScents,
  validateDiscovery,
  type DiscoveryConfiguration,
} from "@/lib/discovery";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

export function DiscoverySetPicker({
  onAdd,
  ready,
}: {
  onAdd: (configuration: DiscoveryConfiguration) => boolean;
  ready: boolean;
}) {
  const currentIds = useRef<string[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const submitted = useRef(false);
  const trackedView = useRef(false);
  const trackedStart = useRef(false);
  const selection = { type: discoverySelectionType, scentIds: ids };
  const valid = validateDiscovery(selection).valid;
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const raw = JSON.parse(
          window.localStorage.getItem(discoveryDraftKey) ?? "[]",
        );
        const unique: string[] = Array.isArray(raw)
          ? [
              ...new Set<string>(
                raw.filter((id): id is string => typeof id === "string"),
              ),
            ]
          : [];
        const available = unique
          .filter((id) =>
            eligibleDiscoveryScents.some((scent) => scent.slug === id),
          )
          .slice(0, 3);
        currentIds.current = available;
        setIds(available);
        if (available.length !== unique.length)
          setMessage(
            "One selected scent is no longer available. Please choose a replacement.",
          );
      } catch {
        setMessage(
          "We could not restore your selection. Please choose your scents again.",
        );
      }
      setHydrated(true);
      if (!trackedView.current) {
        trackedView.current = true;
        trackEvent(analyticsEvents.discoverySetView, {
          selection_type: discoverySelectionType,
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
  function toggle(id: string) {
    if (!hydrated) return;
    const ids = currentIds.current;
    const isSelected = ids.includes(id);
    if (!isSelected && ids.length === 3) {
      setMessage(
        "You can choose up to 3 scents. Remove one to choose another.",
      );
      return;
    }
    const next = isSelected
      ? ids.filter((value) => value !== id)
      : [...ids, id];
    currentIds.current = next;
    setIds(next);
    setAdded(false);
    submitted.current = false;
    try {
      window.localStorage.setItem(discoveryDraftKey, JSON.stringify(next));
      setMessage("");
    } catch {
      setMessage("We could not save your selection. Please try again.");
    }
    if (!trackedStart.current) {
      trackedStart.current = true;
      trackEvent(analyticsEvents.discoverySetSelectionStarted, {
        selection_type: discoverySelectionType,
      });
    }
    trackEvent(
      isSelected
        ? analyticsEvents.discoverySetScentDeselected
        : analyticsEvents.discoverySetScentSelected,
      { scent_id: id, selected_count: next.length },
    );
    if (next.length === 3)
      trackEvent(analyticsEvents.discoverySetSelectionCompleted, {
        selected_count: 3,
      });
  }
  function add() {
    if (!valid || submitted.current || !ready) return;
    submitted.current = true;
    if (onAdd(selection)) {
      setAdded(true);
      setMessage(
        "Your 3-scent set is in the cart. Review it below or change a scent to create another set.",
      );
    } else {
      submitted.current = false;
      setMessage("We could not save your selection. Please try again.");
    }
  }
  return (
    <fieldset
      id="discovery-selection"
      className="mt-8 min-w-0 rounded-2xl border border-black/20 bg-[#fbf8f1] p-4 sm:p-6"
      disabled={!hydrated || !ready}
    >
      <legend className="px-2 text-2xl font-medium">
        Choose your 3 discovery scents
      </legend>
      <p className="text-sm leading-7 text-black/75">
        Pick any three different 8mL scents. You can change your selection
        before adding the set to cart.
      </p>
      <noscript>
        <p className="py-4">
          Enable JavaScript to select your trio and use the cart, or contact the
          WhatsApp concierge below for help.
        </p>
      </noscript>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-black/15 py-3 text-sm">
        <p aria-live="polite">
          {ids.length} of 3 selected · {commercialOffers.discoverySet.price} per
          set
        </p>
        <a
          href="#discovery-summary"
          className="inline-flex min-h-11 items-center font-semibold underline"
        >
          Review my trio ↓
        </a>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {eligibleDiscoveryScents.map((scent) => {
          const selected = ids.includes(scent.slug);
          return (
            <label
              key={scent.slug}
              className={`relative flex cursor-pointer flex-col overflow-hidden rounded-xl border-2 p-3 focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[#775426] ${selected ? "border-[#775426] bg-[#eee2ce]" : "border-black/15"}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <ScentImage
                  asset={scent.visual}
                  sizes="(min-width:1280px) 22vw, (min-width:640px) 42vw, 85vw"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="mt-3 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggle(scent.slug)}
                  aria-label={scent.name}
                  className="h-5 w-5 shrink-0 accent-[#775426]"
                />
                <span className="font-semibold">{scent.name}</span>
                {selected && (
                  <span className="ml-auto text-xs font-medium">Selected</span>
                )}
              </span>
              <span className="mt-2 text-sm leading-6 text-black/75">
                {scent.profile.family} · {scent.profile.temperature}
              </span>
              <span className="mt-1 text-sm font-semibold leading-6">
                In stock
              </span>
            </label>
          );
        })}
      </div>
      <div
        id="discovery-summary"
        className="mt-6 scroll-mt-36 border-t border-black/15 pt-5"
      >
        <p className="font-semibold">{ids.length} of 3 selected</p>
        <p className="mt-2 min-h-6 text-sm leading-7">
          {ids.length
            ? ids
                .map(
                  (id) =>
                    eligibleDiscoveryScents.find((scent) => scent.slug === id)
                      ?.name,
                )
                .join(" · ")
            : "Choose 3 scents to continue."}
        </p>
        <p className="mt-2 text-sm">
          {commercialOffers.discoverySet.price} per set before shipping. Each
          set contains this same trio.
        </p>
        <Button
          onClick={add}
          disabled={!valid || !hydrated || !ready || added}
          className="mt-4 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {added
            ? "Set added to cart"
            : `Add 3-scent set to cart — ${commercialOffers.discoverySet.price}`}
        </Button>
        <p role="status" aria-live="polite" className="mt-3 text-sm leading-7">
          {message}
        </p>
        {added ? (
          <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap">
            <Button href="/cart" variant="secondary" size="sm">
              View cart
            </Button>
            <Button href="/cart/checkout" variant="primary" size="sm">
              Checkout
            </Button>
          </div>
        ) : null}
      </div>
    </fieldset>
  );
}
