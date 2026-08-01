import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { PolicyPageContent } from "@/content/legal";

type PolicyPageProps = {
  page: PolicyPageContent;
};

export function PolicyPage({ page }: PolicyPageProps) {
  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        body={page.intro}
        note={`Last updated ${page.lastUpdated}`}
        primaryCta={page.primaryCta}
        secondaryCta={page.secondaryCta}
      />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-8 xl:grid-cols-[0.74fr_1.26fr]">
          <aside className="h-fit border-y border-black/10 py-6 sm:py-8 xl:sticky xl:top-28">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
              Trust Center
            </p>
            <h2 className="mt-6 text-[clamp(2.8rem,5vw,4.7rem)] font-medium leading-[0.88] tracking-[-0.06em]">
              Clear terms for a calmer order.
            </h2>
            <p className="mt-5 text-sm leading-7 text-black/60">
              These pages explain how TARA handles privacy, orders, returns,
              and delivery so customers can preorder with confidence.
            </p>
            <div className="mt-7 grid gap-3">
              <Button
                href="/privacy"
                variant={page.slug === "privacy" ? "primary" : "ghost"}
                className="sm:w-full"
              >
                Privacy Policy
              </Button>
              <Button
                href="/terms"
                variant={page.slug === "terms" ? "primary" : "ghost"}
                className="sm:w-full"
              >
                Terms
              </Button>
              <Button
                href="/refund-policy"
                variant={page.slug === "refund-policy" ? "primary" : "ghost"}
                className="sm:w-full"
              >
                Refund Policy
              </Button>
              <Button
                href="/shipping-policy"
                variant={page.slug === "shipping-policy" ? "primary" : "ghost"}
                className="sm:w-full"
              >
                Shipping Policy
              </Button>
            </div>
          </aside>

          <div className="divide-y divide-black/10 border-y border-black/10">
            {page.sections.map((section) => (
              <article
                key={section.title}
                className="grid gap-5 py-7 sm:py-9 lg:grid-cols-[0.34fr_0.66fr]"
              >
                <h2 className="text-2xl font-medium leading-tight tracking-[-0.04em] text-[var(--color-onyx-black)] sm:text-4xl">
                  {section.title}
                </h2>
                <div>
                  {section.body ? (
                    <p className="text-sm leading-7 text-[var(--color-copy)] sm:text-base sm:leading-8">
                      {section.body}
                    </p>
                  ) : null}
                  {section.items ? (
                    <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--color-copy)] sm:text-base sm:leading-8">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
