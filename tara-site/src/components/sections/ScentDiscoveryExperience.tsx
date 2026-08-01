import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SignatureScentMiniQuiz } from "@/components/sections/SignatureScentMiniQuiz";
import { scentDiscoveryExperience } from "@/content/homepage";
import { getAvailableScents } from "@/lib/catalog";

export function ScentDiscoveryExperience() {
  const availableScents = getAvailableScents();

  return (
    <section className="border-b border-black/10 bg-[rgba(255,250,241,0.38)] py-14 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-[var(--color-gold)]">
              {scentDiscoveryExperience.eyebrow}
            </p>
            <h2 className="mt-7 max-w-4xl text-[clamp(3.1rem,7vw,6.8rem)] font-medium leading-[0.86] tracking-[-0.065em] text-balance">
              {scentDiscoveryExperience.title}
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--color-copy)] sm:text-lg">
              {scentDiscoveryExperience.body}
            </p>
            <div className="mt-8 grid gap-3 border-y border-black/10 py-5">
              <p className="text-xs uppercase leading-6 tracking-[0.24em] text-black/46">
                {scentDiscoveryExperience.quizPromise}
              </p>
              <p className="text-sm leading-7 text-black/62">
                {scentDiscoveryExperience.videoPrompt}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Button
                href={scentDiscoveryExperience.primary.href}
                variant={scentDiscoveryExperience.primary.variant}
                trackingLocation="homepage_scent_discovery"
              >
                {scentDiscoveryExperience.primary.label}
              </Button>
              <Button
                href={scentDiscoveryExperience.secondary.href}
                variant={scentDiscoveryExperience.secondary.variant}
                trackingLocation="homepage_scent_discovery"
              >
                {scentDiscoveryExperience.secondary.label}
              </Button>
            </div>
          </div>

          <SignatureScentMiniQuiz scents={availableScents} />
        </div>
      </Container>
    </section>
  );
}
