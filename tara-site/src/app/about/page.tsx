import type { Metadata } from "next";

import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { about } from "@/content/about";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About TARA",
  description:
    "Discover TARA, a luxury fragrance house making bold, intimate, and affordable perfumes for everyday confidence.",
  path: "/about",
  socialTitle: "About TARA - Affordable Luxury, Personal Presence",
  socialImage: {
    path: about.visual.src,
    alt: about.visual.alt,
  },
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={about.eyebrow}
        title={about.title}
        body={about.body}
        note={about.note}
        visual={about.visual}
        variant="banner"
        primaryCta={about.ctas.primary}
        secondaryCta={about.ctas.secondary}
      />

      <section className="py-16 sm:py-24">
        <Container className="space-y-20 sm:space-y-28">
          <article className="grid gap-8 lg:grid-cols-[0.34fr_1fr]">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
              The House Belief
            </p>
            <div>
              <h2 className="max-w-5xl text-[clamp(3.2rem,8vw,7rem)] font-medium leading-[0.86] tracking-[-0.07em] text-balance">
                {about.opening.title}
              </h2>
              <div className="mt-8 grid gap-5 text-base leading-8 text-[var(--color-copy)] lg:grid-cols-2">
                {about.opening.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <blockquote className="mt-10 border-y border-black/10 py-8 font-editorial text-3xl italic leading-tight text-[var(--color-onyx-black)] text-balance sm:text-5xl">
                {about.opening.quote}
              </blockquote>
            </div>
          </article>

          <article className="grid gap-8 lg:grid-cols-[0.34fr_1fr]">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
              {about.purpose.eyebrow}
            </p>
            <div>
              <h2 className="max-w-4xl text-[clamp(3rem,7vw,6rem)] font-medium leading-[0.88] tracking-[-0.07em] text-balance">
                {about.purpose.title}
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
                {about.purpose.body}
              </p>
              <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
                {about.purpose.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="py-5 text-sm leading-7 text-black/62">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>

          <article className="grid gap-8 lg:grid-cols-[0.34fr_1fr]">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
              {about.scentMatters.eyebrow}
            </p>
            <div>
              <h2 className="max-w-4xl text-[clamp(3rem,7vw,6rem)] font-medium leading-[0.88] tracking-[-0.07em] text-balance">
                {about.scentMatters.title}
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
                {about.scentMatters.body}
              </p>
              <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
                {about.scentMatters.benefits.map((benefit, index) => (
                  <div
                    key={benefit.title}
                    className="grid gap-4 py-6 sm:grid-cols-[0.16fr_0.3fr_0.54fr]"
                  >
                    <p className="text-xs uppercase tracking-[0.26em] text-[var(--color-gold)]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="text-2xl font-medium tracking-[-0.04em]">
                      {benefit.title}
                    </h3>
                    <p className="text-sm leading-7 text-black/62">
                      {benefit.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="grid gap-8 lg:grid-cols-[0.34fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
                {about.magic.eyebrow}
              </p>
              <p className="mt-6 max-w-xs text-sm leading-7 text-black/58">
                {about.magic.body}
              </p>
            </div>
            <div>
              <h2 className="max-w-4xl text-[clamp(3rem,7vw,6rem)] font-medium leading-[0.88] tracking-[-0.07em] text-balance">
                {about.magic.title}
              </h2>
              <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
                {about.magic.layers.map((layer) => (
                  <div
                    key={layer.label}
                    className="grid gap-4 py-6 sm:grid-cols-[0.24fr_0.76fr]"
                  >
                    <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
                      {layer.label}
                    </p>
                    <div>
                      <h3 className="text-3xl font-medium tracking-[-0.05em]">
                        {layer.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-black/62">
                        {layer.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid gap-5 text-sm leading-7 text-[var(--color-copy)] lg:grid-cols-2">
                {about.magic.closing.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>

          <article className="grid gap-8 lg:grid-cols-[0.34fr_1fr]">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
              {about.signature.eyebrow}
            </p>
            <div>
              <h2 className="max-w-4xl text-[clamp(3rem,7vw,6rem)] font-medium leading-[0.88] tracking-[-0.07em] text-balance">
                {about.signature.title}
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
                {about.signature.body}
              </p>
              <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {about.signature.facets.map((facet) => (
                  <div key={facet.title} className="border-t border-black/10 pt-5">
                    <p className="text-xs uppercase tracking-[0.26em] text-[var(--color-gold)]">
                      {facet.title}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-black/62">
                      {facet.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="border-y border-black/10 py-10">
            <div className="max-w-4xl">
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
                {about.finalWhisper.eyebrow}
              </p>
              <h2 className="mt-7 text-[clamp(3.2rem,8vw,7rem)] font-medium leading-[0.86] tracking-[-0.07em] text-balance">
                {about.finalWhisper.title}
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
                {about.finalWhisper.body}
              </p>
              {about.finalWhisper.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-7 font-editorial text-3xl italic leading-tight text-[var(--color-onyx-black)]"
                >
                  {paragraph}
                </p>
              ))}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={about.ctas.primary.href} variant={about.ctas.primary.variant}>
                  {about.ctas.primary.label}
                </Button>
                <Button
                  href={about.ctas.secondary.href}
                  variant={about.ctas.secondary.variant}
                >
                  {about.ctas.secondary.label}
                </Button>
              </div>
            </div>
          </article>
        </Container>
      </section>
    </>
  );
}
