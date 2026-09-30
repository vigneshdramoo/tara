import type { BrandContent } from "@/types/content";
import { commercialOffers } from "@/content/commercial";

const whatsappNumber = "+01143042883";
const whatsappUrl =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ??
  "https://wa.me/601143042883?text=Hi%20TARA%2C%20I%27d%20love%20help%20with%20a%20fragrance%20order.";
const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@tarascents.com";
const instagramHandle = "@tara_scents.my";
const instagramUrl =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
  "https://instagram.com/tara_scents.my";

export const brand: BrandContent = {
  name: "TARA",
  tagline: "Illuminate the unseen",
  description:
    "TARA is a luxury fragrance house shaped by sensual restraint, editorial visuals, and eight high-end scents: Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, THEON, and KAMEIRA.",
  contactEmail,
  navigation: [
    { label: "Scents", href: "/scents" },
    { label: "Scent Quiz", href: "/quiz" },
    { label: "About", href: "/about" },
    { label: "Journal", href: "/journal" },
  ],
  footerLinks: [
    { label: "Scent Trail", href: "/popup" },
    { label: "About", href: "/about" },
    { label: "Journal", href: "/journal" },
    { label: "Scents", href: "/scents" },
    { label: "Preorder", href: "/preorder" },
    { label: "Contact", href: "/contact" },
  ],
  whatsappUrl,
  instagramUrl,
  socialLinks: [
    {
      label: "WhatsApp Concierge",
      href: whatsappUrl,
      icon: "whatsapp",
    },
    {
      label: "Instagram",
      href: instagramUrl,
      icon: "instagram",
    },
  ],
  newsletter: {
    title: "Stay close to the next drop.",
    body: "Receive launch alerts, private preorder windows, and first access to TARA scent rituals.",
  },
  home: {
    hero: {
      eyebrow: "TARA / Latest launches",
      title: "THEON + KAMEIRA",
      body: "Two new expressions from TARA’s latest launch. Intimate, wearable luxury from a Malaysian fragrance house.",
      note: `${commercialOffers.fullBottle.launchPrice} launch pricing for the 50mL bottle before ${commercialOffers.fullBottle.regularPrice} regular. Not ready for a bottle? Try any three 8mL scents for ${commercialOffers.discoverySet.price}.`,
      ctas: [
        {
          label: "Explore latest launches",
          href: "#latest-launches",
          variant: "primary",
        },
        {
          label: `Try Any 3 For ${commercialOffers.discoverySet.price}`,
          href: "/preorder?checkout=three-8ml-promo#secure-checkout",
          variant: "secondary",
        },
      ],
      metrics: [
        {
          label: "What is TARA?",
          value: "MY",
          description:
            "A registered Malaysian fragrance house for edited everyday luxury.",
          badges: ["SSM 202603110736"],
        },
        {
          label: "What is THEON?",
          value: "Tea",
          description:
            "Warm oolong, osmanthus, coconut cream, vanilla, woods, and musk.",
          badges: ["New Launch"],
        },
        {
          label: "Start Here",
          value: commercialOffers.discoverySet.price,
          description: `Try ${commercialOffers.discoverySet.size.toLowerCase()} before committing to 50mL.`,
          badges: ["FPX", "DuitNow", "Card"],
        },
      ],
      visual: {
        src: "/editorial/tara-theon-launch-hero-optimized.webp",
        alt: "THEON Eau de Parfum bottle in warm golden light with ivory drapery.",
        priority: true,
      },
    },
    story: {
      title: "Fragrance written like a private confession.",
      lead: "TARA was built for women and men who do not need noise to feel magnetic. The house moves through black glass, warm skin, polished tailoring, and the lingering emotion a scent leaves behind.",
      paragraphs: [
        "The first chapter now opens into eight scents. Aureya turns golden softness into quiet confidence. Zephyr turns clean masculine air into magnetic radiance. Maris introduces mineral freshness for skin, linen, and late light. Eliora brings golden floral warmth after dark. Ashoka adds tender almond-orchid softness. Ardor brings black tea, spice, and controlled heat. THEON steepens the house with warm oolong calm. KAMEIRA moves from blackcurrant wine into velvet rose, closing on burnished amber.",
        "Every formula is composed to feel close before it feels loud. You notice the texture first, then the temperature, then the memory it leaves on fabric and skin.",
      ],
      quote:
        "The point is not to fill the room. The point is to stay with someone after you leave it.",
      highlights: [
        "Scent family: Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, THEON",
        "First 100 bottles at RM169",
        "Any 3 x 8mL Eau de Parfum for RM99",
      ],
      visual: {
        src: "/editorial/tara-about-private-confession-optimized.webp",
        alt: "TARA perfume bottles in warm window light with soft fabric, styled for Fragrance written like a private confession.",
      },
    },
    trust: {
      eyebrow: "Order Assurance",
      title: "Luxury should feel as secure as it looks.",
      body: "Every order moves through encrypted checkout, personal confirmation, and direct house support from first inquiry to final delivery.",
      note: "No marketplace stock. No grey inventory. No anonymous dispatch.",
      guarantee: "100% authentic | Secure checkout | Personal confirmation",
      signals: [
        {
          title: "House-Sourced Only",
          body: "TARA ships directly from the brand, so authenticity and freshness stay controlled.",
          icon: "shield",
        },
        {
          title: "Secure Checkout",
          body: "Payments and order details are handled through encrypted flows and verified follow-up.",
          icon: "lock",
        },
        {
          title: "Concierge Guidance",
          body: "Need help choosing? The house can guide gifting, 8mL promo sets, and scent matching before you buy.",
          icon: "heart",
        },
        {
          title: "Small-Batch Launch",
          body: "The first 100 bottles are intentionally priced for early believers before regular RM239 pricing.",
          icon: "spark",
        },
      ],
      payments: [
        { label: "SSL", kind: "ssl" },
        { label: "Visa", kind: "visa" },
        { label: "Mastercard", kind: "mastercard" },
        { label: "PayPal", kind: "paypal" },
        { label: "Touch 'n Go", kind: "tng" },
      ],
    },
    eightMlPromo: {
      title: "Try three first. Commit after skin decides.",
      body: "Build a 3 x 8mL TARA discovery set for RM99 and move between radiance, control, mineral skin, golden warmth, soft almond florals, heated spice, and warm tea calm before committing to a full bottle.",
      primary: {
        label: "Order 3 x 8mL",
        href: "/preorder?checkout=three-8ml-promo#secure-checkout",
        variant: "primary",
      },
      secondary: {
        label: "Take The Quiz",
        href: "/quiz",
        variant: "secondary",
      },
      note: "Promo price RM99. Select any three 8mL scents; final mix is confirmed by concierge. Ask about launch-window discovery credit before upgrading to a full bottle.",
    },
    preorder: {
      title: "Reserve THEON or KAMEIRA.",
      body: "Find your next signature in our latest launches, or discover three scents on skin first.",
      primary: { label: "Preorder Now", href: "/preorder", variant: "primary" },
      secondary: {
        label: `Try 3 for ${commercialOffers.discoverySet.price}`,
        href: "/preorder?checkout=three-8ml-promo#secure-checkout",
        variant: "secondary",
      },
      note: "Full bottles are RM239 regular after launch allocation.",
    },
  },
  quizPage: {
    eyebrow: "Fragrance Quiz",
    title: "Find your scent identity in eight questions.",
    body: "Move through instinctive choices. TARA will read the pattern and match you to one of the current olfactive profiles.",
    note: "One answer at a time. No wrong answers. Only different temperatures.",
    intro:
      "This quiz is built like a private scent reading: one prompt at a time, each one unlocking the next. If the result still feels close, choose the 3 x 8mL RM99 promo set before committing to a full bottle.",
    encouragement:
      "Do not overthink it. Choose the answer your body recognizes first.",
    questions: [
      {
        id: "presence",
        prompt: "What kind of trail should linger after you leave?",
        options: [
          {
            value: "golden",
            label: "Golden memory",
            detail:
              "Pear light, jasmine silk, amber, and skin musk that glow close.",
            weights: { aureya: 3, zephyr: 0, maris: 1 },
          },
          {
            value: "tailored",
            label: "Urban radiance",
            detail:
              "Sparkling citrus, brisk air, polished woods, and warm musk.",
            weights: { aureya: 0, zephyr: 3, maris: 1 },
          },
          {
            value: "mineral",
            label: "Salt signal",
            detail: "Salt air, green sage, mineral amber, and skin musk.",
            weights: { aureya: 1, zephyr: 1, maris: 3 },
          },
        ],
      },
      {
        id: "entrance",
        prompt: "How do you want to enter a room?",
        options: [
          {
            value: "soft-arrival",
            label: "Soft arrival",
            detail: "Warm, graceful, and noticed slowly rather than announced.",
            weights: { aureya: 3, zephyr: 0, maris: 1 },
          },
          {
            value: "clean-command",
            label: "Clean command",
            detail: "Composed, sharp, and already in control before you speak.",
            weights: { aureya: 0, zephyr: 3, maris: 1 },
          },
          {
            value: "quiet-pull",
            label: "Quiet pull",
            detail:
              "Low-lit, close, and magnetic without asking for attention.",
            weights: { aureya: 1, zephyr: 1, maris: 3 },
          },
        ],
      },
      {
        id: "texture",
        prompt: "Which texture feels most like your skin today?",
        options: [
          {
            value: "warm-silk",
            label: "Warm silk",
            detail: "Light, glowing, and soft enough to hold memory.",
            weights: { aureya: 3, zephyr: 1, maris: 0 },
          },
          {
            value: "cool-glass",
            label: "Cool glass",
            detail: "Fresh, polished, bright, and impossible to blur.",
            weights: { aureya: 0, zephyr: 3, maris: 1 },
          },
          {
            value: "wet-stone",
            label: "Wet stone",
            detail: "Mineral, calm, clean, and still warm underneath.",
            weights: { aureya: 1, zephyr: 1, maris: 3 },
          },
        ],
      },
      {
        id: "timing",
        prompt: "When do you feel most magnetic?",
        options: [
          {
            value: "golden-morning",
            label: "Golden morning",
            detail: "First light, warm skin, soft florals, and quiet promise.",
            weights: { aureya: 3, zephyr: 0, maris: 1 },
          },
          {
            value: "city-dawn",
            label: "City dawn",
            detail: "Fresh light, clean lines, and a composed stride.",
            weights: { aureya: 0, zephyr: 3, maris: 1 },
          },
          {
            value: "after-rain",
            label: "After rain",
            detail:
              "Wet stone, warm skin, blue air, and a narrow beam of light.",
            weights: { aureya: 1, zephyr: 1, maris: 3 },
          },
        ],
      },
      {
        id: "wardrobe",
        prompt: "Which silhouette feels closest to your body language?",
        options: [
          {
            value: "silk",
            label: "Silk at first light",
            detail: "Fluid, luminous, and quietly self-possessed.",
            weights: { aureya: 3, zephyr: 0, maris: 1 },
          },
          {
            value: "tailoring",
            label: "Glass-tower tailoring",
            detail:
              "Structured, modern, and bright with controlled confidence.",
            weights: { aureya: 0, zephyr: 3, maris: 1 },
          },
          {
            value: "linen",
            label: "White linen after dark",
            detail: "Clean, sensual, and composed after the weather changes.",
            weights: { aureya: 1, zephyr: 1, maris: 3 },
          },
        ],
      },
      {
        id: "weather",
        prompt: "Which weather would you bottle?",
        options: [
          {
            value: "sun-through-curtains",
            label: "Sun through curtains",
            detail:
              "Pear brightness, white petals, and golden warmth waking up.",
            weights: { aureya: 3, zephyr: 1, maris: 0 },
          },
          {
            value: "dry-urban-air",
            label: "Dry urban air",
            detail:
              "Citrus lift, clean metal, and bright space above the city.",
            weights: { aureya: 0, zephyr: 3, maris: 1 },
          },
          {
            value: "storm-clearing",
            label: "Storm clearing",
            detail: "Salt, sage, mineral air, and the hush after rain.",
            weights: { aureya: 0, zephyr: 1, maris: 3 },
          },
        ],
      },
      {
        id: "closeness",
        prompt: "What should someone feel when they get closer?",
        options: [
          {
            value: "safe-glow",
            label: "A familiar glow",
            detail: "Warmth, grace, and quiet power that stays in memory.",
            weights: { aureya: 3, zephyr: 0, maris: 1 },
          },
          {
            value: "clean-magnetism",
            label: "Clean magnetism",
            detail:
              "Polish, clean distance, and warmth that draws people closer.",
            weights: { aureya: 0, zephyr: 3, maris: 1 },
          },
          {
            value: "skin-like-calm",
            label: "Skin-like calm",
            detail: "Clean skin, salt air, calm signal, and sensual restraint.",
            weights: { aureya: 1, zephyr: 1, maris: 3 },
          },
        ],
      },
      {
        id: "memory",
        prompt: "What kind of memory should the scent leave?",
        options: [
          {
            value: "golden-afterimage",
            label: "A golden afterimage",
            detail:
              "Someone remembers your softness before they remember your words.",
            weights: { aureya: 3, zephyr: 0, maris: 1 },
          },
          {
            value: "compliment-trail",
            label: "A compliment trail",
            detail:
              "Someone asks what you are wearing after you have already moved past.",
            weights: { aureya: 0, zephyr: 3, maris: 1 },
          },
          {
            value: "private-signal",
            label: "A private signal",
            detail:
              "Someone cannot explain it, only that they wanted to come closer.",
            weights: { aureya: 1, zephyr: 0, maris: 3 },
          },
        ],
      },
      {
        id: "ritual",
        prompt: "Where would you spray it first?",
        options: [
          {
            value: "collarbone",
            label: "Collarbone",
            detail: "Close to warmth, jewelry, silk, and the morning pulse.",
            weights: { aureya: 3, zephyr: 0, maris: 1 },
          },
          {
            value: "shirt-cuff",
            label: "Shirt cuff",
            detail:
              "Clean fabric, hand movement, and a quiet flash of control.",
            weights: { aureya: 0, zephyr: 3, maris: 1 },
          },
          {
            value: "nape",
            label: "Nape of the neck",
            detail: "Skin, air, proximity, and the place memory hides.",
            weights: { aureya: 1, zephyr: 1, maris: 3 },
          },
        ],
      },
      {
        id: "final-instinct",
        prompt: "Final instinct: what are you really choosing?",
        options: [
          {
            value: "radiance",
            label: "Radiance",
            detail: "To feel softer, warmer, and more impossible to forget.",
            weights: { aureya: 4, zephyr: 0, maris: 1 },
          },
          {
            value: "control",
            label: "Control",
            detail: "To feel clearer, sharper, and quietly untouchable.",
            weights: { aureya: 0, zephyr: 4, maris: 1 },
          },
          {
            value: "intimacy",
            label: "Intimacy",
            detail: "To feel close, calm, mineral, and privately magnetic.",
            weights: { aureya: 1, zephyr: 0, maris: 4 },
          },
        ],
      },
    ],
  },
  preorderPage: {
    eyebrow: "Order TARA",
    title: "Choose your scent. Cart first, ToyyibPay next.",
    body: "For normal purchases, select a 50mL bottle or the 3 x 8mL RM99 discovery set, add it to cart, review your total, then continue to checkout for delivery details and secure ToyyibPay payment.",
    note: "Need gifting, bridal, event, wholesale, pickup, or scent-matching help? Use the concierge form below instead.",
    perks: [
      "50mL full bottles are RM169 during launch allocation before RM239 regular pricing returns.",
      "The RM99 discovery set lets you choose any three 8mL Eau de Parfum scents before committing to 50mL.",
      "Cart-first checkout keeps normal purchases separate from concierge-only requests.",
    ],
    steps: [
      "Select your full bottle or RM99 discovery set.",
      "Add product and quantity to cart.",
      "Review cart subtotal, delivery handling, and policies.",
      "Enter delivery details at checkout, then continue to ToyyibPay.",
    ],
    contactOptions: [
      {
        label: "WhatsApp Concierge",
        value: "Fastest for preorder guidance and quick scent questions.",
        href: whatsappUrl,
        icon: "whatsapp",
      },
      {
        label: "Instagram",
        value: instagramHandle,
        href: instagramUrl,
        icon: "instagram",
      },
      {
        label: "Email Concierge",
        value: contactEmail,
        href: `mailto:${contactEmail}`,
        icon: "mail",
      },
      {
        label: "Touch 'n Go eWallet",
        value: "Shared once the house confirms your order.",
        icon: "wallet",
      },
      {
        label: "Order Assurance",
        value:
          "Every concierge request is confirmed personally before fulfillment.",
        icon: "shield",
      },
    ],
    paymentLine:
      "For normal checkout, payment is captured on ToyyibPay after you submit delivery details. Concierge requests are not charged until TARA confirms the order path personally.",
    confirmation: {
      eyebrow: "Request Received",
      title: "Your concierge request is with the house.",
      body: "TARA will review your scent choice, quantity, and support needs before confirming delivery and payment next steps personally.",
      note: "For urgent orders, send the WhatsApp follow-up so the concierge can prioritize your request.",
      steps: [
        "Check your inbox or WhatsApp for TARA's reply.",
        "Confirm scent, quantity, delivery needs, and payment path.",
        "Complete payment only after the order details are confirmed.",
      ],
    },
  },
  contactPage: {
    eyebrow: "Contact",
    title: "Speak directly with the house.",
    body: "For private orders, launch collaborations, press requests, content creation, or retail conversations, reach out and TARA will respond with a personal reply.",
    note: "Concierge replies are handled within two working days.",
    details: [
      {
        label: "Concierge Email",
        value: contactEmail,
        href: `mailto:${contactEmail}`,
        icon: "mail",
      },
      {
        label: "WhatsApp",
        value: whatsappNumber,
        href: whatsappUrl,
        icon: "whatsapp",
      },
      {
        label: "Instagram",
        value: instagramHandle,
        href: instagramUrl,
        icon: "instagram",
      },
      {
        label: "Response Window",
        value: "Within two working days",
        icon: "shield",
      },
    ],
  },
};
