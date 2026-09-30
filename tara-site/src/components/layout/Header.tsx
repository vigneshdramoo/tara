"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { commercialOffers } from "@/content/commercial";
import { brand } from "@/content/brand";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { cartStorageKey, getCartItemCount } from "@/lib/cart";

import { trackCtaClick } from "@/lib/analytics";

export function Header() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (menuOpen) dialog?.showModal();
    else if (dialog?.open) {
      dialog.close();
      triggerRef.current?.focus();
    }
    document.body.toggleAttribute("data-menu-open", menuOpen);
    const previousOverflow = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onResize = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.removeAttribute("data-menu-open");
      desktop.removeEventListener("change", onResize);
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
      const itemCount = (event as CustomEvent<{ itemCount?: number }>).detail
        ?.itemCount;

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
      <Link
        href={brand.home.eightMlPromo.primary.href}
        className="block bg-[#211e19] px-4 py-2 text-center text-[10px] leading-5 text-[#f7f3eb] sm:text-xs"
      >
        THEON + KAMEIRA · Latest launches · Try 3 samples for{" "}
        {commercialOffers.discoverySet.price}
      </Link>
      <Container className="flex items-center justify-between gap-2 py-3 sm:gap-4 sm:py-4">
        <Link href="/" className="group flex min-w-0 items-center">
          <Image
            src="/logos/tara-wordmark.png"
            alt={`${brand.name} wordmark with Illuminate the Unseen tagline`}
            width={2400}
            height={656}
            priority
            className="h-auto w-[100px] object-contain transition duration-300 group-hover:opacity-80 sm:w-[212px] xl:w-[220px]"
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
          <Link
            href="/preorder"
            className="flex min-h-11 items-center rounded-full bg-[var(--color-gold)] px-3 text-[10px] font-semibold uppercase"
          >
            Preorder
          </Link>
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
            ref={triggerRef}
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/12 bg-transparent text-[var(--color-onyx-black)]"
          >
            <SiteIcon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </Container>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label="Main menu"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex="0"]',
            ),
          );
          const first = controls[0];
          const last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onCancel={() => setMenuOpen(false)}
        onClose={() => setMenuOpen(false)}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) setMenuOpen(false);
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-[var(--color-ivory)] p-6 text-[var(--color-onyx-black)] backdrop:bg-black/40"
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xl font-medium">TARA</p>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/20"
          >
            <SiteIcon name="close" />
          </button>
        </div>
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
          <SocialLinks
            links={brand.socialLinks}
            variant="inline"
            className="mt-5"
          />
        </Container>
      </dialog>
    </header>
  );
}
