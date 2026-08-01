import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { journalArticles } from "@/content/journal";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Journal - Perfume Malaysia Guides",
  description:
    "TARA Journal covers perfume Malaysia guides, humid-climate fragrance wear, scent layering, gifting, and halal-conscious fragrance questions.",
  alternates: {
    canonical: absoluteUrl("/journal"),
  },
};

export default function JournalPage() {
  return (
    <section className="border-b border-black/10 py-16 sm:py-24">
      <Container>
        <div className="max-w-5xl">
          <p className="text-xs uppercase tracking-[0.38em] text-[var(--color-gold)]">
            TARA Journal
          </p>
          <h1 className="mt-7 text-[clamp(3.5rem,9vw,8rem)] font-medium leading-[0.84] tracking-[-0.07em] text-balance">
            Fragrance guides for Malaysian weather, skin, and ritual.
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
            Practical scent advice for choosing perfume online, layering fragrance,
            gifting with intention, and wearing luxury scents in humid climates.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {journalArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group overflow-hidden rounded-[1.35rem] border border-black/10 bg-[rgba(255,250,241,0.42)] transition duration-500 hover:-translate-y-1 hover:border-[rgba(202,158,91,0.46)] sm:rounded-[1.8rem]"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={article.visual.src}
                  alt={article.visual.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.04),rgba(247,243,235,0.38))]" />
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  {article.category} / {article.readTime}
                </p>
                <h2 className="mt-5 font-editorial text-3xl leading-tight">
                  {article.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-black/62">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
