import Image from "next/image";

import { Container } from "@/components/ui/Container";

type PhilosophyMomentProps = {
  quote: string;
};

export function PhilosophyMoment({ quote }: PhilosophyMomentProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-black/10 py-16 sm:py-24">
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(135deg,rgba(247,243,235,1)_0%,rgba(241,233,221,0.96)_56%,rgba(228,233,239,0.88)_100%)]" />
      <div className="absolute inset-y-0 left-0 -z-20 w-full lg:w-[64%]">
        <Image
          src="/editorial/tara-philosophy-bedroom-bg.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 64vw, 100vw"
          className="object-cover object-[32%_50%] opacity-[0.2] saturate-[0.86]"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_24%_50%,rgba(247,243,235,0.02)_0%,rgba(247,243,235,0.26)_42%,rgba(247,243,235,0.76)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(247,243,235,0.14)_0%,rgba(247,243,235,0.36)_40%,rgba(247,243,235,0.64)_68%,rgba(247,243,235,0.82)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(247,243,235,0.78)_0%,rgba(247,243,235,0.1)_45%,rgba(247,243,235,0.76)_100%)]" />
      <Container>
        <div className="grid min-h-[420px] gap-8 py-4 lg:grid-cols-[0.34fr_1fr] lg:items-center">
          <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-gold)]">
            Philosophy
          </p>
          <blockquote className="max-w-5xl font-editorial text-[2.6rem] italic leading-[1.02] text-[var(--color-onyx-black)] text-balance sm:text-6xl lg:ml-auto lg:max-w-4xl lg:text-7xl">
            &quot;{quote}&quot;
          </blockquote>
        </div>
      </Container>
    </section>
  );
}
