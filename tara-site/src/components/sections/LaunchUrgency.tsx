import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { launchUrgency } from "@/content/homepage";

export function LaunchUrgency() {
  const sold = Math.max(launchUrgency.total - launchUrgency.remaining, 0);
  const soldPercent = Math.min(Math.round((sold / launchUrgency.total) * 100), 100);
  const tickerItems = [...launchUrgency.ticker, ...launchUrgency.ticker];
  const mobileHighlights = launchUrgency.ticker.slice(0, 2);

  return (
    <section className="border-b border-black/10 bg-[linear-gradient(90deg,rgba(10,10,10,0.96)_0%,rgba(26,51,74,0.94)_58%,rgba(75,48,106,0.88)_100%)] py-8 text-[var(--color-ivory)]">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1fr_0.36fr] lg:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-gold)]">
              {launchUrgency.eyebrow}
            </p>
            <h2 className="mt-3 font-editorial text-4xl leading-none tracking-[-0.04em]">
              {launchUrgency.title}
            </h2>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="max-w-xl text-sm leading-7 text-white/68">
                {launchUrgency.body}
              </p>
              <p className="rounded-2xl border border-[rgba(255,89,64,0.38)] bg-[rgba(255,89,64,0.11)] px-5 py-4 text-right shadow-[0_0_45px_rgba(255,89,64,0.14)]">
                <span className="block animate-pulse text-6xl font-medium leading-none tracking-[-0.08em] text-[#ff6a4d]">
                  {launchUrgency.remaining}
                </span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-white/68">
                  bottles left
                </span>
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-gold)]">
                {soldPercent}% sold out
              </p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/44">
                {sold} / {launchUrgency.total} allocated
              </p>
            </div>
            <div
              aria-label={`${sold} of ${launchUrgency.total} launch bottles allocated`}
              className="mt-2 h-3 overflow-hidden rounded-full bg-white/12"
            >
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#CA9E5B_0%,#C88E4D_58%,#ff6a4d_100%)] shadow-[0_0_24px_rgba(255,106,77,0.36)]"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
          </div>

          <Button
            href={launchUrgency.cta.href}
            variant={launchUrgency.cta.variant}
            trackingLocation="homepage_launch_urgency"
          >
            {launchUrgency.cta.label}
          </Button>
        </div>

        <div className="mt-7 border-y border-white/12 py-3">
          <div className="grid gap-2 sm:hidden">
            {mobileHighlights.map((item) => (
              <p
                key={item}
                className="text-[10px] uppercase leading-5 tracking-[0.22em] text-white/72"
              >
                {item}
              </p>
            ))}
          </div>
          <div className="hidden overflow-hidden sm:block">
            <div className="flex w-max animate-[ticker_44s_linear_infinite] gap-10">
              {tickerItems.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="text-[10px] uppercase tracking-[0.26em] text-white/58"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
