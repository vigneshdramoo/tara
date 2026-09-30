"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Scent } from "@/types/content";
import { useRef, useState } from "react";
import type { ScentGalleryAsset } from "@/types/content";
import { ScentImage } from "@/components/product/ScentImage";

function InteractiveScentGallery({
  name,
  slug,
  images,
}: {
  name: string;
  slug: string;
  images: ScentGalleryAsset[];
}) {
  const [active, setActive] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (index: number, focus = false) => {
    const next = (index + images.length) % images.length;
    setActive(next);
    if (focus) buttons.current[next]?.focus();
  };
  const item = images[active];
  return (
    <section
      id={`${slug}-gallery`}
      aria-label={`${name} product gallery`}
      className="min-w-0 scroll-mt-28"
    >
      <figure>
        <div
          className="scent-gallery-surface aspect-[4/5] overflow-hidden rounded-[1.35rem] border border-black/10 bg-[#F7F3EB]"
          onTouchStart={(event) => {
            touchStart.current = {
              x: event.touches[0].clientX,
              y: event.touches[0].clientY,
            };
          }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start) return;
            const dx = event.changedTouches[0].clientX - start.x;
            const dy = event.changedTouches[0].clientY - start.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
              select(active + (dx < 0 ? 1 : -1));
          }}
        >
          <ScentImage
            asset={item}
            sizes="(min-width: 1200px) 440px, (min-width: 1024px) 40vw, (min-width: 640px) calc(100vw - 64px), calc(100vw - 32px)"
            priority={active === 0}
            className="h-full w-full object-contain"
          />
        </div>
        <figcaption
          aria-live="polite"
          aria-atomic="true"
          className="scent-copy mt-3 flex items-center justify-between gap-3 text-xs text-[#4A1828]"
        >
          <button
            type="button"
            aria-label="Previous product image"
            onClick={() => select(active - 1)}
            className="scent-gallery-control min-h-11 min-w-11 rounded border border-[#4A1828]/30 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ←
          </button>
          <span>
            {active + 1} / {images.length} — {item.title}
          </span>
          <button
            type="button"
            aria-label="Next product image"
            onClick={() => select(active + 1)}
            className="scent-gallery-control min-h-11 min-w-11 rounded border border-[#4A1828]/30 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            →
          </button>
        </figcaption>
      </figure>
      <div
        className="mt-3 flex snap-x gap-2 overflow-x-auto p-1 pb-3"
        aria-label="Choose product image"
      >
        {images.map((image, index) => (
          <button
            key={image.src}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            aria-label={`View ${image.title}`}
            aria-pressed={index === active}
            onClick={() => select(index)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? index + 1
                  : event.key === "ArrowLeft"
                    ? index - 1
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? images.length - 1
                        : null;
              if (next !== null) {
                event.preventDefault();
                select(next, true);
              }
            }}
            className={`scent-thumbnail w-16 shrink-0 snap-start overflow-hidden rounded-lg border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A1828] ${index === active ? "border-[#4A1828]" : "border-transparent"}`}
          >
            <ScentImage
              asset={{ ...image, alt: "" }}
              sizes="64px"
              className="scent-gallery-surface aspect-[4/5] h-auto w-full object-contain"
            />
          </button>
        ))}
      </div>
    </section>
  );
}

// Preserve the existing gallery for other fragrances; opt into interactive media per scent.
export function ScentGallery({ scent }: { scent: Scent }) {
  if (scent.interactiveGallery && scent.gallery) {
    return (
      <InteractiveScentGallery
        name={scent.name}
        slug={scent.slug}
        images={scent.gallery}
      />
    );
  }
  return (
    <div className="xl:sticky xl:top-28">
      <div className="relative aspect-square overflow-hidden rounded-[1.35rem] border border-black/10 sm:rounded-[1.8rem]">
        <Image
          src={scent.visual.src}
          alt={scent.visual.alt}
          fill
          sizes="(min-width: 1280px) 42vw, 100vw"
          className={cn(
            scent.visual.fit === "contain" ? "object-contain" : "object-cover",
          )}
          style={
            scent.visual.position
              ? { objectPosition: scent.visual.position }
              : undefined
          }
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.04),rgba(247,243,235,0.34))]" />
      </div>
      {scent.gallery?.length ? (
        <div className="mt-5" aria-label={`${scent.name} image carousel`}>
          <div className="flex snap-x gap-3 overflow-x-auto pb-3">
            {scent.gallery.map((item) => (
              <figure
                key={item.src}
                className="w-[10.25rem] shrink-0 snap-start sm:w-[11.5rem]"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-black/10 bg-white/40">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 42vw, 184px"
                    className={cn(
                      item.fit === "contain"
                        ? "object-contain"
                        : "object-cover",
                    )}
                    style={
                      item.position
                        ? { objectPosition: item.position }
                        : undefined
                    }
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                    {item.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-black/55">
                    {item.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
