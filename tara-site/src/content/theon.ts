import type { Scent, ScentGalleryAsset } from "@/types/content";
import { commercialOffers, scentCommerceProfiles } from "@/content/commercial";

const gallery: ScentGalleryAsset[] = [
  ["theon-50ml-hero", "50 ml", "THEON Eau de Parfum 50 ml bottle"],
  [
    "theon-50ml-angle",
    "Alternate angle",
    "THEON 50 ml bottle from an alternate angle",
  ],
  [
    "theon-label-detail",
    "Label detail",
    "Close-up of the THEON warm ivory label and pale golden fragrance",
  ],
  [
    "theon-fragrance-world",
    "Fragrance world",
    "THEON with golden oolong, osmanthus, coconut cream, vanilla and sandalwood",
  ],
  ["theon-8ml", "8 ml", "THEON Eau de Parfum 8 ml travel-size bottle"],
  [
    "theon-50ml-8ml-scale",
    "Both sizes",
    "THEON 50 ml and 8 ml bottles shown together for scale",
  ],
  ["theon-in-hand", "In hand", "THEON 50 ml bottle held in hand for scale"],
].map(([stem, title, alt]) => ({
  src: `/scents/theon/${stem}.webp`,
  title,
  alt,
  caption: alt,
  width: 1122,
  height: 1402,
  responsiveWidths: [320, 640, 960, 1122],
  fit: "contain",
}));

export const theon: Scent = {
  slug: "theon",
  theme: "theon",
  name: "THEON",
  number: "07",
  audience: "For Everyone",
  status: "available",
  isNew: true,
  tagline: "Steeped in divine calm",
  primaryHook: "The warmth you return to.",
  description:
    "THEON is the warmth you return to. A bright bergamot lift opens like steam rising from a golden cup. Golden oolong, osmanthus, green tea, and coconut cream form the warm heart before soft vanilla, sandalwood, and warm musk settle quietly against the skin.",
  line: "Golden oolong / Osmanthus / Skin-close warmth",
  summary:
    "THEON opens with bergamot brightness, steeps into golden oolong, osmanthus, green tea, and coconut cream, then settles into soft vanilla, sandalwood, and warm musk.",
  story:
    "Before the house wakes, the lid lifts and steam rises — golden, unhurried, faintly floral. THEON turns a small daily ritual into something luminous: the pause is taken, the warmth is kept, and the sacred is found inside an ordinary warm moment.",
  storyLead:
    "Bergamot brightness and first steam. Golden oolong, osmanthus, green tea, and coconut cream. Soft vanilla, sandalwood, warm musk, and skin-close amber softness.",
  storySignature: "Light enters. Gold settles.",
  notes: {
    top: ["Bergamot brightness", "Bright citrus lift", "First steam"],
    heart: ["Golden oolong", "Osmanthus", "Green tea", "Coconut cream"],
    base: ["Soft vanilla", "Sandalwood", "Warm musk", "Amber softness"],
  },
  profile: scentCommerceProfiles.theon,
  mood: ["Calm", "Warm", "Contemplative", "Luminous"],
  wear: ["Morning rituals", "Quiet evenings", "Close daily wear"],
  finish:
    "Soft vanilla, sandalwood, warm musk, and skin-close amber softness held quietly on skin.",
  character:
    "A warm contemplative tea signature: creamy, intimate, composed, and quietly luxurious.",
  quote: "The warmth you return to.",
  storyMantra: "Warm stone. Quiet gold.",
  storyArc: [
    {
      label: "Brightness",
      title: "The lid lifts",
      body: "Bergamot brightness, clean citrus lift, first steam, and golden air make the first breath feel clear and unhurried.",
    },
    {
      label: "Ritual",
      title: "The pause is taken",
      body: "Golden oolong, osmanthus, green tea, and coconut cream create a warm tea ritual made for contemplation.",
    },
    {
      label: "Comfort",
      title: "Cream, quiet, and gold",
      body: "Coconut cream and soft vanilla bring tenderness without excess and comfort without weight.",
    },
    {
      label: "Intimacy",
      title: "The warmth is kept",
      body: "Sandalwood, warm musk, and skin-close amber softness draw inward. Soft enough to stay, calm enough to remember.",
    },
  ],
  size: "50 ml / 8 ml Eau de Parfum",
  price: commercialOffers.fullBottle.price,
  regularPrice: commercialOffers.fullBottle.regularPrice,
  launchPrice: commercialOffers.fullBottle.launchPrice,
  priceInSen: commercialOffers.fullBottle.priceInSen,
  launch: "Fragrance No. 07 / Eau de Parfum",
  visual: gallery[0],
  homeVisual: gallery[0],
  gallery,
  interactiveGallery: true,
  editorialHeading: "The warmth you return to.",
  editorialBody: "Light enters. Gold settles.",
  editorial: {
    src: "/scents/theon/theon-editorial-wide.webp",
    alt: "THEON beside raw Golden Calcite in soft golden morning light",
    width: 1916,
    height: 821,
    responsiveWidths: [320, 640, 960, 1916],
  },
  editorialMobile: {
    src: "/scents/theon/theon-editorial-mobile.webp",
    alt: "THEON beside raw Golden Calcite in a portrait golden morning composition",
    width: 941,
    height: 1672,
    responsiveWidths: [320, 640, 941],
  },
  seo: {
    title: "THEON Eau de Parfum | TARA Scents",
    description:
      "Discover THEON Eau de Parfum by TARA Scents: bergamot, golden oolong, osmanthus, green tea, coconut cream, soft vanilla, sandalwood, and warm musk.",
  },
};
