import Image from "next/image";

import type { StoryContent } from "@/types/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type AboutTeaserProps = {
  content: StoryContent;
};

export function AboutTeaser({ content }: AboutTeaserProps) {
  return (
    <section className="border-b border-black/10 py-16 sm:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-stretch">
          <div className="relative min-h-[360px] overflow-hidden rounded-[1.35rem] border border-black/10 sm:min-h-[520px] sm:rounded-[1.8rem]">
            <Image
              src={content.visual.src}
              alt={content.visual.alt}
              fill
              sizes="(min-width: 1024px) 36vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.04),rgba(247,243,235,0.34))]" />
          </div>

          <div className="flex flex-col justify-between border-y border-black/10 py-8 lg:py-10">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-gold)]">
                About TARA
              </p>
              <h2 className="mt-7 text-[clamp(3.2rem,8vw,7rem)] font-medium leading-[0.86] tracking-[-0.07em] text-balance">
                {content.title}
              </h2>
              <p className="mt-7 text-base leading-8 text-[var(--color-copy)] sm:text-lg">
                {content.lead}
              </p>
              <blockquote className="mt-6 border-l-2 border-[var(--color-gold)]/40 pl-4 font-editorial text-2xl italic leading-snug text-[var(--color-onyx-black)] sm:text-3xl">
                &ldquo;{content.quote}&rdquo;
              </blockquote>
              <p className="mt-6 text-sm leading-7 text-black/58">
                {content.paragraphs[0]}
              </p>
            </div>
            <div className="mt-8">
              <Button
                href="/about"
                variant="secondary"
                trackingLocation="homepage_about_teaser"
              >
                Read About TARA
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
