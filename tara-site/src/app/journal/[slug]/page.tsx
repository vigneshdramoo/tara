import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { brand } from "@/content/brand";
import { getJournalArticle, journalArticles } from "@/content/journal";
import { absoluteUrl } from "@/lib/utils";

type JournalArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return journalArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: JournalArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getJournalArticle(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.keywords,
    alternates: {
      canonical: absoluteUrl(`/journal/${article.slug}`),
    },
    openGraph: {
      title: `${article.title} | TARA Journal`,
      description: article.excerpt,
      url: absoluteUrl(`/journal/${article.slug}`),
      siteName: brand.name,
      images: [
        {
          url: absoluteUrl(article.visual.src),
          width: 1200,
          height: 1200,
          alt: article.visual.alt,
        },
      ],
      locale: "en_MY",
      type: "article",
    },
  };
}

export default async function JournalArticlePage({ params }: JournalArticlePageProps) {
  const { slug } = await params;
  const article = getJournalArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="border-b border-black/10">
      <Container className="py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_0.58fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-[var(--color-gold)]">
              {article.category} / {article.readTime}
            </p>
            <h1 className="mt-7 text-[clamp(3.2rem,8vw,7rem)] font-medium leading-[0.86] tracking-[-0.065em] text-balance">
              {article.title}
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
              {article.excerpt}
            </p>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-[1.35rem] border border-black/10 sm:rounded-[1.8rem]">
            <Image
              src={article.visual.src}
              alt={article.visual.alt}
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.04),rgba(247,243,235,0.34))]" />
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-12">
          {article.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-editorial text-4xl leading-tight">
                {section.title}
              </h2>
              <div className="mt-5 space-y-5 text-base leading-8 text-black/66">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <div className="border-y border-black/10 py-7">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
              Need a personal match?
            </p>
            <p className="mt-4 text-base leading-8 text-black/66">
              Take the scent quiz or text TARA on WhatsApp before choosing a full
              bottle.
            </p>
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <Button href="/quiz" variant="primary" trackingLocation="journal_article">
                Take The Quiz
              </Button>
              <Button
                href={brand.whatsappUrl}
                variant="secondary"
                trackingLocation="journal_article"
              >
                WhatsApp Concierge
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
