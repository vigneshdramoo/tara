"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import type { Cta } from "@/types/content";
import { cn } from "@/lib/utils";

type StickyMobileCtaProps = {
  primary: Cta;
  secondary: Cta;
};

export function StickyMobileCta({ primary, secondary }: StickyMobileCtaProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      const threshold = Math.min(520, window.innerHeight * 0.58);
      setIsVisible(window.scrollY > threshold);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <>
      <div className="h-24 xl:hidden" aria-hidden="true" />
      <div
        data-mobile-sticky-cta="true"
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.8rem)] transition duration-500 xl:hidden",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        )}
        aria-hidden={!isVisible}
      >
        <div
          className={cn(
            "mx-auto grid max-w-md grid-cols-2 gap-2 border border-black/12 bg-[rgba(247,243,235,0.94)] p-2 shadow-[0_18px_60px_rgba(26,51,74,0.12)] backdrop-blur-xl",
            isVisible ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <Button
            href={primary.href}
            variant={primary.variant}
            size="sm"
            className="w-full"
            trackingLocation="sticky_mobile_cta"
          >
            {primary.label}
          </Button>
          <Button
            href={secondary.href}
            variant={secondary.variant}
            size="sm"
            className="w-full"
            trackingLocation="sticky_mobile_cta"
          >
            {secondary.label}
          </Button>
        </div>
      </div>
    </>
  );
}
