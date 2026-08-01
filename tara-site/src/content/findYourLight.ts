export type FindYourLightScent =
  | "zephyr"
  | "aureya"
  | "eliora"
  | "maris"
  | "ashoka"
  | "ardor";

export type FindYourLightOption = {
  letter: string;
  text: string;
  scent: FindYourLightScent;
};

export type FindYourLightQuestion = {
  id: number;
  text: string;
  options: FindYourLightOption[];
};

export type FindYourLightProfile = {
  name: string;
  slug?: string;
  tagline: string;
  description: string;
  notes: string[];
  image: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
};

export const findYourLightQuestions: FindYourLightQuestion[] = [
  {
    id: 1,
    text: "When the world quiets down, where does your mind drift?",
    options: [
      {
        letter: "A",
        text: "To the next horizon - I am always building, always becoming.",
        scent: "zephyr",
      },
      {
        letter: "B",
        text: "To golden memories - moments that felt like light.",
        scent: "aureya",
      },
      {
        letter: "C",
        text: "To the edge of mystery - what lies just beyond perception.",
        scent: "eliora",
      },
      {
        letter: "D",
        text: "To the rhythm of tides - the pull of something ancient and vast.",
        scent: "maris",
      },
      {
        letter: "E",
        text: "To a quiet tenderness - softness that keeps returning.",
        scent: "ashoka",
      },
      {
        letter: "F",
        text: "To the heat of the room - focus, spice, and charged presence.",
        scent: "ardor",
      },
    ],
  },
  {
    id: 2,
    text: "Choose the hour that feels most like you.",
    options: [
      {
        letter: "A",
        text: "Dawn - the first clean breath before the city stirs.",
        scent: "zephyr",
      },
      {
        letter: "B",
        text: "Golden afternoon - warmth pooling through half-closed curtains.",
        scent: "aureya",
      },
      {
        letter: "C",
        text: "Twilight - when day surrenders to secret possibility.",
        scent: "eliora",
      },
      {
        letter: "D",
        text: "Midnight - the hour of salt air and quiet signals.",
        scent: "maris",
      },
      {
        letter: "E",
        text: "Late afternoon - soft florals warming against skin.",
        scent: "ashoka",
      },
      {
        letter: "F",
        text: "After dark - amber light, black tea, and a tailored entrance.",
        scent: "ardor",
      },
    ],
  },
  {
    id: 3,
    text: "If your presence left a trace in a room, what would remain?",
    options: [
      {
        letter: "A",
        text: "A sharp, bright clarity - the feeling that something just began.",
        scent: "zephyr",
      },
      {
        letter: "B",
        text: "A warm, lingering softness - like silk still holding body heat.",
        scent: "aureya",
      },
      {
        letter: "C",
        text: "A charged silence - the electricity of something unsaid.",
        scent: "eliora",
      },
      {
        letter: "D",
        text: "A mineral coolness - the memory of weather on bare skin.",
        scent: "maris",
      },
      {
        letter: "E",
        text: "A tender softness - almond warmth and a bloom that stays close.",
        scent: "ashoka",
      },
      {
        letter: "F",
        text: "A warm charge - spice, tea, and attention under control.",
        scent: "ardor",
      },
    ],
  },
  {
    id: 4,
    text: "Which landscape mirrors your inner terrain?",
    options: [
      {
        letter: "A",
        text: "A glass tower at sunrise - structure kissed by light.",
        scent: "zephyr",
      },
      {
        letter: "B",
        text: "A sun-drenched garden in full bloom - life unfurling without rush.",
        scent: "aureya",
      },
      {
        letter: "C",
        text: "A candlelit corridor in an old villa - shadows holding their breath.",
        scent: "eliora",
      },
      {
        letter: "D",
        text: "A shoreline after dark - where the sea meets the sky in silence.",
        scent: "maris",
      },
      {
        letter: "E",
        text: "A quiet dressing room - silk, almond, pale flowers, and warm light.",
        scent: "ashoka",
      },
      {
        letter: "F",
        text: "A low-lit lounge - black tea, spice, dark tailoring, and amber.",
        scent: "ardor",
      },
    ],
  },
  {
    id: 5,
    text: "In a single word, how do you want to be remembered?",
    options: [
      { letter: "A", text: "Magnetic", scent: "zephyr" },
      { letter: "B", text: "Luminous", scent: "aureya" },
      { letter: "C", text: "Mysterious", scent: "eliora" },
      { letter: "D", text: "Composed", scent: "maris" },
      { letter: "E", text: "Tender", scent: "ashoka" },
      { letter: "F", text: "Commanding", scent: "ardor" },
    ],
  },
  {
    id: 6,
    text: "What draws people toward you without them knowing why?",
    options: [
      {
        letter: "A",
        text: "The sense that I carry forward momentum - I make things happen.",
        scent: "zephyr",
      },
      {
        letter: "B",
        text: "The warmth I radiate - they feel seen in my presence.",
        scent: "aureya",
      },
      {
        letter: "C",
        text: "The intrigue of depth - they sense layers they have not reached.",
        scent: "eliora",
      },
      {
        letter: "D",
        text: "The calm I hold - like shelter from their own noise.",
        scent: "maris",
      },
      {
        letter: "E",
        text: "The softness I carry - they feel safe enough to move closer.",
        scent: "ashoka",
      },
      {
        letter: "F",
        text: "The heat I contain - they sense confidence before I speak.",
        scent: "ardor",
      },
    ],
  },
  {
    id: 7,
    text: "Choose the texture that feels like home to your senses.",
    options: [
      {
        letter: "A",
        text: "Polished cedar - smooth, architectural, intentional.",
        scent: "zephyr",
      },
      {
        letter: "B",
        text: "Warmed linen - soft, golden, lived-in.",
        scent: "aureya",
      },
      {
        letter: "C",
        text: "Velvet shadow - rich, embracing, full of secrets.",
        scent: "eliora",
      },
      {
        letter: "D",
        text: "Weathered driftwood - salt-worn, timeless, bearing the sea's memory.",
        scent: "maris",
      },
      {
        letter: "E",
        text: "Cashmere petals - creamy, tender, and warm against skin.",
        scent: "ashoka",
      },
      {
        letter: "F",
        text: "Polished spice - dry, warm, textured, and quietly addictive.",
        scent: "ardor",
      },
    ],
  },
  {
    id: 8,
    text: "If scent is memory made physical, which memory defines you?",
    options: [
      {
        letter: "A",
        text: "The first light of a morning that changed everything.",
        scent: "zephyr",
      },
      {
        letter: "B",
        text: "A moment of grace - where time softened and you felt truly yourself.",
        scent: "aureya",
      },
      {
        letter: "C",
        text: "A night you cannot fully explain - only feel, still, in your bones.",
        scent: "eliora",
      },
      {
        letter: "D",
        text: "The still point of a storm - when the world held its breath.",
        scent: "maris",
      },
      {
        letter: "E",
        text: "A gentle goodbye that stayed longer than expected.",
        scent: "ashoka",
      },
      {
        letter: "F",
        text: "A charged night where every glance felt intentional.",
        scent: "ardor",
      },
    ],
  },
];

