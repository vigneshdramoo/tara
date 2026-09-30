import type { Scent, ScentGalleryAsset } from "@/types/content";
import { commercialOffers, scentCommerceProfiles } from "@/content/commercial";

const gallery: ScentGalleryAsset[] = [
  ["eliora-50ml-hero", "50 ml", "ELIORA Eau de Parfum 50 ml bottle"],
  [
    "eliora-50ml-angle",
    "Alternate angle",
    "ELIORA 50 ml bottle from an alternate angle",
  ],
  [
    "eliora-label-detail",
    "Label detail",
    "Close-up of the ELIORA label and Champagne Gold fragrance",
  ],
  [
    "eliora-fragrance-world",
    "Fragrance world",
    "ELIORA with citrus, pink pepper, white florals and sheer woods",
  ],
  ["eliora-8ml", "8 ml", "ELIORA Eau de Parfum 8 ml travel-size bottle"],
  [
    "eliora-50ml-8ml-scale",
    "Both sizes",
    "ELIORA 50 ml and 8 ml bottles shown together for scale",
  ],
  ["eliora-in-hand", "In hand", "ELIORA 50 ml bottle held in hand for scale"],
].map(([stem, title, alt]) => ({
  src: `/scents/eliora/${stem}.webp`,
  title,
  alt,
  caption: alt,
  width: 1122,
  height: 1402,
  responsiveWidths: [320, 640, 960, 1122],
  fit: "contain",
}));

export const eliora: Scent = {
  slug: "eliora",
  theme: "eliora",
  name: "ELIORA",
  number: "04",
  audience: "For Her",
  status: "available",
  isNew: false,
  tagline: "Radiance after dark",
  primaryHook: "Clear stone. Hidden gold.",
  description:
    "ELIORA is a golden floral-musk made for the hour when daylight becomes secretive. A sparkling citrus-spice opening gives way to creamy white florals before clean musk, amber skin, and sheer woods settle close. Its radiance is intimate, softly mysterious, and remembered after the room goes quiet.",
  line: "Golden lift / Creamy white florals / Amber skin",
  summary:
    "ELIORA opens with a sparkling golden lift, unfolds into creamy white florals and soft spice, then settles into clean musk, amber skin, and sheer woods.",
  story:
    "The last warm light of the day does not fill a room. It finds things. Hold golden rutilated quartz at the right angle and fine threads appear — radiance that was always there, waiting to be found.",
  storyLead:
    "A sparkling golden lift of citrus and soft spice. Jasmine, neroli and creamy white florals. Clean musk, amber skin and sheer woods, close.",
  storySignature: "Nothing is added at dusk. Something is revealed.",
  notes: {
    top: ["Sparkling citrus", "Aldehydic shimmer", "Pink pepper"],
    heart: ["Jasmine", "Neroli", "Ylang-ylang"],
    base: ["Clean musk", "Amber skin", "Sheer woods"],
  },
  profile: scentCommerceProfiles.eliora,
  mood: ["Radiant", "Intimate", "Softly mysterious", "Quietly magnetic"],
  wear: ["Golden hour", "Evening rituals", "After-dark closeness"],
  finish:
    "Clean musk, amber skin, soft vanilla warmth, sheer woods, and velvet shadow.",
  character:
    "Remembered radiance: warm, intimate, softly spiced, and revealed in proximity.",
  quote: "Nothing is added at dusk. Something is revealed.",
  storyMantra: "Radiance, remembered.",
  storyArc: [
    {
      label: "Sparkle",
      title: "Discovery",
      body: "Sparkling citrus, aldehydic shimmer, pink pepper, and soft spice create a golden lift noticed across the room.",
    },
    {
      label: "Bloom",
      title: "Radiance",
      body: "Jasmine, neroli, ylang-ylang, and creamy white florals appear like threads found by the last amber light.",
    },
    {
      label: "Skin",
      title: "Intimacy",
      body: "Clean musk, amber skin, sheer woods, and velvet shadow remain after the light has gone.",
    },
  ],
  size: "50 ml / 8 ml Eau de Parfum",
  price: commercialOffers.fullBottle.price,
  regularPrice: commercialOffers.fullBottle.regularPrice,
  launchPrice: commercialOffers.fullBottle.launchPrice,
  priceInSen: commercialOffers.fullBottle.priceInSen,
  launch: "Fragrance No. 04 / Eau de Parfum",
  visual: gallery[0],
  homeVisual: gallery[0],
  gallery,
  interactiveGallery: true,
  editorialHeading: "Clear stone. Hidden gold.",
  editorialBody: "Radiance after dark.",
  editorial: {
    src: "/scents/eliora/eliora-editorial-wide.webp",
    alt: "ELIORA beside golden rutilated quartz in the last amber light of twilight",
    width: 1916,
    height: 821,
    responsiveWidths: [320, 640, 960, 1916],
  },
  editorialMobile: {
    src: "/scents/eliora/eliora-editorial-mobile.webp",
    alt: "ELIORA beside golden rutilated quartz in a portrait twilight composition",
    width: 941,
    height: 1672,
    responsiveWidths: [320, 640, 941],
  },
  seo: {
    title: "ELIORA Eau de Parfum | TARA Scents",
    description:
      "Discover ELIORA Eau de Parfum by TARA Scents: sparkling citrus, soft spice, creamy white florals, clean musk, amber skin, and sheer woods.",
  },
};
