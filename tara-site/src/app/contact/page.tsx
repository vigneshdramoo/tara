import type { Metadata } from "next";

import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { brand } from "@/content/brand";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact TARA for private orders, retail inquiries, press requests, and launch partnerships.",
  path: "/contact",
  socialTitle: "Contact TARA Concierge",
  socialImage: {
    path: "/editorial/tara-about-private-confession-optimized.webp",
    alt: "TARA fragrances styled in an intimate editorial setting for contact and concierge support.",
  },
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow={brand.contactPage.eyebrow}
        title={brand.contactPage.title}
        body={brand.contactPage.body}
        note={brand.contactPage.note}
        primaryCta={{ label: "Preorder Launch", href: "/preorder", variant: "primary" }}
        secondaryCta={{ label: "Message WhatsApp", href: brand.whatsappUrl, variant: "secondary" }}
      />
      <section className="py-16 sm:py-24">
        <Container className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="border-y border-black/10 py-7">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
              Contact Details
            </p>
            <div className="mt-6 divide-y divide-black/10 border-t border-black/10">
              {brand.contactPage.details.map((detail) => (
                <div
                  key={detail.label}
                  className="py-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(202,158,91,0.28)] text-[var(--color-gold)]">
                      <SiteIcon name={detail.icon ?? "shield"} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-black/42">
                        {detail.label}
                      </p>
                      {detail.href ? (
                        <TrackedAnchor
                          href={detail.href}
                          trackingLabel={detail.label}
                          trackingLocation="contact_details"
                          className="mt-3 block text-base leading-8 text-[var(--color-copy)] transition duration-300 hover:text-[var(--color-onyx-black)]"
                        >
                          {detail.value}
                        </TrackedAnchor>
                      ) : (
                        <p className="mt-3 text-base leading-8 text-[var(--color-copy)]">
                          {detail.value}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
