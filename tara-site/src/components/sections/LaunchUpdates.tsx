import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";

const launchUpdateHighlights = [
  "RM99 discovery set restocks",
  "Shipping and preorder dispatch updates",
  "New scent films, notes, and private drops",
];

export function LaunchUpdates() {
  return (
    <section className="border-b border-black/10 py-12 sm:py-16">
      <Container>
        <div className="grid gap-6 rounded-[1.6rem] border border-black/10 bg-[rgba(255,250,241,0.7)] p-5 shadow-[0_20px_80px_rgba(26,51,74,0.06)] sm:rounded-[2rem] sm:p-7 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold)]">
              Launch Updates
            </p>
            <h2 className="mt-4 max-w-3xl text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[0.9] tracking-[-0.07em]">
              Get the next drop before it moves.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
              Join the TARA list for practical launch updates: discovery-set
              availability, shipping windows, scent-film releases, and preorder
              reminders before launch pricing closes.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {launchUpdateHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-black/10 bg-[var(--color-ivory)] p-4 text-sm leading-6 text-black/68"
                >
                  <SiteIcon
                    name="spark"
                    className="mt-0.5 h-4 w-4 text-[var(--color-gold)]"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-black/10 bg-[var(--color-ivory)] p-5 sm:p-6">
            <p className="text-sm leading-7 text-black/62">
              No spam. Just launch windows, scent education, and the practical
              details customers ask for before buying.
            </p>
            <NewsletterForm
              source="homepage_launch_updates"
              trackingLocation="homepage_launch_updates"
              buttonLabel="Get Launch Updates"
              successMessage="You are on the list for TARA launch updates."
              className="mt-3"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
