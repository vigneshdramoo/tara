import type { Metadata } from "next";

import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="The ritual you're looking for is not here."
        body="Return to the house or explore the scent lineup to find your way back into the launch."
        primaryCta={{ label: "Back Home", href: "/", variant: "primary" }}
        secondaryCta={{ label: "Explore Scents", href: "/scents", variant: "secondary" }}
      />
      <section className="pb-24 pt-8 sm:pt-12">
        <Container>
          <div className="border-y border-black/12 py-6 text-center text-sm uppercase tracking-[0.22em] text-black/44">
            TARA / Launch Edition 01
          </div>
        </Container>
      </section>
    </>
  );
}
