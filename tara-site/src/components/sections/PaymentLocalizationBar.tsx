import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { paymentLocalization } from "@/content/homepage";

export function PaymentLocalizationBar() {
  return (
    <section className="border-b border-black/10 py-8">
      <Container>
        <div className="grid gap-5 lg:grid-cols-[0.34fr_1fr] lg:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-gold)]">
              {paymentLocalization.eyebrow}
            </p>
            <h2 className="mt-3 font-editorial text-3xl leading-none tracking-[-0.03em]">
              {paymentLocalization.title}
            </h2>
          </div>

          <div>
            <p className="max-w-3xl text-sm leading-7 text-black/62">
              {paymentLocalization.body}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {paymentLocalization.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[rgba(255,250,241,0.62)] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-black/62"
                >
                  <SiteIcon
                    name={badge.includes("FPX") || badge.includes("ToyyibPay") ? "lock" : "wallet"}
                    className="h-4 w-4 text-[var(--color-gold)]"
                  />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
