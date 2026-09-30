import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { brand } from "@/content/brand";
import { commercialOffers } from "@/content/commercial";

export function ShoppingPaths() {
  const sample = commercialOffers.discoverySet;
  return (
    <>
      <section
        aria-label="The TARA promise"
        className="border-b border-black/10"
      >
        <Container className="grid gap-5 py-6 sm:grid-cols-3">
          {[
            ["Malaysian house", "Registered in Malaysia · SSM 202603110736"],
            [
              "Sample before bottle",
              `Try any ${sample.sampleCount} × 8mL for ${sample.price}.`,
            ],
            [
              "Personal support",
              "WhatsApp scent advice and order confirmation.",
            ],
          ].map(([title, body]) => (
            <div key={title}>
              <h2 className="text-sm font-semibold">{title}</h2>
              <p className="mt-1 text-xs leading-6 text-black/70">{body}</p>
            </div>
          ))}
        </Container>
      </section>
      <section
        aria-label="Choose your starting point"
        className="py-10 sm:py-14"
      >
        <Container className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-black/15 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em]">
              01 / The bottle
            </p>
            <h2 className="mt-4 font-editorial text-4xl">Choose your bottle</h2>
            <p className="mt-3 text-sm leading-7">
              Explore THEON and KAMEIRA, then meet the scent family.
            </p>
            <Button
              href="#scent-family"
              variant="secondary"
              className="mt-5"
              trackingLocation="homepage_shopping_paths"
            >
              Shop the scent family
            </Button>
          </article>
          <article className="rounded-2xl border border-black/15 bg-[#eae1d2] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em]">
              02 / The discovery
            </p>
            <h2 className="mt-4 font-editorial text-4xl">Start with skin</h2>
            <p className="mt-3 text-sm leading-7">
              Try any {sample.sampleCount} × 8mL samples for {sample.price}.
            </p>
            <Button
              href={brand.home.eightMlPromo.primary.href}
              variant="secondary"
              className="mt-5"
              trackingLocation="homepage_shopping_paths"
            >
              Try 3 samples for {sample.price}
            </Button>
          </article>
        </Container>
      </section>
    </>
  );
}