export const findYourLightProfiles: Record<FindYourLightScent, FindYourLightProfile> = {
  zephyr: {
    name: "ZEPHYR",
    slug: "zephyr",
    tagline: "Bright air. Tailored warmth.",
    description:
      "You carry the clarity of dawn and the confidence of a tailored stride. ZEPHYR opens with sparkling citrus and aldehydic lift, moves through radiant cedarwood air, then settles into clean musks and ambroxan warmth. Polished, magnetic, built to be noticed without trying.",
    notes: ["Sparkling Citrus", "Cedarwood Aura", "Ambroxan Warmth", "Clean Musk"],
    image: "/quiz-assets/bottle-zephyr.png",
    primaryCta: {
      label: "Explore Zephyr",
      href: "/scents/zephyr",
    },
    secondaryCta: {
      label: "Preorder Zephyr",
      href: "/preorder?checkout=zephyr#secure-checkout",
    },
  },
  aureya: {
    name: "AUREYA",
    slug: "aureya",
    tagline: "Soft power. Golden memory.",
    description:
      "You are the glow of remembered light - soft confidence that radiates without demand. AUREYA opens with pear brightness and neroli light, blooms into jasmine and white petals, then settles into white musk, golden amber, and tonka warmth.",
    notes: ["Pear Brightness", "Jasmine Bloom", "Golden Amber", "Tonka Warmth"],
    image: "/quiz-assets/bottle-aureya.png",
    primaryCta: {
      label: "Explore Aureya",
      href: "/scents/aureya",
    },
    secondaryCta: {
      label: "Preorder Aureya",
      href: "/preorder?checkout=aureya#secure-checkout",
    },
  },
  eliora: {
    name: "ELIORA",
    slug: "eliora",
    tagline: "Hidden radiance. Velvet shadow.",
    description:
      "You move in the hour when daylight becomes secretive - warm, radiant, and quietly magnetic. ELIORA unfolds from sparkling golden lift into creamy white florals and soft spice, settling into clean musk, amber skin, and sheer woody warmth.",
    notes: ["Golden Floral", "Soft Spice", "Amber Skin", "Velvet Shadow"],
    image: "/quiz-assets/bottle-eliora.png",
    primaryCta: {
      label: "Explore Eliora",
      href: "/scents/eliora",
    },
    secondaryCta: {
      label: "Preorder Eliora",
      href: "/preorder?checkout=eliora#secure-checkout",
    },
  },
  maris: {
    name: "MARIS",
    slug: "maris",
    tagline: "Salt. Signal. Silence.",
    description:
      "You are the quiet signal that remains when the horizon disappears - composed, mineral, emotionally precise. MARIS opens with salt air and green sage, becomes a quiet amber signal through transparent woods, then settles into sandalwood, driftwood, and skin musk.",
    notes: ["Salt Air", "Mineral Amber", "Sandalwood", "Skin Musk"],
    image: "/quiz-assets/bottle-maris.png",
    primaryCta: {
      label: "Explore Maris",
      href: "/scents/maris",
    },
    secondaryCta: {
      label: "Preorder Maris",
      href: "/preorder?checkout=maris#secure-checkout",
    },
  },
  ashoka: {
    name: "ASHOKA",
    slug: "ashoka",
    tagline: "Softness with a spine.",
    description:
      "You carry tenderness without losing presence. ASHOKA opens with creamy almond, soft bergamot, and powdered petals before vanilla orchid, cherry blossom, and cashmere florals settle into tonka warmth, skin musk, and soft amber. Feminine, close, and quietly impossible to forget.",
    notes: ["Creamy Almond", "Vanilla Orchid", "Skin Musk", "Soft Amber"],
    image: "/quiz-assets/bottle-ashoka.webp",
    primaryCta: {
      label: "Explore Ashoka",
      href: "/scents/ashoka",
    },
    secondaryCta: {
      label: "Preorder Ashoka",
      href: "/preorder?checkout=ashoka#secure-checkout",
    },
  },
  ardor: {
    name: "ARDOR",
    slug: "ardor",
    tagline: "Heat under control.",
    description:
      "You move with warmth, focus, and charged restraint. ARDOR opens with black tea, cardamom, and cracked pepper, heats through cinnamon bark, lavender smoke, and amber resin, then settles into tonka bean, sandalwood, and dark musk. Masculine, magnetic, and made for after-dark confidence.",
    notes: ["Black Tea", "Cardamom", "Amber Resin", "Dark Musk"],
    image: "/quiz-assets/bottle-ardor.webp",
    primaryCta: {
      label: "Explore Ardor",
      href: "/scents/ardor",
    },
    secondaryCta: {
      label: "Preorder Ardor",
      href: "/preorder?checkout=ardor#secure-checkout",
    },
  },
};

export function calculateFindYourLightResult(
  scores: Record<FindYourLightScent, number>,
): FindYourLightScent {
  const ordered = Object.entries(scores) as [FindYourLightScent, number][];
  ordered.sort((a, b) => b[1] - a[1]);

  const highestScore = ordered[0]?.[1] ?? 0;
  const tiedScents = ordered
    .filter(([, score]) => score === highestScore)
    .map(([scent]) => scent);

  if (tiedScents.length === 1) {
    return tiedScents[0];
  }

  const priority: FindYourLightScent[] = [
    "ardor",
    "ashoka",
    "eliora",
    "maris",
    "aureya",
    "zephyr",
  ];
  return priority.find((scent) => tiedScents.includes(scent)) ?? "zephyr";
}
