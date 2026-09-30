import type { Scent, ScentGalleryAsset } from "@/types/content";
import { commercialOffers, scentCommerceProfiles } from "@/content/commercial";

const gallery: ScentGalleryAsset[] = [
  ["ashoka-50ml-hero", "50 ml", "ASHOKA Eau de Parfum 50 ml bottle"],
  [
    "ashoka-50ml-angle",
    "Alternate angle",
    "ASHOKA 50 ml bottle from an alternate angle",
  ],
  [
    "ashoka-label-detail",
    "Label detail",
    "Close-up of the ASHOKA aubergine label and champagne lettering",
  ],
  [
    "ashoka-architectural",
    "Product portrait",
    "ASHOKA 50 ml bottle in a warm architectural setting",
  ],
  [
    "ashoka-fragrance-world",
    "Fragrance world",
    "ASHOKA with almond, dark vanilla, velvet orchid, amber woods and resin",
  ],
  ["ashoka-8ml", "8 ml", "ASHOKA Eau de Parfum 8 ml travel-size bottle"],
  [
    "ashoka-50ml-8ml-scale",
    "Both sizes",
    "ASHOKA 50 ml and 8 ml bottles shown together for scale",
  ],
  ["ashoka-in-hand", "In hand", "ASHOKA 50 ml bottle held in hand for scale"],
].map(([stem, title, alt]) => ({
  src: `/scents/ashoka/${stem}.webp`,
  title,
  alt,
  caption: alt,
  width: 1122,
  height: 1402,
  responsiveWidths: [320, 640, 960, 1122],
  fit: "contain",
}));

export const ashoka: Scent = {
  slug: "ashoka",
  theme: "ashoka",
  name: "ASHOKA",
  number: "06",
  audience: "For Her",
  status: "available",
  isNew: false,
  tagline: "A softness that stays",
  primaryHook: "Dark vanilla. Soft danger.",
  description:
    "ASHOKA is softness after dark. Almond cream and powdered warmth draw close first, smooth and addictive against the skin. Dark vanilla and velvet orchid deepen the heart, before amber woods, soft resin, and plush musk leave a warm, lingering trace.",
  line: "Almond cream / Velvet shadow / Warm skin",
  summary:
    "ASHOKA opens with almond cream, soft powder, and warm skin, blooms into dark vanilla and velvet orchid, then settles into amber woods, soft resin, and plush musk.",
  story:
    "It arrives soft first — almond cream and warm powder, asking nothing. Then dark vanilla and velvet orchid shift the tone. Sweet, still, but no longer innocent. Softness is the door; shadow is what waits beyond it.",
  storyLead:
    "Almond cream and soft powder. Dark vanilla and velvet orchid, half in shadow. Amber woods, labdanum warmth, soft resin, plush musk, and a trace left close to skin.",
  storySignature: "Light enters. Shadow keeps it.",
  notes: {
    top: ["Almond cream", "Soft powder", "Warm skin"],
    heart: ["Dark vanilla", "Heliotrope softness", "Velvet orchid"],
    base: ["Amber woods", "Labdanum warmth", "Soft resin", "Plush musk"],
  },
  profile: scentCommerceProfiles.ashoka,
  mood: ["Intimate", "Plush", "Mysterious", "Quietly dangerous"],
  wear: ["Close distance", "Low light", "After-dark softness"],
  finish:
    "Amber woods, labdanum warmth, soft resin, plush musk, skin heat, and a lasting vanilla trail.",
  character:
    "A dark sensual gourmand-floral whose almond-vanilla softness has gravity and a quiet edge.",
  quote: "Dark vanilla. Soft danger.",
  storyMantra: "Softness with a spine.",
  storyArc: [
    {
      label: "Tenderness",
      title: "Almond cream",
      body: "Almond cream, soft powder, heliotrope softness, and warm skin make the first approach inviting, tactile, and close. Soft first. Then something else.",
    },
    {
      label: "Soft danger",
      title: "Velvet shadow",
      body: "Dark vanilla, velvet orchid, musky floral warmth, and amber shadow shift the tone. Sweet, but not innocent.",
    },
    {
      label: "Afterglow",
      title: "Warm skin",
      body: "Amber woods, labdanum warmth, soft resin, plush musk, and skin heat leave warmth behind, longer than expected.",
    },
  ],
  size: "50 ml / 8 ml Eau de Parfum",
  price: commercialOffers.fullBottle.price,
  regularPrice: commercialOffers.fullBottle.regularPrice,
  launchPrice: commercialOffers.fullBottle.launchPrice,
  priceInSen: commercialOffers.fullBottle.priceInSen,
  launch: "Fragrance No. 06 / Eau de Parfum",
  visual: gallery[0],
  homeVisual: gallery[0],
  gallery,
  interactiveGallery: true,
  editorialHeading: "Dark vanilla. Soft danger.",
  editorialBody: "Light enters. Shadow keeps it.",
  editorial: {
    src: "/scents/ashoka/ashoka-editorial-wide.webp",
    alt: "ASHOKA beside raw purple fluorite receiving low warm light",
    width: 1916,
    height: 821,
    responsiveWidths: [320, 640, 960, 1916],
  },
  editorialMobile: {
    src: "/scents/ashoka/ashoka-editorial-mobile.webp",
    alt: "ASHOKA beside raw purple fluorite in a portrait low-light composition",
    width: 941,
    height: 1672,
    responsiveWidths: [320, 640, 941],
  },
  seo: {
    title: "ASHOKA Eau de Parfum | TARA Scents",
    description:
      "Discover ASHOKA Eau de Parfum by TARA Scents: almond cream, soft powder, dark vanilla, velvet orchid, amber woods, soft resin, and plush musk.",
  },
};
