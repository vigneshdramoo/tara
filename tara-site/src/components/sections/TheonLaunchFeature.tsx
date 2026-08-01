import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const theonNotes = [
  {
    label: "Top",
    value: "Bergamot / bright citrus lift",
  },
  {
    label: "Heart",
    value: "Golden oolong / osmanthus / green tea / coconut cream",
  },
  {
    label: "Base",
    value: "Soft vanilla / sandalwood / warm musk",
  },
];

export function TheonLaunchFeature() {
  return (
    <section className="border-b border-black/10 bg-[#F7F3EB] py-16 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[0.52fr_0.48fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-[#CA9E5B]">
            New Launch / Warm Tea Gourmand
          </p>
          <h2 className="mt-7 max-w-4xl text-[clamp(4rem,10vw,8.4rem)] font-medium leading-[0.82] tracking-[-0.075em] text-[#0A0A0A] text-balance">
            THEON
          </h2>
          <p className="mt-4 text-xs uppercase tracking-[0.28em] text-[#CA9E5B]">
            steeped in divine calm
          </p>
          <p className="mt-8 max-w-2xl text-base leading-8 text-[#33291D] sm:text-lg">
            The warmth you return to. Golden oolong and osmanthus soften into
            coconut cream, vanilla, sandalwood, and skin-close musk, turning a
            small daily ritual into something luminous.
          </p>

          <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
            {theonNotes.map((note) => (
              <div
                key={note.label}
                className="grid gap-2 py-4 sm:grid-cols-[0.22fr_0.78fr]"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-[#CA9E5B]">
                  {note.label}
                </p>
                <p className="text-sm leading-7 text-[#33291D]/80">{note.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <Button href="/scents/theon" variant="primary" trackingLocation="theon_launch_feature">
              Explore THEON
            </Button>
            <Button href="/scents" variant="secondary" trackingLocation="theon_launch_feature">
              Explore All Scents
            </Button>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[1.35rem] border border-[#CA9E5B]/28 sm:min-h-[560px] sm:rounded-[1.8rem] lg:min-h-[640px]">
          <Image
            src="/editorial/tara-theon-launch-hero.png"
            alt="THEON Eau de Parfum bottle in warm golden light with ivory drapery."
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-[82%_50%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.02),rgba(247,243,235,0.22))]" />
        </div>
      </Container>
    </section>
  );
}
