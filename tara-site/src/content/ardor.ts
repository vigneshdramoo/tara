import type { Scent, ScentGalleryAsset } from "@/types/content";
import { commercialOffers, scentCommerceProfiles } from "@/content/commercial";

const gallery: ScentGalleryAsset[] = [
  ["ardor-50ml-hero", "50 ml", "ARDOR Eau de Parfum 50 ml bottle"],
  [
    "ardor-50ml-angle",
    "Alternate angle",
    "ARDOR 50 ml bottle from an alternate angle",
  ],
  [
    "ardor-label-detail",
    "Label detail",
    "Close-up of the ARDOR black label and burnished copper lettering",
  ],
  [
    "ardor-fragrance-world",
    "Fragrance world",
    "ARDOR with black tea, cardamom, lavender shadow, amber resin and woods",
  ],
  ["ardor-8ml", "8 ml", "ARDOR Eau de Parfum 8 ml travel-size bottle"],
  [
    "ardor-50ml-8ml-scale",
    "Both sizes",
    "ARDOR 50 ml and 8 ml bottles shown together for scale",
  ],
  ["ardor-in-hand", "In hand", "ARDOR 50 ml bottle held in hand for scale"],
].map(([stem, title, alt]) => ({
  src: `/scents/ardor/${stem}.webp`,
  title,
  alt,
  caption: alt,
  width: 1122,
  height: 1402,
  responsiveWidths: [320, 640, 960, 1122],
  fit: "contain",
}));

export const ardor: Scent = {
  slug: "ardor",
  theme: "ardor",
  name: "ARDOR",
  number: "05",
  audience: "For Him",
  status: "available",
  isNew: false,
  tagline: "Ignite your presence",
  primaryHook: "Heat held in restraint.",
  description:
    "ARDOR is heat held in restraint. Black tea and cardamom open with dry, magnetic tension, while warm spice and lavender shadow pull the fragrance darker. Tonka, labdanum resin, cedarwood, and amber musk settle close to skin. It does not fill a room. It waits to be found in it.",
  line: "Black tea / Cardamom heat / Skin warmth",
  summary:
    "ARDOR opens with dry black tea, cardamom, and warm spice before lavender shadow and amber heat settle into tonka, labdanum resin, cedarwood, and skin-close musk.",
  story:
    "Dark stone. Contained heat. ARDOR is built around controlled magnetism: the charge of a first signal, the composure to hold it, and the intimacy of the distance between two people.",
  storyLead:
    "Black tea. Cardamom heat. Warm spice. Lavender shadow and amber, held deliberately close. Tonka, resin, cedarwood and skin.",
  storySignature: "It does not fill a room. It waits to be found in it.",
  notes: {
    top: ["Black tea", "Cardamom", "Warm spice"],
    heart: ["Lavender shadow", "Amber heat", "Polished woods"],
    base: ["Tonka", "Labdanum resin", "Cedarwood", "Amber musk"],
  },
  profile: scentCommerceProfiles.ardor,
  mood: ["Dark", "Polished", "Controlled", "Magnetic"],
  wear: ["Evening presence", "Close encounters", "After-dark rituals"],
  finish:
    "Tonka, labdanum resin, cedarwood, amber musk, and quiet skin warmth.",
  character:
    "A dark masculine spicy amber shaped by restrained heat and controlled magnetism.",
  quote: "Heat held in restraint.",
  storyMantra: "Dark spice. Quiet control.",
  storyArc: [
    {
      label: "Ignition",
      title: "First signal",
      body: "Black tea, cardamom, and warm spice create a dry magnetic opening. A signal, not a statement.",
    },
    {
      label: "Restraint",
      title: "Quiet control",
      body: "Lavender shadow, amber heat, and polished woods hold the center with composure. Dark spice. Quiet control.",
    },
    {
      label: "Proximity",
      title: "Close distance",
      body: "Tonka, labdanum resin, cedarwood, amber musk, and skin warmth remain. Built for the distance between two people.",
    },
  ],
  size: "50 ml / 8 ml Eau de Parfum",
  price: commercialOffers.fullBottle.price,
  regularPrice: commercialOffers.fullBottle.regularPrice,
  launchPrice: commercialOffers.fullBottle.launchPrice,
  priceInSen: commercialOffers.fullBottle.priceInSen,
  launch: "Fragrance No. 05 / Eau de Parfum",
  visual: gallery[0],
  homeVisual: gallery[0],
  gallery,
  interactiveGallery: true,
  editorialHeading: "Heat held in restraint.",
  editorialBody: "Dark spice. Quiet control.",
  editorial: {
    src: "/scents/ardor/ardor-editorial-wide.webp",
    alt: "ARDOR beside raw dark stone lit by a restrained ember glow",
    width: 1916,
    height: 821,
    responsiveWidths: [320, 640, 960, 1916],
  },
  editorialMobile: {
    src: "/scents/ardor/ardor-editorial-mobile.webp",
    alt: "ARDOR beside raw dark stone in a portrait ember-lit composition",
    width: 941,
    height: 1672,
    responsiveWidths: [320, 640, 941],
  },
  seo: {
    title: "ARDOR Eau de Parfum | TARA Scents",
    description:
      "Discover ARDOR Eau de Parfum by TARA Scents: black tea, cardamom, warm spice, lavender shadow, labdanum resin, cedarwood, and amber musk.",
  },
};
