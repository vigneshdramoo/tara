"use client";

import type { SocialLink } from "@/types/content";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { isWhatsAppUrl, trackCtaClick, trackWhatsAppClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type SocialLinksProps = {
  links: SocialLink[];
  variant?: "icon" | "inline";
  className?: string;
};

export function SocialLinks({
  links,
  variant = "icon",
  className,
}: SocialLinksProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        variant === "inline" && "gap-4",
        className,
      )}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={link.label}
          onClick={() => {
            const isWhatsAppHref = isWhatsAppUrl(link.href);
            const linkLocation = variant === "inline" ? "social_inline" : "social_icon";

            trackCtaClick({
              linkLabel: link.label,
              linkLocation,
              linkUrl: link.href,
              linkType: isWhatsAppHref ? "whatsapp" : "external",
            });

            if (!isWhatsAppHref) {
              return;
            }

            trackWhatsAppClick({
              linkLabel: link.label,
              linkLocation,
              linkUrl: link.href,
            });
          }}
          className={cn(
            "transition duration-300 hover:text-[var(--color-gold)]",
            variant === "icon" &&
              "flex h-10 w-10 items-center justify-center border border-black/14 bg-transparent text-[var(--color-gold)] hover:border-[rgba(202,158,91,0.45)] hover:bg-[rgba(202,158,91,0.06)]",
            variant === "inline" &&
              "inline-flex items-center gap-2 text-sm text-black/68 hover:text-[var(--color-gold)]",
          )}
        >
          <SiteIcon name={link.icon} className="h-4 w-4" />
          {variant === "inline" ? <span>{link.label}</span> : null}
        </a>
      ))}
    </div>
  );
}
