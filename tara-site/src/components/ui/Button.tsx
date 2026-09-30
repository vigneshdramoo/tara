"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import {
  type AnalyticsEventName,
  analyticsEvents,
  isWhatsAppUrl,
  trackCtaClick,
  trackWhatsAppClick,
  type AnalyticsValue,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
  trackingLabel?: string;
  trackingLocation?: string;
  trackingEventName?: AnalyticsEventName;
  trackingParams?: Record<string, AnalyticsValue>;
  target?: string;
  rel?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  trackingLabel,
  trackingLocation,
  trackingEventName,
  trackingParams,
  target,
  rel,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "scent-button inline-flex w-full items-center justify-center rounded-full border text-center text-[11px] font-semibold uppercase tracking-[0.16em] transition duration-300 sm:w-auto sm:text-xs sm:tracking-[0.22em]",
    size === "md"
      ? "min-h-11 px-5 py-3 sm:min-h-12 sm:px-6"
      : "min-h-10 px-3.5 py-2.5 sm:px-4",
    variant === "primary" &&
      "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-onyx-black)] hover:border-[var(--color-amber)] hover:bg-[var(--color-amber)]",
    variant === "secondary" &&
      "border-black/18 bg-transparent text-[var(--color-onyx-black)] hover:border-[rgba(202,158,91,0.55)] hover:bg-[rgba(202,158,91,0.08)]",
    variant === "ghost" &&
      "border-transparent bg-transparent text-[var(--color-gold)] hover:border-[rgba(202,158,91,0.28)] hover:bg-[rgba(200,142,77,0.08)] hover:text-[var(--color-amber)]",
    className,
  );

  if (href) {
    const linkHref = href;
    const isExternalHref = linkHref.startsWith("http");
    const isWhatsAppHref = isWhatsAppUrl(linkHref);
    const inferredEventName =
      trackingEventName ??
      (linkHref.includes("three-8ml-promo")
        ? analyticsEvents.discoverySetClick
        : undefined);
    const label =
      trackingLabel ?? (typeof children === "string" ? children : undefined);
    const linkTarget = target ?? (isExternalHref ? "_blank" : undefined);
    const linkRel = rel ?? (linkTarget === "_blank" ? "noreferrer" : undefined);

    function handleLinkClick() {
      trackCtaClick({
        eventName: inferredEventName,
        linkLabel: label,
        linkLocation: trackingLocation ?? "button",
        linkUrl: linkHref,
        linkType: isWhatsAppHref
          ? "whatsapp"
          : isExternalHref
            ? "external"
            : "internal",
        ...trackingParams,
      });

      if (!isWhatsAppHref) {
        return;
      }

      trackWhatsAppClick({
        linkLabel: label,
        linkLocation: trackingLocation ?? "button",
        linkUrl: linkHref,
      });
    }

    if (isExternalHref) {
      return (
        <a
          href={linkHref}
          data-variant={variant}
          className={classes}
          target={linkTarget}
          rel={linkRel}
          onClick={handleLinkClick}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={linkHref}
        data-variant={variant}
        className={classes}
        onClick={handleLinkClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} data-variant={variant} className={classes} {...props}>
      {children}
    </button>
  );
}
