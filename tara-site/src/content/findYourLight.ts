export type FindYourLightScent =
  | "zephyr"
  | "aureya"
  | "eliora"
  | "maris"
  | "ashoka"
  | "ardor"
  | "theon"
  | "kameira";

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
  number?: string;
  slug: FindYourLightScent;
  family: string;
  tagline: string;
  description: string;
  keyNotes: [string, string, string];
  mood: string;
  occasion: string;
  reason: string;
  image: string;
  productHref: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
};

const discoverySetHref = "/preorder?checkout=three-8ml-promo#secure-checkout";

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
      {
        letter: "G",
        text: "To a warm ritual - tea, cream, and the calm I return to.",
        scent: "theon",
      },
      {
        letter: "H",
        text: "To an intimate evening - wine, roses, and amber warmth shared close.",
        scent: "kameira",
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
      {
        letter: "G",
        text: "A slow morning - oolong steam, soft vanilla, and stillness.",
        scent: "theon",
      },
      {
        letter: "H",
        text: "Evening - a quiet room, soft light, and nowhere else to be.",
        scent: "kameira",
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
      {
        letter: "G",
        text: "A golden calm - creamy tea and skin-warm quiet.",
        scent: "theon",
      },
      {
        letter: "H",
        text: "A skin-close warmth - velvet rose and the glow of burnished amber.",
        scent: "kameira",
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
      {
        letter: "G",
        text: "A sunlit tea room - porcelain, oolong, and soft cream.",
        scent: "theon",
      },
      {
        letter: "H",
        text: "An intimate room - cool air, blackcurrant wine, and roses in low light.",
        scent: "kameira",
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
      { letter: "G", text: "Serene", scent: "theon" },
      {
        letter: "H",
        text: "Intimate",
        scent: "kameira",
      },
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
      {
        letter: "G",
        text: "The ease I bring - steady, warm, and quietly grounding.",
        scent: "theon",
      },
      {
        letter: "H",
        text: "The warmth shared up close - softly sweet, with nothing to prove.",
        scent: "kameira",
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
      {
        letter: "G",
        text: "Warm porcelain - smooth tea, cream, and soft skin.",
        scent: "theon",
      },
      {
        letter: "H",
        text: "Rose velvet - soft to the touch, warmed by amber.",
        scent: "kameira",
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
      {
        letter: "G",
        text: "A quiet cup held with both hands before the day begins.",
        scent: "theon",
      },
      {
        letter: "H",
        text: "An evening shared close - blackcurrant wine, roses, and lingering warmth.",
        scent: "kameira",
      },
    ],
  },
];

export const findYourLightProfiles: Record<
  FindYourLightScent,
  FindYourLightProfile
> = {
  zephyr: {
    name: "ZEPHYR",
    slug: "zephyr",
    family: "Fresh woody citrus",
    tagline: "Bright air. Tailored warmth.",
    description:
      "ZEPHYR opens with sparkling citrus and aldehydic lift, moves through radiant cedarwood air, then settles into clean musks and ambroxan warmth. Polished, magnetic, and built to be noticed without trying.",
    keyNotes: ["Sparkling citrus", "Cedarwood aura", "Ambroxan warmth"],
    mood: "Clean, magnetic, forward-moving",
    occasion: "City mornings, tailored workdays, twilight close range",
    reason:
      "Your answers leaned toward clarity, momentum, and polished presence - the exact space where ZEPHYR feels most natural.",
    image: "/scents/zephyr/zephyr-50ml-hero.webp",
    productHref: "/scents/zephyr",
    primaryCta: {
      label: "Try it in the RM99 discovery set",
      href: discoverySetHref,
    },
    secondaryCta: {
      label: "Shop the 50mL bottle",
      href: "/preorder?checkout=zephyr#secure-checkout",
    },
  },
  aureya: {
    name: "AUREYA",
    slug: "aureya",
    family: "Soft floral amber",
    tagline: "Soft power. Golden memory.",
    description:
      "AUREYA opens with pear brightness and neroli light, blooms into jasmine and white petals, then settles into white musk, golden amber, and tonka warmth. It is luminous softness with quiet confidence underneath.",
    keyNotes: ["Pear brightness", "Jasmine bloom", "Golden amber"],
    mood: "Radiant, graceful, assured",
    occasion: "Morning rituals, silk evenings, soft entrances",
    reason:
      "Your answers chose warmth, grace, and golden memory - signs that AUREYA's luminous floral amber will feel like home on skin.",
    image: "/scents/aureya/aureya-50ml-hero.webp",
    productHref: "/scents/aureya",
    primaryCta: {
      label: "Try it in the RM99 discovery set",
      href: discoverySetHref,
    },
    secondaryCta: {
      label: "Shop the 50mL bottle",
      href: "/preorder?checkout=aureya#secure-checkout",
    },
  },
  eliora: {
    name: "ELIORA",
    slug: "eliora",
    family: "Golden floral musk",
    tagline: "Hidden radiance. Velvet shadow.",
    description:
      "ELIORA unfolds from sparkling golden lift into creamy white florals and soft spice, settling into clean musk, amber skin, and sheer woody warmth. Warm, feminine, and quietly mysterious.",
    keyNotes: ["Golden floral", "Soft spice", "Amber skin"],
    mood: "Mysterious, radiant, intimate",
    occasion: "Golden hour, evening rituals, after-dark closeness",
    reason:
      "Your answers pointed to intrigue, twilight, and hidden warmth - the emotional signature behind ELIORA's golden floral musk.",
    image: "/scents/eliora/eliora-50ml-hero.webp",
    productHref: "/scents/eliora",
    primaryCta: {
      label: "Try it in the RM99 discovery set",
      href: discoverySetHref,
    },
    secondaryCta: {
      label: "Shop the 50mL bottle",
      href: "/preorder?checkout=eliora#secure-checkout",
    },
  },
  maris: {
    name: "MARIS",
    slug: "maris",
    family: "Mineral woods",
    tagline: "Salt. Signal. Silence.",
    description:
      "MARIS opens with salt air and green sage, becomes a quiet amber signal through transparent woods, then settles into sandalwood, driftwood, and skin musk. Freshness with poise, not noise.",
    keyNotes: ["Salt air", "Mineral amber", "Sandalwood"],
    mood: "Composed, nocturnal, quietly magnetic",
    occasion: "After rain, late drives, white linen at night",
    reason:
      "Your answers favored calm, horizon, and emotional precision - a natural match for MARIS and its mineral-wood stillness.",
    image: "/scents/maris/maris-50ml-hero.webp",
    productHref: "/scents/maris",
    primaryCta: {
      label: "Try it in the RM99 discovery set",
      href: discoverySetHref,
    },
    secondaryCta: {
      label: "Shop the 50mL bottle",
      href: "/preorder?checkout=maris#secure-checkout",
    },
  },
  ashoka: {
    name: "ASHOKA",
    slug: "ashoka",
    family: "Almond floral amber",
    tagline: "Softness with a spine.",
    description:
      "ASHOKA opens with creamy almond, soft bergamot, and powdered petals before vanilla orchid and cashmere florals settle into tonka warmth, skin musk, and soft amber. Tender, close, and quietly impossible to forget.",
    keyNotes: ["Creamy almond", "Vanilla orchid", "Skin musk"],
    mood: "Soft, tender, memorable",
    occasion: "Quiet dates, soft daily rituals, close evenings",
    reason:
      "Your answers returned to tenderness, softness, and memory - the intimate emotional world ASHOKA was built for.",
    image: "/scents/ashoka/ashoka-50ml-hero.webp",
    productHref: "/scents/ashoka",
    primaryCta: {
      label: "Try it in the RM99 discovery set",
      href: discoverySetHref,
    },
    secondaryCta: {
      label: "Shop the 50mL bottle",
      href: "/preorder?checkout=ashoka#secure-checkout",
    },
  },
  ardor: {
    name: "ARDOR",
    slug: "ardor",
    family: "Spiced woody amber",
    tagline: "Heat under control.",
    description:
      "ARDOR opens with black tea, cardamom, and cracked pepper, heats through cinnamon bark and amber resin, then settles into tonka bean, sandalwood, and dark musk. Masculine, magnetic, and made for after-dark confidence.",
    keyNotes: ["Black tea", "Cardamom", "Dark musk"],
    mood: "Magnetic, heated, commanding",
    occasion: "Night plans, sharp entrances, after-dark confidence",
    reason:
      "Your answers chose heat, control, and charged presence - exactly the tension ARDOR turns into scent.",
    image: "/scents/ardor/ardor-50ml-hero.webp",
    productHref: "/scents/ardor",
    primaryCta: {
      label: "Try it in the RM99 discovery set",
      href: discoverySetHref,
    },
    secondaryCta: {
      label: "Shop the 50mL bottle",
      href: "/preorder?checkout=ardor#secure-checkout",
    },
  },
  theon: {
    name: "THEON",
    slug: "theon",
    family: "Warm tea gourmand",
    tagline: "Steeped in divine calm.",
    description:
      "THEON is golden oolong and osmanthus steeped in coconut cream, soft vanilla, sandalwood, and skin-close musk. Calm, creamy, luminous, and intimate without becoming overly sweet.",
    keyNotes: ["Golden oolong", "Coconut cream", "Soft vanilla"],
    mood: "Calm, luminous, skin-close",
    occasion: "Morning rituals, quiet evenings, close daily wear",
    reason:
      "Your answers pointed toward ritual, warmth, and steady calm - the soft tea-gourmand world where THEON feels complete.",
    image: "/scents/theon/theon-50ml-hero.webp",
    productHref: "/scents/theon",
    primaryCta: {
      label: "Try it in the RM99 discovery set",
      href: discoverySetHref,
    },
    secondaryCta: {
      label: "Shop the 50mL bottle",
      href: "/preorder?checkout=theon#secure-checkout",
    },
  },
  kameira: {
    name: "KAMEIRA",
    number: "08",
    slug: "kameira",
    family: "Warm gourmand",
    tagline: "Desire, distilled.",
    description:
      "Blackcurrant wine unfolds into velvet rose, closing on burnished amber. Warm, softly sweet, and skin-close, KAMEIRA is made for evenings shared at close range in air-conditioned rooms. 50mL RM169; individual 8mL RM45; available in the RM99 three-scent discovery set.",
    keyNotes: ["Blackcurrant wine", "Velvet rose", "Burnished amber"],
    mood: "Warm, soft, skin-close",
    occasion: "Evenings, close-range, air-conditioned rooms",
    reason:
      "Your answers leaned toward intimate evenings, soft sweetness, and warmth shared close - the warm gourmand world of KAMEIRA.",
    image: "/scents/kameira/kameira-50ml-hero.webp",
    productHref: "/scents/kameira",
    primaryCta: {
      label: "Reserve 50mL Bottle",
      href: "/preorder?checkout=kameira#secure-checkout",
    },
    secondaryCta: {
      label: "Try In RM99 Set",
      href: discoverySetHref,
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

  // Preserve every existing tie winner; KAMEIRA wins on a strictly higher vote count.
  const priority: FindYourLightScent[] = [
    "theon",
    "ardor",
    "ashoka",
    "eliora",
    "maris",
    "zephyr",
    "aureya",
    "kameira",
  ];

  return priority.find((scent) => tiedScents.includes(scent)) ?? "theon";
}
