import type { Metadata } from "next";
import Image from "next/image";

import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";
import {
  nextTrailStopNotice,
  popupCampaign,
  popupEventCardCopy,
  popupPinnedPostCopy,
  popupQuickFacts,
  scentTrailStops,
} from "@/content/popup";
import { brand } from "@/content/brand";
import { absoluteUrl } from "@/lib/utils";

const popupPageUrl = absoluteUrl("/popup");

export const metadata: Metadata = {
  title: "TARA Scent Trail: Stop 12",
  description:
    "TARA Scent Trail continues with Stop 12 at Lurve Market x TARA, The Street @ The Curve.",
  alternates: {
    canonical: popupPageUrl,
  },
  openGraph: {
    title: "TARA Scent Trail: Stop 12",
    description:
      "TARA Scent Trail continues with Stop 12 at Lurve Market x TARA, The Street @ The Curve.",
    url: popupPageUrl,
    siteName: brand.name,
    images: [
      {
        url: absoluteUrl(popupCampaign.visuals.eliora.src),
        width: 1200,
        height: 1500,
        alt: popupCampaign.visuals.eliora.alt,
      },
    ],
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TARA Scent Trail: Stop 12",
    description:
      "Explore TARA Scent Trail: Stops 01-12 and follow TARA for the return to The Curve.",
    images: [absoluteUrl(popupCampaign.visuals.eliora.src)],
  },
};

