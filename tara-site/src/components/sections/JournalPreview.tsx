import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { journalArticles } from "@/content/journal";

export function JournalPreview() {
  return (
    <section className="border-b border-black/10 py-16 sm:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.38fr_1fr] lg:items-end">
          <p className="text-xs uppercase tracking-[0.38em] text-[var(--color-gold)]">
            Journal
          </p>
          <div>
            <h2 className="max-w-4xl text-[clamp(3rem,7vw,6.4rem)] font-medium leading-[0.88] tracking-[-0.065em] text-balance">
              Fragrance advice for Malaysian weather, gifting, and daily ritual.
            </h2>
            <p className="mt-7 max-w-3xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
              Build organic discovery with practical guides for scent layering,
              humid-climate wear, gifting, and halal-conscious fragrance questions.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {journalArticles.slice(0, 3).map((article) => (
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
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.04),rgba(247,243,235,0.42))]" />
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  {article.category} / {article.readTime}
                </p>
                <h3 className="mt-5 font-editorial text-3xl leading-tight">
                  {article.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-black/62">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Button href="/journal" variant="secondary" trackingLocation="homepage_journal">
            Read The Journal
          </Button>
        </div>
      </Container>
    </section>
  );
}
