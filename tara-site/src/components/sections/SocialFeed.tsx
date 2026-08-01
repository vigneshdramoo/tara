"use client";

/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useEffect, useState } from "react";

import type { BrandContent } from "@/types/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type SocialFeedProps = {
  content: BrandContent["home"]["social"];
};

type InstagramFeedItem = {
  id: string;
  title: string;
  caption: string;
  meta: string;
  imageUrl: string;
  permalink: string;
};

type DisplayItem = {
  id: string;
  title: string;
  caption: string;
  meta: string;
  href?: string;
  visual: {
    src: string;
    alt: string;
  };
  isInstagram: boolean;
};

function buildFallbackItems(content: BrandContent["home"]["social"]): DisplayItem[] {
  return content.items.map((item) => ({
    id: item.title,
    title: item.title,
    caption: item.caption,
    meta: item.meta,
    visual: item.visual,
    isInstagram: false,
  }));
}

function buildInstagramItems(items: InstagramFeedItem[]): DisplayItem[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    caption: item.caption,
    meta: item.meta,
    href: item.permalink,
    visual: {
      src: item.imageUrl,
      alt: item.caption
        ? `Instagram post from TARA: ${item.caption}`
        : "Instagram post from TARA fragrances.",
    },
    isInstagram: true,
  }));
}

export function SocialFeed({ content }: SocialFeedProps) {
  const fallbackItems = buildFallbackItems(content);
  const [instagramItems, setInstagramItems] = useState<DisplayItem[] | null>(null);
  const items = instagramItems ?? fallbackItems;

  useEffect(() => {
    let isMounted = true;

    async function loadInstagramFeed() {
      try {
        const response = await fetch("/.netlify/functions/instagram-feed");

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { items?: InstagramFeedItem[] };

        if (!isMounted || !data.items?.length) {
          return;
        }

        setInstagramItems(buildInstagramItems(data.items));
      } catch {
        // Keep curated launch content if Instagram is unavailable.
      }
    }

    loadInstagramFeed();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="border-b border-black/10 py-16 sm:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.38fr_1fr] lg:items-end">
          <div>
            {content.eyebrow ? (
              <p className="text-xs uppercase tracking-[0.38em] text-[var(--color-gold)]">
                {content.eyebrow}
              </p>
            ) : null}
          </div>
          <div>
            <h2 className="max-w-4xl text-[clamp(3rem,7vw,6.4rem)] font-medium leading-[0.9] tracking-[-0.06em] text-balance">
              {content.title}
            </h2>
            <p className="mt-7 max-w-3xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
              {content.body}
            </p>
            {content.note ? (
              <p className="mt-4 text-sm leading-7 text-black/54">{content.note}</p>
            ) : null}
            <div className="mt-7">
              <Button
                href={content.cta.href}
                variant={content.cta.variant}
                trackingLocation="homepage_social_proof"
              >
                {content.cta.label}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-[1.35rem] border border-black/10 sm:rounded-[1.8rem]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {item.isInstagram ? (
                  <img
                    src={item.visual.src}
                    alt={item.visual.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
                  />
                ) : (
                  <Image
                    src={item.visual.src}
                    alt={item.visual.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
                  />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.06),rgba(247,243,235,0.68))]" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-gold)]">
                    {item.meta}
                  </p>
                  <h3 className="mt-4 font-editorial text-3xl">{item.title}</h3>
                </div>
              </div>
              <div className="border-t border-black/10 p-5 sm:p-6">
                <p className="text-sm leading-7 text-black/62">{item.caption}</p>
              </div>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${item.title} on Instagram`}
                  className="absolute inset-0"
                />
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
