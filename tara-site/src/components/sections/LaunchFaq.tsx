import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { brand } from "@/content/brand";

export const launchFaqs = [
  {
    question: "How much is shipping?",
    answer:
      "Shipping fees are confirmed during checkout or by WhatsApp concierge before payment. Launch orders are fulfilled from Malaysia, with courier timing shared during order confirmation.",
    href: "/shipping-policy",
    cta: "Read shipping policy",
  },
  {
    question: "What if my bottle arrives damaged or incorrect?",
    answer:
      "Message TARA within 48 hours with your order details and clear photos. For hygiene and safety, fragrance returns are handled according to condition, seal status, and the refund policy.",
    href: "/refund-policy",
    cta: "Read refund policy",
  },
  {
    question: "Can I see the full top, heart, and base notes?",
    answer:
      "Each scent page shares its notes or fragrance journey, mood, and wear occasions so you can compare before ordering.",
    href: "/scents",
    cta: "Compare scents",
  },
  {
    question: "Where are the spray and dry-down videos?",
    answer:
      "Studio scent films are being prepared for the full scent family, including THEON and KAMEIRA. Follow Instagram or join launch updates to see spray texture, first impression, and dry-down clips as they release.",
    href: brand.instagramUrl,
    cta: "Follow on Instagram",
  },
];

export function LaunchFaq() {
  return (
    <section className="border-b border-black/10 py-12 sm:py-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-gold)]">
              Before You Order
            </p>
            <h2 className="mt-5 max-w-xl text-[clamp(2.8rem,6vw,5.8rem)] font-medium leading-[0.9] tracking-[-0.07em]">
              Clear answers, no guesswork.
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-[var(--color-copy)]">
              Find answers about delivery, returns, and choosing your scent.
              Full policies are linked below each answer.
            </p>
          </div>

          <div className="divide-y divide-black/10 rounded-[1.5rem] border border-black/10 bg-[rgba(255,250,241,0.62)]">
            {launchFaqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group p-5 open:bg-[rgba(202,158,91,0.06)] sm:p-6"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-medium tracking-[-0.03em]">
                  <span>{faq.question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/12 text-lg leading-none text-[var(--color-gold)] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-4 max-w-3xl text-sm leading-7 text-black/64">
                  <p>{faq.answer}</p>
                  <Link
                    href={faq.href}
                    className="mt-4 inline-flex text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)] transition hover:text-[var(--color-amber)]"
                    target={faq.href.startsWith("http") ? "_blank" : undefined}
                    rel={faq.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {faq.cta}
                  </Link>
                </div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
