import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { brand } from "@/content/brand";

export function FloatingWhatsAppButton() {
  return (
    <TrackedAnchor
      href={brand.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      trackingLabel="Text us for scent advice"
      trackingLocation="floating_whatsapp"
      aria-label="Text TARA on WhatsApp for scent advice"
      className="floating-whatsapp fixed bottom-28 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#128c4a] bg-[#25D366] text-[var(--color-onyx-black)] shadow-[0_18px_60px_rgba(18,140,74,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-[#1fb85a] sm:right-6 xl:bottom-6"
    >
      <SiteIcon name="whatsapp" className="h-6 w-6 text-[var(--color-onyx-black)]" />
      <span className="sr-only">Text TARA on WhatsApp for scent advice</span>
    </TrackedAnchor>
  );
}
