import type { BrandContent } from "@/types/content";

const whatsappNumber = "+01143042883";
const whatsappUrl =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ??
  "https://wa.me/601143042883?text=Hi%20TARA%2C%20I%27d%20love%20help%20with%20a%20fragrance%20order.";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@tarascents.com";
const instagramHandle = "@tara_scents.my";
const instagramUrl =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/tara_scents.my";

export const brand: BrandContent = {
  name: "TARA",
  tagline: "Illuminate the unseen",
  description:
    "TARA is a luxury fragrance house shaped by sensual restraint, editorial visuals, and seven high-end scents: Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, and THEON.",
  contactEmail,
  navigation: [
    { label: "Home", href: "/" },
    { label: "Scent Trail", href: "/popup" },
    { label: "About", href: "/about" },
    { label: "Journal", href: "/journal" },
    { label: "Scents", href: "/scents" },
    { label: "Preorder", href: "/preorder" },
    { label: "Contact", href: "/contact" },
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
      eyebrow: "Seven Scents, One House",
      title: "Fragrance that stays after you leave.",
      body:
        "TARA is a Malaysian fragrance house built on sensual restraint: seven edited scents, Aureya through THEON, each composed to feel close before it feels loud.",
      note: "New this season: THEON, a warm tea gourmand. Try any three 8mL scents for RM99, or reserve a 50mL bottle while RM169 launch pricing is active.",
      ctas: [
        {
          label: "Shop The Collection",
          href: "/scents",
          variant: "primary",
        },
        {
          label: "Take The Scent Quiz",
          href: "/quiz",
          variant: "secondary",
        },
      ],
      metrics: [
        {
          label: "Scent Family",
          value: "7",
          description: "Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, and THEON.",
          badges: ["New: THEON"],
        },
        {
          label: "Full Bottle",
          value: "RM169",
          description: "First 100 bottles before RM239 regular pricing returns.",
          badges: ["FPX", "DuitNow", "Card"],
        },
        {
          label: "Discovery Set",
          value: "RM99",
          description: "Any three 8mL scents before you commit to 50mL.",
          badges: ["FPX", "DuitNow", "Card"],
        },
      ],
      visual: {
        src: "/editorial/tara-theon-launch-hero.png",
        alt: "THEON Eau de Parfum bottle in warm golden light with ivory drapery.",
        priority: true,
      },
    },
    story: {
      title: "Fragrance written like a private confession.",
      lead:
        "TARA was built for women and men who do not need noise to feel magnetic. The house moves through black glass, warm skin, polished tailoring, and the lingering emotion a scent leaves behind.",
      paragraphs: [
        "The first chapter now opens into seven scents. Aureya turns golden softness into quiet confidence. Zephyr turns clean masculine air into magnetic radiance. Maris introduces mineral freshness for skin, linen, and late light. Eliora brings golden floral warmth after dark. Ashoka adds tender almond-orchid softness. Ardor brings black tea, spice, and controlled heat. THEON steepens the house with warm oolong calm.",
        "Every formula is composed to feel close before it feels loud. You notice the texture first, then the temperature, then the memory it leaves on fabric and skin.",
      ],
      quote: "The point is not to fill the room. The point is to stay with someone after you leave it.",
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
      body:
        "Every order moves through encrypted checkout, personal confirmation, and direct house support from first inquiry to final delivery.",
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
      body:
        "Build a 3 x 8mL TARA discovery set for RM99 and move between radiance, control, mineral skin, golden warmth, soft almond florals, heated spice, and warm tea calm before committing to a full bottle.",
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
      title: "Reserve yours.",
      body:
        "Preorder Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, or THEON at RM169 while the first 100 bottles last, or start with the 3 x 8mL RM99 promo set.",
      primary: { label: "Preorder Now", href: "/preorder", variant: "primary" },
      secondary: { label: "Message the House", href: whatsappUrl, variant: "secondary" },
      note: "Full bottles are RM239 regular after launch allocation.",
    },
  },
  quizPage: {
    eyebrow: "Fragrance Quiz",
    title: "Find your scent identity in eight questions.",
    body:
      "Move through instinctive choices. TARA will read the pattern and match you to one of the current olfactive profiles.",
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
            detail: "Pear light, jasmine silk, amber, and skin musk that glow close.",
            weights: { aureya: 3, zephyr: 0, maris: 1 },
          },
          {
            value: "tailored",
            label: "Urban radiance",
            detail: "Sparkling citrus, brisk air, polished woods, and warm musk.",
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
            detail: "Low-lit, close, and magnetic without asking for attention.",
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
            detail: "Wet stone, warm skin, blue air, and a narrow beam of light.",
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
            detail: "Structured, modern, and bright with controlled confidence.",
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
            detail: "Pear brightness, white petals, and golden warmth waking up.",
            weights: { aureya: 3, zephyr: 1, maris: 0 },
          },
          {
            value: "dry-urban-air",
            label: "Dry urban air",
            detail: "Citrus lift, clean metal, and bright space above the city.",
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
            detail: "Polish, clean distance, and warmth that draws people closer.",
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
            detail: "Someone remembers your softness before they remember your words.",
            weights: { aureya: 3, zephyr: 0, maris: 1 },
          },
          {
            value: "compliment-trail",
            label: "A compliment trail",
            detail: "Someone asks what you are wearing after you have already moved past.",
            weights: { aureya: 0, zephyr: 3, maris: 1 },
          },
          {
            value: "private-signal",
            label: "A private signal",
            detail: "Someone cannot explain it, only that they wanted to come closer.",
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
            detail: "Clean fabric, hand movement, and a quiet flash of control.",
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
    eyebrow: "Preorder",
    title: "Reserve your scent before the first 100 bottles are gone.",
    body:
      "Use secure checkout, the form below, or direct WhatsApp to order Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, THEON, or the 3 x 8mL RM99 promo set.",
    note: "Full bottles are RM239 regular. First 100 bottles launch at RM169.",
    perks: [
      "First 100 full bottles at RM169 before RM239 regular pricing.",
      "Seven clear full-bottle choices: Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, and THEON.",
      "3 x any 8mL Eau de Parfum for RM99 while promo allocation lasts.",
    ],
    steps: [
      "Select your full bottle or 3 x 8mL promo set.",
      "Pay securely, fill the form, or WhatsApp the house.",
      "We confirm your order, payment, and delivery details personally.",
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
        value: "Every preorder is confirmed personally before fulfillment.",
        icon: "shield",
      },
    ],
    paymentLine:
      "Secure checkout supports FPX, credit cards, and DuitNow QR when enabled. Concierge confirmation can still be arranged manually by the house.",
    confirmation: {
      eyebrow: "Request Received",
      title: "Your preorder request is with the house.",
      body:
        "TARA will review your choice, allocation, and preferred contact method before confirming payment and delivery details personally.",
      note: "For urgent orders, send the WhatsApp follow-up so the concierge can prioritize your request.",
      steps: [
        "Check your inbox or WhatsApp for TARA's confirmation.",
        "Confirm scent, quantity, payment method, and delivery details.",
        "Receive your launch allocation once payment is finalized.",
      ],
    },
  },
  contactPage: {
    eyebrow: "Contact",
    title: "Speak directly with the house.",
    body:
      "For private orders, launch collaborations, press requests, content creation, or retail conversations, reach out and TARA will respond with a personal reply.",
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
