import type { Scent, ScentGalleryAsset } from "@/types/content";
import { commercialOffers, scentCommerceProfiles } from "@/content/commercial";

const gallery: ScentGalleryAsset[] = [
  ["aureya-50ml-hero", "50 ml", "AUREYA Eau de Parfum 50 ml bottle"],
  [
    "aureya-50ml-angle",
    "Alternate angle",
    "AUREYA Eau de Parfum 50 ml bottle from an alternate angle",
  ],
  [
    "aureya-label-detail",
    "Label detail",
    "Close-up of the AUREYA label and glass bottle",
  ],
  [
    "aureya-fragrance-world",
    "Fragrance world",
    "AUREYA Eau de Parfum in a luminous floral and golden fragrance setting",
  ],
  ["aureya-8ml", "8 ml", "AUREYA Eau de Parfum 8 ml travel-size bottle"],
  [
    "aureya-50ml-8ml-scale",
    "Both sizes",
    "AUREYA 50 ml and 8 ml Eau de Parfum bottles shown together for scale",
  ],
  [
    "aureya-in-hand",
    "In hand",
    "AUREYA Eau de Parfum 50 ml bottle held in hand for scale",
  ],
].map(([stem, title, alt]) => ({
  src: `/scents/aureya/${stem}.webp`,
  title,
  alt,
  caption: alt,
  width: 1122,
  height: 1402,
  responsiveWidths: [320, 640, 960, 1122],
  fit: "contain",
}));

export const aureya: Scent = {
  slug: "aureya",
  name: "AUREYA",
  number: "01",
  audience: "For Her",
  status: "available",
  isNew: false,
  tagline: "Dawn of Radiance",
  primaryHook: "Soft power. Golden memory.",
  description:
    "AUREYA is soft confidence in fragrance form. Pear brightness and neroli light open like first morning through linen curtains, before jasmine and white petals bloom with quiet grace. As it settles, white musk, golden amber, and tonka warmth wrap the skin in a luminous trail that feels comforting, feminine, and quietly assured.",
  line: "Pear / Neroli / Jasmine / Golden amber",
  summary:
    "AUREYA opens with pear brightness and sheer neroli, blooms into jasmine and white petals, then settles into white musk, golden amber, and tonka warmth.",
  story:
    "Aurora opened the gates of morning. The Greeks said the dew was dawn, remembering someone she loved.",
  storyLead:
    "AUREYA carries that light on skin: pear brightness and neroli, jasmine and white petals, settling into white musk, golden amber and tonka warmth.",
  storySignature: "AUREYA. Dawn of Radiance.",
  notes: {
    top: ["Pear brightness", "Neroli light"],
    heart: ["Jasmine", "White petals"],
    base: ["White musk", "Golden amber", "Tonka warmth"],
  },
  profile: scentCommerceProfiles.aureya,
  mood: ["Radiant", "Graceful", "Assured"],
  wear: ["Morning rituals", "Silk evenings", "Soft entrances"],
  finish: "White musk, golden amber and tonka warmth.",
  character: "Radiant, graceful, comforting, quietly assured.",
  quote: "Soft power. Golden memory.",
  size: "50 ml / 8 ml Eau de Parfum",
  price: commercialOffers.fullBottle.price,
  regularPrice: commercialOffers.fullBottle.regularPrice,
  launchPrice: commercialOffers.fullBottle.launchPrice,
  priceInSen: commercialOffers.fullBottle.priceInSen,
  launch: "Fragrance No. 01 / Eau de Parfum",
  visual: gallery[0],
  homeVisual: gallery[0],
  gallery,
  interactiveGallery: true,
  theme: "aureya",
  editorialHeading: "Soft power. Golden memory.",
  editorialBody:
    "Pear brightness and neroli light open like first morning through linen curtains.",
  editorial: {
    src: "/scents/aureya/aureya-editorial-wide.webp",
    alt: "AUREYA Eau de Parfum with pale Rose Quartz illuminated by golden dawn light",
    width: 1916,
    height: 821,
    responsiveWidths: [320, 640, 960, 1916],
  },
  editorialMobile: {
    src: "/scents/aureya/aureya-editorial-mobile.webp",
    alt: "AUREYA Eau de Parfum with pale Rose Quartz in a portrait composition of golden dawn light",
    width: 941,
    height: 1672,
    responsiveWidths: [320, 640, 941],
  },
  seo: {
    title: "AUREYA Eau de Parfum | TARA Scents",
    description:
      "Discover AUREYA Eau de Parfum by TARA Scents. Pear brightness and neroli light bloom into jasmine and white petals, settling into white musk, golden amber and tonka warmth.",
  },
};
