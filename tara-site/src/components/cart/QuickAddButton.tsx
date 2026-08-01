"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  cartStorageKey,
  notifyCartChange,
  sanitizeCartItems,
  type CartItem,
} from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";
import { getCheckoutScents } from "@/lib/payments";

type QuickAddButtonProps = {
  slug: string;
  label?: string;
  addedLabel?: string;
  ariaLabel?: string;
  trackingLocation: string;
  className?: string;
};

const checkoutProducts = getCheckoutScents();
const productBySlug = new Map(checkoutProducts.map((product) => [product.slug, product]));

function readSavedCart() {
  try {
    const savedCart = window.localStorage.getItem(cartStorageKey);

    if (!savedCart) {
      return [];
    }

    return JSON.parse(savedCart) as CartItem[];
  } catch {
    window.localStorage.removeItem(cartStorageKey);
    return [];
  }
}

export function QuickAddButton({
  slug,
  label = "Add To Cart",
  addedLabel = "Added",
  ariaLabel,
  trackingLocation,
  className,
}: QuickAddButtonProps) {
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const product = productBySlug.get(slug);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function addToCart() {
    if (!product) {
      return;
    }

    const nextCart = sanitizeCartItems(
      [
        ...readSavedCart(),
        {
          slug,
          quantity: 1,
        },
      ],
      (productSlug) => productBySlug.has(productSlug),
    );

    window.localStorage.setItem(cartStorageKey, JSON.stringify(nextCart));
    notifyCartChange(nextCart);
    setAdded(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setAdded(false), 1800);

    trackEvent("add_to_cart", {
      event_category: "commerce",
      selected_scent: slug,
      item_name: product.name,
      amount: product.priceInSen / 100,
      link_location: trackingLocation,
    });
  }

  return (
    <Button
      type="button"
      variant="primary"
      size="sm"
      onClick={addToCart}
      disabled={!product}
      aria-live="polite"
      aria-label={ariaLabel ?? (product ? `Add ${product.name} to cart` : label)}
      className={className}
    >
      {added ? addedLabel : label}
    </Button>
  );
}
