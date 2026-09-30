import type { Metadata } from "next";
import Image from "next/image";

import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { brand } from "@/content/brand";
import { popupCampaign, popupQuickFacts } from "@/content/popup";
import { absoluteUrl } from "@/lib/utils";

const linkPageUrl = absoluteUrl("/links");

const channelLinks = [
  {
    label: "WhatsApp Next Stop Updates",
    body: "Ask for the latest TARA Scent Trail Stop 12 details.",
    href: popupCampaign.ctas.whatsapp.href,
    icon: "whatsapp",
    trackingType: "whatsapp",
  },
  {
    label: "Scent Trail Archive",
    body: "View completed and upcoming TARA Scent Trail stops through Stop 12.",
    href: "/popup",
    icon: "globe",
    trackingType: "website",
  },
  {
    label: "Meet Eliora",
    body: "Read the golden floral-musk profile and preorder it online.",
    href: "/scents/eliora",
    icon: "spark",
    trackingType: "website",
  },
  {
    label: "Instagram",
    body: "Follow upcoming stop details, scent updates, and launch reminders.",
    href: brand.instagramUrl,
    icon: "instagram",
    trackingType: "social",
  },
  {
    label: "Website",
    body: "Explore the TARA scent lineup and the house.",
    href: "/",
    icon: "globe",
    trackingType: "website",
  },
] as const;

export const metadata: Metadata = {
  title: "TARA Scent Trail Links",
  description:
    "TARA QR links for completed Scent Trail stops, Instagram updates, Eliora, and the discovery set.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: linkPageUrl,
  },
  openGraph: {
    title: "TARA Scent Trail Links",
    description:
      "Open TARA's Scent Trail archive, WhatsApp updates, Instagram, and official fragrance website from one QR destination.",
    url: linkPageUrl,
    siteName: brand.name,
    images: [
      {
        url: absoluteUrl("/og/tara-home.jpg"),
        width: 1200,
        height: 630,
        alt: "TARA fragrance bottles with dark editorial styling.",
      },
    ],
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TARA Scent Trail Links",
    description:
      "TARA QR links for completed Scent Trail stops, Instagram updates, Eliora, and the discovery set.",
    images: [absoluteUrl("/og/tara-home.jpg")],
  },
};

export default function LinksPage() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-center">
        <div className="relative min-h-[380px] overflow-hidden border-y border-black/12 sm:min-h-[520px] lg:min-h-[660px]">
          <Image
            src={popupCampaign.visuals.eliora.src}
            alt={popupCampaign.visuals.eliora.alt}
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0)_24%,rgba(247,243,235,0.72)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
              TARA / Scent Trail QR
            </p>
            <p className="mt-3 max-w-md text-sm leading-7 text-black/72">
              Completed trail stops, upcoming Stop 12 details, ELIORA, and the
              RM99 discovery set in one scan.
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          <div className="border-b border-black/10 pb-8">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
              Scan Destination
            </p>
            <h1 className="mt-6 max-w-4xl font-editorial text-[clamp(3.6rem,17vw,8.6rem)] font-medium leading-[0.9] text-[var(--color-onyx-black)]">
              Scent Trail Archive
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
              {popupCampaign.event.body}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {popupQuickFacts.map((fact) => (
                <div key={fact.label} className="border-l border-black/12 pl-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-black/38">
                    {fact.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase leading-6 tracking-[0.12em] text-[var(--color-onyx-black)]">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-black/10 border-y border-black/10">
            {channelLinks.map((link) => {
              const isExternal = link.href.startsWith("http");

              return (
                <TrackedAnchor
                  key={link.label}
                  href={link.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  trackingLabel={link.label}
                  trackingLocation="qr_links_page"
                  data-link-type={link.trackingType}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 text-left transition duration-300 first:bg-[rgba(202,158,91,0.08)] hover:bg-white/[0.03] sm:gap-5 sm:px-4"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(202,158,91,0.3)] text-[var(--color-gold)] transition duration-300 group-hover:border-[rgba(202,158,91,0.68)] group-hover:bg-[rgba(202,158,91,0.08)]">
                    <SiteIcon name={link.icon} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-onyx-black)]">
                      {link.label}
                    </span>
                    <span className="mt-2 block text-sm leading-7 text-black/58">
                      {link.body}
                    </span>
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/12 text-black/56 transition duration-300 group-hover:border-[rgba(202,158,91,0.45)] group-hover:text-[var(--color-gold)]">
                    <SiteIcon name="arrowUpRight" className="h-4 w-4" />
                  </span>
                </TrackedAnchor>
              );
            })}
          </div>

          <p className="text-xs uppercase leading-6 tracking-[0.24em] text-black/38">
            Stops 01-11 are completed. Stop 12 is confirmed for Lurve Market x
            TARA at The Street @ The Curve.
          </p>
        </div>
      </Container>
    </section>
  );
}
