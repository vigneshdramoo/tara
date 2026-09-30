import type { Scent, ScentGalleryAsset } from "@/types/content";
import { commercialOffers, scentCommerceProfiles } from "@/content/commercial";

const gallery: ScentGalleryAsset[] = [
  ["zephyr-50ml-hero", "50 ml", "ZEPHYR Eau de Parfum 50 ml bottle"],
  [
    "zephyr-50ml-angle",
    "Alternate angle",
    "ZEPHYR Eau de Parfum 50 ml bottle from an alternate angle",
  ],
  [
    "zephyr-label-detail",
    "Label detail",
    "Close-up of the ZEPHYR label and glass bottle",
  ],
  [
    "zephyr-fragrance-world",
    "Fragrance world",
    "ZEPHYR Eau de Parfum with citrus, white flowers, dry moss and cedarwood",
  ],
  ["zephyr-8ml", "8 ml", "ZEPHYR Eau de Parfum 8 ml travel-size bottle"],
  [
    "zephyr-50ml-8ml-scale",
    "Both sizes",
    "ZEPHYR 50 ml and 8 ml Eau de Parfum bottles shown together for scale",
  ],
  [
    "zephyr-in-hand",
    "In hand",
    "ZEPHYR Eau de Parfum 50 ml bottle held in hand for scale",
  ],
].map(([stem, title, alt]) => ({
  src: `/scents/zephyr/${stem}.webp`,
  title,
  alt,
  caption: alt,
  width: 1122,
  height: 1402,
  responsiveWidths: [320, 640, 960, 1122],
  fit: "contain",
}));

export const zephyr: Scent = {
  slug: "zephyr",
  theme: "zephyr",
  name: "ZEPHYR",
  number: "02",
  audience: "For Him",
  status: "available",
  isNew: false,
  tagline: "Breathe the infinite",
  primaryHook: "Bright air. Tailored warmth.",
  description:
    "ZEPHYR is clean masculine freshness with warmth underneath. Sparkling citrus and aldehydic lift create a bright first impression, like morning light cutting through glass. The heart moves into Hedione radiance and a smooth cedarwood aura before clean musks, ambroxan warmth, and dry moss settle close to skin. It is polished, magnetic, and built to be noticed without trying.",
  line: "Sparkling citrus / Cedarwood aura / Clean musks",
  summary:
    "ZEPHYR opens with sparkling citrus and aldehydic lift, moves through radiant cedarwood air, then settles into clean musks, ambroxan warmth, and dry moss.",
  story:
    "Zephyrus was the west wind — the gentlest of the four, and the one the Greeks trusted with spring. Not the wind that broke things. The wind that moved them.",
  storyLead:
    "Sparkling citrus and aldehydic lift. A radiant cedarwood aura. Clean musks, ambroxan warmth and dry moss, close to skin.",
  storySignature: "ZEPHYR. Bright air. Tailored warmth.",
  notes: {
    top: ["Sparkling citrus", "Aldehydic lift", "Brisk air"],
    heart: ["Hedione radiance", "Cedarwood aura"],
    base: ["Clean musks", "Ambroxan warmth", "Dry moss"],
  },
  profile: scentCommerceProfiles.zephyr,
  mood: ["Fresh", "Airy", "Confident", "Refined"],
  wear: [
    "Morning routines",
    "Professional settings",
    "Travel",
    "Evening transitions",
  ],
  finish: "Clean musks, ambroxan warmth, dry moss and a smooth woody trail.",
  character: "Presence without weight: polished, magnetic and quietly assured.",
  quote: "Presence without weight.",
  storyMantra: "Bright air. Tailored warmth.",
  storyArc: [
    {
      label: "Clarity",
      title: "First Light",
      body: "Sparkling citrus, aldehydic lift and brisk air open like low morning sun crossing glass and stone.",
    },
    {
      label: "Confidence",
      title: "Urban Radiance",
      body: "Hedione radiance and cedarwood aura create a polished, tailored clean feel with architecture beneath the brightness.",
    },
    {
      label: "Magnetism",
      title: "Drawn Closer",
      body: "Clean musks, ambroxan warmth and dry moss settle close to skin: clean from a distance, magnetic up close.",
    },
  ],
  size: "50 ml / 8 ml Eau de Parfum",
  price: commercialOffers.fullBottle.price,
  regularPrice: commercialOffers.fullBottle.regularPrice,
  launchPrice: commercialOffers.fullBottle.launchPrice,
  priceInSen: commercialOffers.fullBottle.priceInSen,
  launch: "Fragrance No. 02 / Eau de Parfum",
  visual: gallery[0],
  homeVisual: gallery[0],
  gallery,
  interactiveGallery: true,
  editorialHeading: "Presence without weight.",
  editorialBody: "Bright air. Tailored warmth.",
  editorial: {
    src: "/scents/zephyr/zephyr-editorial-wide.webp",
    alt: "ZEPHYR Eau de Parfum with blue mineral forms in warm architectural morning light",
    width: 1916,
    height: 821,
    responsiveWidths: [320, 640, 960, 1916],
  },
  editorialMobile: {
    src: "/scents/zephyr/zephyr-editorial-mobile.webp",
    alt: "ZEPHYR Eau de Parfum with blue mineral forms in a portrait composition",
    width: 941,
    height: 1672,
    responsiveWidths: [320, 640, 941],
  },
  seo: {
    title: "ZEPHYR Eau de Parfum | TARA Scents",
    description:
      "Discover ZEPHYR Eau de Parfum by TARA Scents. Sparkling citrus and aldehydic lift move through radiant cedarwood air into clean musks, ambroxan warmth and dry moss.",
  },
};
