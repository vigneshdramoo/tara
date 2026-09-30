import type {
  Cta,
  LinkItem,
  ScentFilterSegment,
  ScentProfile,
  VisualAsset,
} from "@/types/content";

type FullBottleOffer = {
  price: string;
  launchPrice: string;
  regularPrice: string;
  priceInSen: number;
  format: string;
  size: string;
  allocation: string;
};

type DiscoverySetOffer = {
  slug: string;
  name: string;
  type: "promo-set";
  audience: string;
  summary: string;
  price: string;
  priceInSen: number;
  format: string;
  size: string;
  sampleCount: number;
  visual: VisualAsset;
};

export const commercialOffers = {
  fullBottle: {
    price: "RM169 launch / RM239 regular",
    launchPrice: "RM169",
    regularPrice: "RM239",
    priceInSen: 16900,
    format: "Eau de Parfum",
    size: "50mL Eau de Parfum",
    allocation: "Launch allocation before RM239 regular pricing returns.",
  },
  discoverySet: {
    slug: "three-8ml-promo",
    name: "3 x 8mL Promo Set",
    type: "promo-set",
    audience: "Launch promo",
    summary:
      "Choose any three TARA 8mL Eau de Parfum scents for RM99. Choose exactly three different scents before adding your set to cart.",
    price: "RM99",
    priceInSen: 9900,
    format: "Eau de Parfum",
    size: "3 x 8mL Eau de Parfum",
    sampleCount: 3,
    visual: {
      src: "/editorial/tara-popup-8ml-rm99-optimized.webp",
      alt: "TARA 8mL launch special showing any 3 x 8mL Eau de Parfum scents for RM99.",
    },
  },
} as const satisfies {
  fullBottle: FullBottleOffer;
  discoverySet: DiscoverySetOffer;
};

