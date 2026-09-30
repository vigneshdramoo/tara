import type { Scent, ScentGalleryAsset } from "@/types/content";

const gallery: ScentGalleryAsset[] = [
  ["kameira-50ml-hero", "50 ml", "KAMEIRA Eau de Parfum 50 ml bottle"],
  [
    "kameira-50ml-angle",
    "Alternate angle",
    "KAMEIRA Eau de Parfum 50 ml bottle from an alternate angle",
  ],
  [
    "kameira-label-detail",
    "Label detail",
    "Close-up of the KAMEIRA label and glass bottle",
  ],
  [
    "kameira-fragrance-world",
    "Fragrance world",
    "KAMEIRA Eau de Parfum in a dark blackcurrant wine and amber setting",
  ],
  ["kameira-8ml", "8 ml", "KAMEIRA Eau de Parfum 8 ml travel-size bottle"],
  [
    "kameira-50ml-8ml-scale",
    "Both sizes",
    "KAMEIRA 50 ml and 8 ml Eau de Parfum bottles shown together for scale",
  ],
  [
    "kameira-in-hand",
    "In hand",
    "KAMEIRA Eau de Parfum 50 ml bottle held in hand for scale",
  ],
].map(([stem, title, alt]) => ({
  src: `/scents/kameira/${stem}.webp`,
  title,
  alt,
  caption: alt,
  width: 1122,
  height: 1402,
  responsiveWidths: [320, 640, 960, 1122],
  fit: "contain",
}));

export const kameira: Scent = {
  slug: "kameira",
  theme: "kameira",
  name: "KAMEIRA",
  number: "08",
  audience: "Warm gourmand",
  status: "available",
  price: "RM169",
  priceInSen: 16900,
  travelPrice: "RM45",
  tagline: "Desire, distilled.",
  line: "Blackcurrant Wine / Velvet Rose / Burnished Amber",
  summary: "Blackcurrant wine into velvet rose, closing on burnished amber.",
  story:
    "The Greeks named their heroines -eira. Sanskrit named desire kama — a god with a bow strung with honeybees, who was never once called cruel.",
  storyLead:
    "Both traditions agreed on one thing: wanting is not weakness. It is a force.",
  notes: { top: [], heart: [], base: [] },
  fragranceJourney: [
    "Blackcurrant Wine",
    "Velvet Rose",
    "Warm Gourmand Glow",
    "Burnished Amber",
  ],
  profile: {
    family: "Gourmand",
    audienceLabel: "Warm gourmand",
    temperature: "Warm",
    sweetness: "Soft",
    presence: "Skin-close",
    sampleAvailable: true,
    quizArchetype: "warm-gourmand",
  },
  mood: ["Warm", "Intimate", "Restrained"],
  wear: ["Evenings", "Close-range", "Air-conditioned rooms"],
  finish: "Burnished amber gold.",
  character: "Honeyed, golden, warm-skinned.",
  quote: "KAMEIRA. Desire, distilled.",
  size: "50 ml / 8 ml Eau de Parfum",
  launch: "Fragrance No. 08 / Eau de Parfum",
  visual: gallery[0],
  gallery,
  interactiveGallery: true,
  editorial: {
    src: "/scents/kameira/kameira-editorial-wide.webp",
    alt: "KAMEIRA Eau de Parfum with a deep rhodolite garnet and warm amber glow",
    width: 1672,
    height: 941,
    responsiveWidths: [320, 640, 960, 1672],
  },
  editorialMobile: {
    src: "/scents/kameira/kameira-editorial-mobile.webp",
    alt: "KAMEIRA Eau de Parfum with garnet and amber in a portrait composition",
    width: 941,
    height: 1672,
    responsiveWidths: [320, 640, 941],
  },
  seo: {
    title: "KAMEIRA Eau de Parfum | TARA Scents",
    description:
      "Discover KAMEIRA Eau de Parfum by TARA Scents. Blackcurrant wine into velvet rose, closing on burnished amber. Desire, distilled.",
  },
};
