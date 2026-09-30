"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

import {
  type AnalyticsEventName,
  analyticsEvents,
  isWhatsAppUrl,
  trackCtaClick,
  trackWhatsAppClick,
} from "@/lib/analytics";

type TrackedAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  trackingLabel?: string;
  trackingLocation?: string;
  trackingEventName?: AnalyticsEventName;
  children: ReactNode;
};

export function TrackedAnchor({
  href,
  trackingLabel,
  trackingLocation,
  trackingEventName,
  onClick,
  children,
  ...props
}: TrackedAnchorProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const isWhatsAppHref = isWhatsAppUrl(href);
    const inferredEventName =
      trackingEventName ??
      (href.includes("three-8ml-promo")
        ? analyticsEvents.discoverySetClick
        : undefined);

    trackCtaClick({
      eventName: inferredEventName,
      linkLabel: trackingLabel,
      linkLocation: trackingLocation ?? "tracked_anchor",
      linkUrl: href,
      linkType: isWhatsAppHref ? "whatsapp" : href.startsWith("http") ? "external" : "internal",
    });

    if (isWhatsAppHref) {
      trackWhatsAppClick({
        linkLabel: trackingLabel,
        linkLocation: trackingLocation,
        linkUrl: href,
      });
    }

    onClick?.(event);
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
