"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { brand } from "@/content/brand";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { cartStorageKey, getCartItemCount } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { trackCtaClick, trackWhatsAppClick } from "@/lib/analytics";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function readCartCount() {
      try {
        const savedCart = window.localStorage.getItem(cartStorageKey);
        const cartItems = savedCart
          ? (JSON.parse(savedCart) as Array<{ quantity?: number }>)
          : [];
        setCartCount(getCartItemCount(cartItems));
      } catch {
        setCartCount(0);
      }
    }

    function handleCartEvent(event: Event) {
      const itemCount = (event as CustomEvent<{ itemCount?: number }>).detail?.itemCount;

      if (typeof itemCount === "number") {
        setCartCount(itemCount);
        return;
      }

      readCartCount();
    }

    readCartCount();
    window.addEventListener("storage", readCartCount);
    window.addEventListener("tara:cart", handleCartEvent);

    return () => {
      window.removeEventListener("storage", readCartCount);
      window.removeEventListener("tara:cart", handleCartEvent);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[rgba(247,243,235,0.86)] backdrop-blur-xl">
      <Container className="flex items-center justify-between gap-2 py-4 sm:gap-4 sm:py-5">
        <Link href="/" className="group flex min-w-0 items-center">
          <Image
            src="/logos/tara-wordmark.png"
            alt={`${brand.name} wordmark with Illuminate the Unseen tagline`}
            width={2400}
            height={656}
            priority
            className="h-auto w-[146px] object-contain transition duration-300 group-hover:opacity-80 sm:w-[212px] xl:w-[220px]"
          />
        </Link>

        <nav className="hidden items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-black/56 xl:flex xl:gap-7 xl:tracking-[0.22em]">
          {brand.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition duration-300 hover:text-[var(--color-gold)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <SocialLinks links={brand.socialLinks} />
          <Link
            href="/cart"
            aria-label="View cart"
            onClick={() =>
              trackCtaClick({
                linkLabel: "View cart",
                linkLocation: "desktop_header",
                linkUrl: "/cart",
                linkType: "internal",
              })
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/12 bg-transparent text-[var(--color-gold)] transition duration-300 hover:border-[rgba(202,158,91,0.45)] hover:bg-[rgba(202,158,91,0.08)]"
          >
            <SiteIcon name="cart" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-gold)] px-1 text-[10px] font-semibold text-[var(--color-onyx-black)]">
                {cartCount}
              </span>
            ) : null}
          </Link>
          <Button
            href="/preorder"
            variant="primary"
            size="sm"
            trackingLocation="desktop_header"
          >
            Preorder
          </Button>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <a
            href={brand.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open WhatsApp Concierge"
            onClick={() =>
              trackWhatsAppClick({
                linkLabel: "Open WhatsApp Concierge",
                linkLocation: "mobile_header",
                linkUrl: brand.whatsappUrl,
              })
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/12 bg-transparent text-[var(--color-gold)]"
          >
            <SiteIcon name="whatsapp" />
          </a>
          <Link
            href="/cart"
            aria-label="View cart"
            onClick={() =>
              trackCtaClick({
                linkLabel: "View cart",
                linkLocation: "mobile_header",
                linkUrl: "/cart",
                linkType: "internal",
              })
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/12 bg-transparent text-[var(--color-gold)]"
          >
            <SiteIcon name="cart" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-gold)] px-1 text-[10px] font-semibold text-[var(--color-onyx-black)]">
                {cartCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/12 bg-transparent text-[var(--color-onyx-black)]"
          >
            <SiteIcon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-[73px] z-40 h-[calc(100svh-73px)] origin-top overflow-y-auto border-b border-black/10 bg-[var(--color-ivory)] px-4 pb-8 pt-4 shadow-[0_24px_80px_rgba(10,10,10,0.10)] transition duration-300 sm:top-[83px] sm:h-[calc(100svh-83px)] sm:px-6 sm:pb-10 sm:pt-6 xl:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <Container className="px-0">
          <nav className="grid gap-3">
            {brand.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-black/10 px-1 py-4 text-sm uppercase tracking-[0.18em] text-black/74 transition duration-300 hover:text-[var(--color-gold)] sm:tracking-[0.24em]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5">
            <Button
              href="/preorder"
              variant="primary"
              className="w-full"
              trackingLocation="mobile_menu"
            >
              Preorder
            </Button>
          </div>
          <SocialLinks links={brand.socialLinks} variant="inline" className="mt-5" />
        </Container>
      </div>
    </header>
  );
}
