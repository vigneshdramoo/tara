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
      </Container>
    </section>
  );
}
