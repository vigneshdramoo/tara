import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { homepageTrust } from "@/content/homepage";

export function WhyTara() {
  return (
    <section className="border-b border-black/10 py-16 sm:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-[var(--color-gold)]">
              {homepageTrust.eyebrow}
            </p>
            <div className="mt-8 border-y border-black/10 py-5">
              <p className="text-[11px] uppercase tracking-[0.26em] text-black/48">
                {homepageTrust.registration.label}
              </p>
              <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[var(--color-onyx-black)]">
                {homepageTrust.registration.value}
              </p>
            </div>
          </div>

          <div>
            <h2 className="max-w-4xl text-[clamp(3rem,7vw,6.4rem)] font-medium leading-[0.88] tracking-[-0.065em] text-balance">
              {homepageTrust.title}
            </h2>
            <p className="mt-7 max-w-3xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
              {homepageTrust.body}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {homepageTrust.credentials.map((item) => (
            <article
              key={item.title}
              className="border border-black/10 bg-[rgba(255,250,241,0.42)] p-5 shadow-[0_18px_70px_rgba(26,51,74,0.06)] sm:p-6"
            >
              <SiteIcon name={item.icon} className="h-6 w-6 text-[var(--color-gold)]" />
              <h3 className="mt-6 font-editorial text-3xl leading-tight">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-black/62">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {homepageTrust.launchStats.map((stat) => (
            <article
              key={stat.label}
              className="border-y border-black/10 bg-[rgba(202,158,91,0.06)] px-1 py-6"
            >
              <p className="text-[clamp(3.2rem,8vw,6.8rem)] font-medium leading-none tracking-[-0.07em] text-[var(--color-onyx-black)]">
                {stat.value}
              </p>
              <h3 className="mt-4 text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                {stat.label}
              </h3>
              <p className="mt-4 text-sm leading-7 text-black/60">{stat.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {homepageTrust.testimonials.map((note) => (
            <article
              key={`${note.name}-${note.scent}`}
              className="overflow-hidden rounded-[1.35rem] border border-black/10 bg-[rgba(255,250,241,0.46)] sm:rounded-[1.8rem]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={note.visual.src}
                  alt={note.visual.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.04),rgba(247,243,235,0.26))]" />
              </div>
              <div className="p-6 sm:p-7">
                <p className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-gold)]">
                  Early Customer Note / {note.scent}
                </p>
                <blockquote className="mt-5 text-lg leading-8 tracking-[-0.02em] text-[var(--color-onyx-black)]">
                  &ldquo;{note.quote}&rdquo;
                </blockquote>
                <p className="mt-5 text-xs uppercase tracking-[0.22em] text-black/48">
                  {note.name} / {note.location}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 grid gap-5 overflow-hidden rounded-[1.35rem] border border-black/10 bg-[linear-gradient(135deg,rgba(10,10,10,0.96),rgba(26,51,74,0.92))] p-6 text-[var(--color-ivory)] sm:rounded-[1.8rem] sm:p-8 lg:grid-cols-[0.36fr_1fr_auto] lg:items-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            UGC Prompt
          </p>
          <div>
            <h3 className="font-editorial text-4xl leading-none sm:text-5xl">
              {homepageTrust.ugcPrompt.title}
            </h3>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68">
              {homepageTrust.ugcPrompt.body}
            </p>
          </div>
          <Button
            href={homepageTrust.ugcPrompt.cta.href}
            variant={homepageTrust.ugcPrompt.cta.variant}
            className="border-white/20 text-white hover:bg-white/10"
            trackingLocation="homepage_ugc_prompt"
            trackingLabel={homepageTrust.ugcPrompt.cta.label}
          >
            {homepageTrust.ugcPrompt.hashtag}
          </Button>
        </div>
      </Container>
    </section>
  );
}
