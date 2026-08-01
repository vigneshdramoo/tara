import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { brand } from "@/content/brand";

const filmDetails = [
  "Actual spray cloud and first impression",
  "Dry-down notes after warm skin contact",
  "Malaysia humidity and air-cond wear context",
];

export function ScentFilmTeaser() {
  return (
    <section className="border-b border-black/10 py-16 sm:py-24">
      <Container>
        <div className="grid gap-8 overflow-hidden rounded-[1.8rem] border border-black/10 bg-[linear-gradient(135deg,rgba(10,10,10,0.96)_0%,rgba(26,51,74,0.92)_58%,rgba(202,158,91,0.58)_100%)] p-5 text-[var(--color-ivory)] shadow-[0_24px_90px_rgba(26,51,74,0.18)] sm:p-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div
            className="relative min-h-[260px] overflow-hidden rounded-[1.3rem] border border-white/14 bg-black/28"
            aria-label="Editorial preview frame for upcoming TARA scent films"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_36%_24%,rgba(202,158,91,0.45),transparent_28%),linear-gradient(120deg,rgba(247,243,235,0.08),transparent_46%)]" />
            <div className="absolute left-1/2 top-1/2 h-28 w-20 -translate-x-1/2 -translate-y-1/2 rounded-b-3xl rounded-t-xl border border-white/22 bg-white/10 shadow-[0_0_70px_rgba(247,243,235,0.18)]" />
            <div className="absolute left-1/2 top-[32%] h-12 w-16 -translate-x-1/2 rounded-t-xl border border-white/22 bg-black/48" />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/14 bg-black/24 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-white/64">
              <span className="h-2 w-2 rounded-full bg-[#ff6a4d]" />
              Studio Films Next
            </div>
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/12 bg-black/24 p-4 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-gold)]">
                Spray / Skin / Dry-Down
              </p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Short scent films are being cut to show how each fragrance moves
                from first spray to skin memory.
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold)]">
              Video Content
            </p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[0.88] tracking-[-0.07em]">
              See the spray before you commit.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
              Fragrance is physical. TARA’s next content priority is short,
              mobile-first scent films for the full scent family, including new
              launch THEON, so shoppers can see texture, setting,
              and dry-down cues before buying.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {filmDetails.map((detail) => (
                <div
                  key={detail}
                  className="rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-sm leading-6 text-white/68"
                >
                  <SiteIcon
                    name="spark"
                    className="mb-3 h-4 w-4 text-[var(--color-gold)]"
                  />
                  {detail}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={brand.instagramUrl}
                variant="primary"
                trackingLocation="homepage_scent_film_teaser"
              >
                Follow For Films
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                className="border-white/18 text-white hover:bg-white/10"
                trackingLocation="homepage_scent_film_teaser"
              >
                Ask For Scent Advice
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
