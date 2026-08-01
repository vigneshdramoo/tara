"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { trackPageView } from "@/lib/analytics";

type RouteAnalyticsProps = {
  measurementId?: string;
};

export function RouteAnalytics({ measurementId }: RouteAnalyticsProps) {
  const pathname = usePathname();
  const hasSkippedInitialPageview = useRef(false);
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!measurementId || !pathname) {
      return;
    }

    const url = `${window.location.origin}${pathname}${window.location.search}`;

    if (!hasSkippedInitialPageview.current) {
      hasSkippedInitialPageview.current = true;
      lastTrackedUrl.current = url;
      return;
    }

    if (lastTrackedUrl.current === url) {
      return;
    }

    lastTrackedUrl.current = url;
    trackPageView(url);
  }, [measurementId, pathname]);

  return null;
}