export const purchaseReassurance = {
  title: "Purchase reassurance",
  shippingSummary:
    "West Malaysia usually 2-5 working days after dispatch; East Malaysia usually 4-8 working days after dispatch.",
  dispatchSummary:
    "In-stock orders are usually prepared within 1 to 3 working days after payment confirmation. Preorders ship according to launch allocation, stock arrival, and final house confirmation.",
  shippingFeeSummary:
    "Shipping is calculated after delivery details and is not included in the displayed item subtotal.",
  returnSummary:
    "Opened, sprayed, used, or tampered fragrance is not returnable for scent preference. Report damaged, missing, defective, or incorrect items within 48 hours.",
  paymentSummary:
    "Secure ToyyibPay checkout with Malaysian-friendly payment methods where enabled.",
  decisionDetails: [
    {
      title: "Delivery timing",
      body:
        "West Malaysia is usually 2 to 5 working days after dispatch. East Malaysia is usually 4 to 8 working days after dispatch. Remote areas, courier restrictions, weather, public holidays, and high-volume periods may take longer.",
    },
    {
      title: "Dispatch and preorder timing",
      body:
        "In-stock orders are usually prepared within 1 to 3 working days after payment confirmation. Preorders ship according to launch allocation, stock arrival, and final house confirmation.",
    },
    {
      title: "Shipping fees",
      body:
        "The current online checkout shows an item subtotal before shipping. TARA confirms any shipping fee separately after reviewing the delivery details; it is not silently added to the ToyyibPay handoff.",
    },
    {
      title: "Returns and 48-hour support",
      body:
        "Opened, used, sprayed, tampered, or damaged fragrance products are not returnable for scent preference or change of mind unless confirmed defective or incorrect by TARA. Damaged, missing, defective, or incorrect items should be reported within 48 hours of delivery.",
    },
  ],
  policyLinks: [
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const satisfies {
  title: string;
  shippingSummary: string;
  dispatchSummary: string;
  shippingFeeSummary: string;
  returnSummary: string;
  paymentSummary: string;
  decisionDetails: readonly {
    title: string;
    body: string;
  }[];
  policyLinks: LinkItem[];
};

export const checkoutExperience = {
  sequence: [
    "Select a 50mL bottle or the RM99 discovery set.",
    "Add the product and quantity to cart.",
    "Review cart subtotal, delivery handling, and policies.",
    "Enter delivery details at checkout, then continue to ToyyibPay.",
  ],
  cartBuilder: {
    eyebrow: "Cart-First Checkout",
    title: "Choose, add, review, then pay.",
    body:
      "Normal TARA orders start here: select your product, add it to cart, review the item subtotal and shipping status, then continue to checkout for delivery details and ToyyibPay payment.",
    badge: "Cart first / ToyyibPay next",
  },
  paymentFinality:
    "Payment is not taken on this page. For normal checkout, you enter delivery details first, then ToyyibPay captures payment on its hosted secure payment page.",
  shippingAtCheckout:
    "Calculated after delivery details",
  cartTotalNote:
    "This is the estimated total before shipping. Shipping is not included in the amount shown.",
  concierge: {
    eyebrow: "Need help choosing?",
    title:
      "Concierge order for gifting, events, bridal, wholesale, or multiple bottles.",
    body:
      "Use this form only when you need human help before paying: scent matching, gift advice, event orders, bridal sets, wholesale, pickup, or multiple-bottle requests. Delivery address is collected later if the order proceeds.",
    consent:
      "I understand this is a concierge request, not payment. TARA will confirm scent, quantity, delivery needs, and payment next steps personally.",
  },
} as const;

export const conciergeAssistance = {
  title: "Need help choosing?",
  body:
    "Message TARA for scent matching, gifting, bridal, event, wholesale, or discovery-set guidance before you commit.",
  primary: {
    label: "Ask A Scent Adviser",
    href:
      "https://wa.me/601143042883?text=Hi%20TARA%2C%20I%27d%20love%20help%20choosing%20a%20scent.",
    variant: "secondary",
  },
  note: "WhatsApp concierge keeps normal purchases human without replacing secure checkout.",
} as const satisfies {
  title: string;
  body: string;
  primary: Cta;
  note: string;
};

export const scentCommerceProfiles = {
  aureya: {
    family: "Soft floral amber",
    audienceLabel: "Luminous floral",
    temperature: "Warm",
    sweetness: "Soft",
    presence: "Noticeable",
    sampleAvailable: true,
    quizArchetype: "luminous-softness",
  },
  zephyr: {
    family: "Fresh woody citrus",
    audienceLabel: "Clean magnetic",
    temperature: "Cool",
    sweetness: "Dry",
    presence: "Noticeable",
    sampleAvailable: true,
    quizArchetype: "urban-radiance",
  },
  maris: {
    family: "Mineral woods",
    audienceLabel: "Mineral calm",
    temperature: "Cool",
    sweetness: "Dry",
    presence: "Skin-close",
    sampleAvailable: true,
    quizArchetype: "mineral-composure",
  },
  eliora: {
    family: "Golden floral musk",
    audienceLabel: "Golden after-dark",
    temperature: "Warm",
    sweetness: "Soft",
    presence: "Noticeable",
    sampleAvailable: true,
    quizArchetype: "hidden-radiance",
  },
  ashoka: {
    family: "Almond floral amber",
    audienceLabel: "Tender amber",
    temperature: "Warm",
    sweetness: "Creamy",
    presence: "Skin-close",
    sampleAvailable: true,
    quizArchetype: "tender-softness",
  },
  ardor: {
    family: "Spiced woody amber",
    audienceLabel: "Heated spice",
    temperature: "Warm",
    sweetness: "Dry",
    presence: "Magnetic",
    sampleAvailable: true,
    quizArchetype: "controlled-heat",
  },
  theon: {
    family: "Warm tea gourmand",
    audienceLabel: "Tea gourmand",
    temperature: "Warm",
    sweetness: "Creamy",
    presence: "Skin-close",
    sampleAvailable: true,
    quizArchetype: "tea-calm",
  },
} as const satisfies Record<string, ScentProfile>;

export const quizResultPriority = [
  "theon",
  "ardor",
  "ashoka",
  "eliora",
  "maris",
  "zephyr",
  "aureya",
] as const;

export const scentFilterSegments = [
  {
    id: "all",
    label: "All Scents",
    description: "Compare every current TARA 50mL fragrance in one place.",
  },
  {
    id: "fresh-mineral",
    label: "Fresh / Mineral",
    description: "Clean air, citrus lift, salt, sage, and polished clarity.",
    criteria: {
      familyIncludes: ["fresh", "mineral"],
      lineIncludes: ["citrus", "salt", "sage"],
      temperature: ["Cool"],
    },
  },
  {
    id: "floral-soft",
    label: "Floral / Soft",
    description: "White petals, almond silk, radiance, and intimate softness.",
    criteria: {
      familyIncludes: ["floral", "almond"],
      moodIncludes: ["soft", "tender", "radiant"],
      sweetness: ["Soft", "Creamy"],
    },
  },
  {
    id: "warm-gourmand",
    label: "Warm / Gourmand",
    description: "Tea, amber, tonka, spice, cream, and skin warmth.",
    criteria: {
      familyIncludes: ["gourmand", "amber", "spiced", "almond"],
      lineIncludes: ["tea", "tonka", "amber"],
      temperature: ["Warm"],
    },
  },
  {
    id: "woody-spicy",
    label: "Woody / Spicy",
    description: "Woods, moss, sandalwood, black tea, and controlled heat.",
    criteria: {
      familyIncludes: ["woody", "woods", "spiced"],
      lineIncludes: ["wood", "spice", "tea"],
      moodIncludes: ["magnetic", "commanding"],
    },
  },
  {
    id: "daily-evening",
    label: "Daily / Evening",
    description: "Easy signatures for work, quiet rituals, late plans, and gifting.",
    criteria: {
      wearIncludes: ["daily", "morning", "office", "evening", "night", "date"],
    },
  },
  {
    id: "skin-close-noticeable",
    label: "Skin-Close / Noticeable",
    description: "Polished presence that stays personal before it fills the room.",
    criteria: {
      presence: ["Skin-close", "Noticeable"],
    },
  },
] as const satisfies readonly ScentFilterSegment[];