export default function PopupPage() {
  return (
    <>
      <section className="relative isolate flex min-h-[56svh] items-end overflow-hidden border-b border-black/10">
        <Image
          src={popupCampaign.visuals.hero.src}
          alt={popupCampaign.visuals.hero.alt}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(247,243,235,0.96)_0%,rgba(247,243,235,0.78)_42%,rgba(247,243,235,0.34)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(247,243,235,0.16)_0%,rgba(247,243,235,0.82)_100%)]" />
        <Container>
          <div className="max-w-5xl py-8 sm:py-10 lg:py-12">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--color-gold)] sm:text-xs">
              {popupCampaign.event.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl font-editorial text-[clamp(3rem,7.4vw,5rem)] font-medium leading-[0.94] text-[var(--color-onyx-black)]">
              {popupCampaign.event.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
              {popupCampaign.event.body}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-[rgba(202,158,91,0.32)] bg-[rgba(202,158,91,0.14)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-onyx-black)]">
                Status: {popupCampaign.event.status}
              </span>
              <span className="rounded-full border border-black/10 bg-white/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-black/58">
                {popupCampaign.event.nextRemark}
              </span>
            </div>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <Button
                href={popupCampaign.ctas.primary.href}
                variant={popupCampaign.ctas.primary.variant}
                trackingLocation="popup_hero"
              >
                {popupCampaign.ctas.primary.label}
              </Button>
              <Button
                href={popupCampaign.ctas.secondary.href}
                variant={popupCampaign.ctas.secondary.variant}
                trackingLocation="popup_hero"
              >
                {popupCampaign.ctas.secondary.label}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-black/10 py-12 sm:py-16">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {popupQuickFacts.map((fact) => (
              <article
                key={fact.label}
                className="border border-black/10 bg-white/30 p-5 backdrop-blur-sm"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-gold)]">
                  {fact.label}
                </p>
                <h2 className="mt-4 text-xl font-semibold leading-7 text-[var(--color-onyx-black)]">
                  {fact.value}
                </h2>
                <p className="mt-3 text-sm leading-7 text-black/58">{fact.detail}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-black/10 py-16 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
                TARA Scent Trail: Stops 01-12
              </p>
              <h2 className="mt-6 max-w-xl font-editorial text-[clamp(2.8rem,8vw,5.8rem)] font-medium leading-[0.92] text-[var(--color-onyx-black)]">
                Completed and upcoming stops.
              </h2>
              <p className="mt-6 max-w-md text-base leading-8 text-[var(--color-copy)]">
                TARA Scent Trail: Stops 01-11 are completed. Stop 12 is confirmed
                for Lurve Market x TARA at The Street @ The Curve.
              </p>
            </div>

            <div className="divide-y divide-black/10 border-y border-black/10">
              {scentTrailStops.map((trailStop) => (
                <article
                  key={trailStop.stop}
                  className="grid gap-5 py-7 lg:grid-cols-[0.28fr_0.88fr_0.24fr] lg:items-start"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-gold)]">
                      TARA Scent Trail: {trailStop.stop}
                    </p>
                    <p className="mt-3 inline-flex rounded-full border border-[rgba(202,158,91,0.28)] bg-[rgba(202,158,91,0.12)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/62">
                      {trailStop.status}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-medium tracking-[-0.04em] text-[var(--color-onyx-black)]">
                      {trailStop.title}
                    </h3>
                    <p className="mt-3 text-sm font-semibold uppercase leading-6 tracking-[0.16em] text-black/58">
                      {trailStop.venue}
                    </p>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-copy)]">
                      {trailStop.body}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {trailStop.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="border border-black/10 bg-white/30 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-black/54"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  <dl className="grid gap-3 text-sm leading-6 text-black/58 lg:text-right">
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.24em] text-black/38">
                        Dates
                      </dt>
                      <dd className="mt-1">{trailStop.dates}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.24em] text-black/38">
                        Hours
                      </dt>
                      <dd className="mt-1">{trailStop.hours}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.24em] text-black/38">
                        Host
                      </dt>
                      <dd className="mt-1">{trailStop.host}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-[1.4rem] border border-[rgba(202,158,91,0.28)] bg-[linear-gradient(135deg,rgba(202,158,91,0.16),rgba(247,243,235,0.72))] p-6 sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-gold)]">
              {nextTrailStopNotice.eyebrow}
            </p>
            <h3 className="mt-4 font-editorial text-4xl font-medium leading-none text-[var(--color-onyx-black)] sm:text-5xl">
              {nextTrailStopNotice.title}
            </h3>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-copy)]">
              {nextTrailStopNotice.body}
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-black/10 py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
              {popupCampaign.offer.eyebrow}
            </p>
            <h2 className="mt-6 max-w-4xl font-editorial text-[clamp(3rem,9vw,6.8rem)] font-medium leading-[0.92] text-[var(--color-onyx-black)]">
              {popupCampaign.offer.title}
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
              {popupCampaign.offer.body}
            </p>
            <p className="mt-6 border-y border-black/10 py-4 text-[11px] uppercase leading-6 tracking-[0.22em] text-black/54 sm:text-xs">
              {popupCampaign.offer.note}
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Button
                href={popupCampaign.ctas.secondary.href}
                variant="primary"
                trackingLocation="popup_offer"
              >
                {popupCampaign.ctas.secondary.label}
              </Button>
              <Button href="/scents" variant="secondary" trackingLocation="popup_offer">
                Meet The Scents
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden border border-black/10 bg-white/30 backdrop-blur-sm">
            <Image
              src={popupCampaign.visuals.offer.src}
              alt={popupCampaign.visuals.offer.alt}
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-black/10 bg-[linear-gradient(135deg,rgba(247,243,235,0.98)_0%,rgba(241,233,221,0.95)_52%,rgba(228,233,239,0.88)_100%)] py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="relative aspect-square overflow-hidden border border-[rgba(202,158,91,0.18)] bg-white/30 backdrop-blur-sm lg:order-1">
            <Image
              src={popupCampaign.visuals.eliora.src}
              alt={popupCampaign.visuals.eliora.alt}
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:order-2">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
              {popupCampaign.eliora.eyebrow}
            </p>
            <h2 className="mt-6 max-w-4xl font-editorial text-[clamp(3rem,9vw,6.8rem)] font-medium leading-[0.92] text-[var(--color-onyx-black)]">
              {popupCampaign.eliora.title}
            </h2>
            <p className="mt-6 text-lg leading-8 text-[var(--color-gold)]">
              {popupCampaign.eliora.line}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
              {popupCampaign.eliora.body}
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {popupCampaign.eliora.details.map((detail) => (
                <li
                  key={detail}
                  className="border border-black/10 bg-white/30 px-4 py-3 text-xs uppercase leading-6 tracking-[0.18em] text-black/68 backdrop-blur-sm"
                >
                  {detail}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Button href="/scents/eliora" variant="primary" trackingLocation="popup_eliora">
                Meet Eliora
              </Button>
              <Button
                href={popupCampaign.ctas.whatsapp.href}
                variant="secondary"
                trackingLocation="popup_eliora"
              >
                WhatsApp TARA
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-black/10 py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
              Event Card
            </p>
            <h2 className="mt-6 max-w-3xl font-editorial text-[clamp(2.8rem,8vw,5.8rem)] font-medium leading-[0.94] text-[var(--color-onyx-black)]">
              The saveable details.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--color-copy)]">
              These are the details to keep visible in the QR flow and reusable
              for the missing social event card.
            </p>
          </div>
          <article className="border border-[rgba(202,158,91,0.28)] bg-[linear-gradient(135deg,#fbf2e8,#f4dfbd)] p-6 text-[var(--color-onyx-black)] sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.28em] text-black/54">
              TARA
            </p>
            <h3 className="mt-6 font-editorial text-[clamp(2.4rem,9vw,5.4rem)] font-medium leading-none text-black">
              {popupEventCardCopy.headline}
            </h3>
            <p className="mt-5 text-base leading-7 text-black/68">
              {popupEventCardCopy.subhead}
            </p>
            <dl className="mt-7 grid gap-3">
              {popupEventCardCopy.details.map((detail, index) => (
                <div key={detail} className="grid grid-cols-[3rem_1fr] items-start gap-4 border-t border-black/12 pt-3">
                  <dt className="text-xs uppercase tracking-[0.24em] text-black/42">
                    {String(index + 1).padStart(2, "0")}
                  </dt>
                  <dd className="text-sm font-semibold uppercase leading-6 tracking-[0.12em] text-black/82">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 border-y border-black/14 py-4 text-xs font-semibold uppercase leading-6 tracking-[0.18em] text-black/68">
              {popupEventCardCopy.footer}
            </p>
            <p className="mt-5 text-sm leading-7 text-black/58">
              {popupEventCardCopy.cta}
            </p>
          </article>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
              Pinned Copy
            </p>
            <h2 className="mt-6 font-editorial text-[clamp(2.8rem,8vw,5.8rem)] font-medium leading-[0.94] text-[var(--color-onyx-black)]">
              Three posts before launch, three posts while live.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {[
              ["Before 27 May", popupPinnedPostCopy.beforeLaunch],
              ["27 May to 2 June", popupPinnedPostCopy.duringEvent],
            ].map(([group, posts]) => (
              <div key={group as string} className="grid gap-4">
                <h3 className="text-xs uppercase tracking-[0.28em] text-black/46">
                  {group as string}
                </h3>
                {(posts as typeof popupPinnedPostCopy.beforeLaunch).map((post) => (
                  <article key={post.title} className="border border-black/10 bg-white/30 p-5 backdrop-blur-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-onyx-black)]">
                      {post.title}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-black/62">{post.caption}</p>
                    <p className="mt-4 text-xs uppercase leading-6 tracking-[0.18em] text-[var(--color-gold)]">
                      {post.cta}
                    </p>
                    <p className="mt-3 border-t border-black/10 pt-3 text-sm leading-7 text-black/48">
                      Pin: {post.pinnedComment}
                    </p>
                  </article>
                ))}
              </div>
            ))}
          </div>
          <TrackedAnchor
            href={popupCampaign.ctas.primary.href}
            target="_blank"
            rel="noreferrer"
            trackingLabel={popupCampaign.ctas.primary.label}
            trackingLocation="popup_footer"
            className="mt-10 inline-flex w-full items-center justify-center gap-3 border border-[var(--color-gold)] bg-[var(--color-gold)] px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-onyx-black)] transition duration-300 hover:bg-[var(--color-amber)] sm:w-auto"
          >
            <SiteIcon name="instagram" />
            Follow TARA Scent Trail Updates
          </TrackedAnchor>
        </Container>
      </section>
    </>
  );
}
