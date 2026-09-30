import type { Scent, ScentGalleryAsset } from "@/types/content";
import { commercialOffers, scentCommerceProfiles } from "@/content/commercial";

const gallery: ScentGalleryAsset[] = [
  ["maris-50ml-hero", "50 ml", "MARIS Eau de Parfum 50 ml bottle"],
  [
    "maris-50ml-angle",
    "Alternate angle",
    "MARIS Eau de Parfum 50 ml bottle from an alternate angle",
  ],
  [
    "maris-label-detail",
    "Label detail",
    "Close-up of the MARIS label and Teal Mist fragrance in its glass bottle",
  ],
  [
    "maris-fragrance-world",
    "Fragrance world",
    "MARIS Eau de Parfum with bergamot, sage, mineral stone and driftwood",
  ],
  ["maris-8ml", "8 ml", "MARIS Eau de Parfum 8 ml travel-size bottle"],
  [
    "maris-50ml-8ml-scale",
    "Both sizes",
    "MARIS 50 ml and 8 ml Eau de Parfum bottles shown together for scale",
  ],
  [
    "maris-in-hand",
    "In hand",
    "MARIS Eau de Parfum 50 ml bottle held in hand for scale",
  ],
].map(([stem, title, alt]) => ({
  src: `/scents/maris/${stem}.webp`,
  title,
  alt,
  caption: alt,
  width: 1122,
  height: 1402,
  responsiveWidths: [320, 640, 960, 1122],
  fit: "contain",
}));

export const maris: Scent = {
  slug: "maris",
  theme: "maris",
  name: "MARIS",
  number: "03",
  audience: "For Everyone",
  status: "available",
  isNew: false,
  tagline: "Where air meets skin",
  primaryHook: "Salt. Signal. Silence.",
  description:
    "MARIS is not the sea in daylight. It opens like salt air at the edge of midnight: cool sage, bergamot, and mineral clarity cutting through dark water. Mineral amber and transparent woods create a narrow signal of warmth before sandalwood, driftwood, and skin musk settle close. Nocturnal, composed, and quietly magnetic.",
  line: "Salt air / Mineral amber / Skin musk",
  summary:
    "MARIS opens with salt air, green sage, and cool bergamot, moves into mineral amber and transparent woods, then settles into sandalwood, driftwood, and skin musk.",
  story:
    "The sea after dark loses colour, then distance, then the horizon. What remains is weather on your face — and a narrow light crossing the fog at intervals, telling you where you are.",
  storyLead:
    "Salt air, green sage, cool bergamot. Mineral amber through cold. Sandalwood, driftwood, skin musk.",
  storySignature: "MARIS. Salt. Signal. Silence.",
  notes: {
    top: ["Salt air", "Green sage", "Cool bergamot"],
    heart: ["Mineral amber", "Light through fog", "Transparent woods"],
    base: ["Sandalwood", "Driftwood", "Skin musk"],
  },
  profile: scentCommerceProfiles.maris,
  mood: ["Nocturnal", "Mineral", "Composed", "Quietly magnetic"],
  wear: ["After rain", "Late drives", "White linen at night"],
  finish: "Sandalwood, driftwood, skin musk, moss polish, and an amber shadow.",
  character:
    "Poise under weather: marine freshness shaped by mineral warmth, wood, and skin.",
  quote: "Poise under weather.",
  storyMantra: "Not coastal. Composed.",
  storyArc: [
    {
      label: "Air",
      title: "Exposure",
      body: "Salt air, green sage, cool bergamot, and mineral clarity open like the horizon disappearing into fog.",
    },
    {
      label: "Signal",
      title: "Radiance",
      body: "Mineral amber and transparent woods arrive through the cold like a narrow beam finding one plane of stone.",
    },
    {
      label: "Skin",
      title: "Intimacy",
      body: "Sandalwood, driftwood, and skin musk settle close. The weather is gone; the trace remains.",
    },
  ],
  size: "50 ml / 8 ml Eau de Parfum",
  price: commercialOffers.fullBottle.price,
  regularPrice: commercialOffers.fullBottle.regularPrice,
  launchPrice: commercialOffers.fullBottle.launchPrice,
  priceInSen: commercialOffers.fullBottle.priceInSen,
  launch: "Fragrance No. 03 / Eau de Parfum",
  visual: gallery[0],
  homeVisual: gallery[0],
  gallery,
  interactiveGallery: true,
  editorialHeading: "Poise under weather.",
  editorialBody: "Salt. Signal. Silence.",
  editorial: {
    src: "/scents/maris/maris-editorial-wide.webp",
    alt: "MARIS Eau de Parfum beside raw Labradorite under a narrow amber signal light",
    width: 1916,
    height: 821,
    responsiveWidths: [320, 640, 960, 1916],
  },
  editorialMobile: {
    src: "/scents/maris/maris-editorial-mobile.webp",
    alt: "MARIS Eau de Parfum beside raw Labradorite in a portrait composition",
    width: 941,
    height: 1672,
    responsiveWidths: [320, 640, 941],
  },
  seo: {
    title: "MARIS Eau de Parfum | TARA Scents",
    description:
      "Discover MARIS Eau de Parfum by TARA Scents. Salt air, green sage, cool bergamot, mineral amber, sandalwood, driftwood, and skin musk.",
  },
};
