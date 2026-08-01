import type { Scent } from "@/types/content";

const coreBottlePrice = {
  price: "RM169 launch / RM239 regular",
  regularPrice: "RM239",
  launchPrice: "RM169",
  priceInSen: 16900,
};

export const scents: Scent[] = [
  {
    slug: "aureya",
    name: "Aureya",
    audience: "For Her",
    status: "available",
    isNew: false,
    tagline: "Radiant Soft Confidence",
    line: "Pear Neroli Jasmine Amber",
    summary:
      "Aureya opens with pear brightness and sheer neroli, like first light through linen curtains. Jasmine and white petals bloom softly before white musk, amber, and tonka wrap the skin in golden warmth.",
    story:
      "Aureya is the quiet ritual of remembering your own light. It does not perform femininity; it lets it rise: soft, assured, luminous, and felt long after you leave.",
    notes: {
      top: ["Pear brightness", "Neroli light", "Soft citrus glow"],
      heart: ["Jasmine bloom", "White petals", "Creamy floral air"],
      base: ["White musk", "Golden amber", "Tonka warmth"],
    },
    mood: ["Radiant", "Graceful", "Assured"],
    wear: ["Morning rituals", "Silk evenings", "Soft entrances"],
    finish:
      "A musky amber veil that stays luminous, feminine, and quietly comforting on skin.",
    character:
      "Soft confidence in fragrance form. Aureya is warmth, grace, and quiet power without sweetness becoming noise.",
    quote: "Where memories wake to light.",
    storyLead:
      "If the opening is dawn, the heart is silk, and the base is the warmth that stays behind.",
    storyMantra: "Soft power. Golden memory.",
    storyArc: [
      {
        label: "Dawn",
        title: "Memory",
        body:
          "Pear brightness, neroli, and soft citrus glow open like a cherished morning returning to the skin.",
      },
      {
        label: "Silk",
        title: "Confidence",
        body:
          "Jasmine and white petals unfold with quiet grace: feminine, polished, and unhurried.",
      },
      {
        label: "Glow",
        title: "Embrace",
        body:
          "White musk, golden amber, and tonka warmth settle close like a silk shawl of reassurance.",
      },
    ],
    size: "50mL Eau de Parfum",
    ...coreBottlePrice,
    launch: "Available Now",
    visual: {
      src: "/scents/aureya/aureya-carousel-01-hero.webp",
      alt: "Aureya perfume bottle on an ivory silk-inspired background.",
    },
    homeVisual: {
      src: "/scents/aureya/aureya-carousel-02-mood.webp",
      alt: "Aureya perfume bottle in warm morning light with soft pear and floral styling.",
    },
    gallery: [
      {
        title: "Hero",
        caption: "Aureya in first light: soft, luminous, and quietly assured.",
        src: "/scents/aureya/aureya-carousel-01-hero.webp",
        alt: "Aureya perfume bottle on an ivory silk-inspired background.",
      },
      {
        title: "Mood",
        caption: "Pear brightness and jasmine silk, warmed by golden amber.",
        src: "/scents/aureya/aureya-carousel-02-mood.webp",
        alt: "Aureya perfume bottle in warm morning light with pear and white floral styling.",
      },
      {
        title: "Texture",
        caption: "White petals and blush perfume detail the scent's soft floral glow.",
        src: "/scents/aureya/aureya-carousel-03-texture.webp",
        alt: "Close-up of white petals beside blush Aureya perfume liquid.",
      },
      {
        title: "Sizes",
        caption: "Choose the 50mL signature bottle or test with the 8mL discovery size.",
        src: "/scents/aureya/aureya-carousel-04-size-comparison.webp",
        alt: "Aureya 50mL perfume bottle beside an 8mL discovery vial.",
      },
      {
        title: "Notes",
        caption: "Pear, neroli, jasmine, white petals, white musk, golden amber, and tonka.",
        src: "/scents/aureya/aureya-carousel-05-notes-pyramid.webp",
        alt: "Aureya notes pyramid showing top, heart, and base notes.",
      },
    ],
  },
  {
    slug: "zephyr",
    name: "Zephyr",
    audience: "For Him",
    status: "available",
    isNew: false,
    tagline: "Urban Radiance",
    line: "Citrus Aldehyde Woody Musk",
    summary:
      "Zephyr opens with sparkling citrus and aldehydic lift, like morning light hitting glass towers. Hedione and smooth cedarwood air create a clean, magnetic aura before amber, dry moss, and musks settle into warm skin.",
    story:
      "Zephyr is the first clean breath before the city moves. It carries the clarity of dawn, the confidence of a tailored stride, and the close warmth that makes someone ask what you are wearing.",
    notes: {
      top: ["Sparkling citrus", "Aldehyde lift", "Brisk air"],
      heart: ["Hedione radiance", "Cedarwood aura", "Iso E Super"],
      base: ["Clean musks", "Ambroxan warmth", "Dry moss"],
    },
    mood: ["Radiant", "Confident", "Magnetic"],
    wear: ["City mornings", "Tailored days", "Twilight close range"],
    finish:
      "A warm amber-musk trail with polished woods: clean from a distance, magnetic up close.",
    character:
      "Modern masculine freshness with warmth underneath. Zephyr draws attention without performing for it.",
    quote: "Turns heads without trying.",
    storyLead:
      "If the opening is dawn, the heart is the stride, and the base is the moment someone moves closer.",
    storyMantra: "Bright air. Tailored warmth.",
    storyArc: [
      {
        label: "Dawn",
        title: "Clarity",
        body:
          "Sparkling citrus, aldehydes, and brisk air open like sunlight cutting through a quiet city morning.",
      },
      {
        label: "Stride",
        title: "Confidence",
        body:
          "Hedione and cedarwood radiance create the polished aura: clean, architectural, and effortlessly composed.",
      },
      {
        label: "Close",
        title: "Magnetism",
        body:
          "Ambroxan, dry moss, and clean musks warm into skin, leaving the kind of trail people ask about.",
      },
    ],
    size: "50mL Eau de Parfum",
    ...coreBottlePrice,
    launch: "Available Now",
    visual: {
      src: "/editorial/tara-zephyr-square-optimized.webp",
      alt: "Zephyr perfume bottle with an opaque navy label, citrus notes, woods, and a cool city backdrop.",
    },
    homeVisual: {
      src: "/editorial/tara-zephyr-square-optimized.webp",
      alt: "Zephyr perfume bottle with an opaque navy label, citrus notes, woods, and a cool city backdrop.",
    },
  },
  {
    slug: "maris",
    name: "Maris",
    audience: "For Everyone",
    status: "available",
    isNew: false,
    tagline: "Midnight Lighthouse",
    line: "Salt Sage Mineral Woods",
    summary:
      "Maris opens like salt air at the edge of midnight: cool sage, bergamot, and mineral clarity cutting through dark water. The heart becomes a quiet amber signal before sandalwood, driftwood, and skin musk settle close.",
    story:
      "Maris is not the sea in daylight. It is the hour when the horizon disappears and instinct takes over: cold air, a narrow beam, wet stone, and the body returning to calm.",
    notes: {
      top: ["Salt air", "Green sage", "Cool bergamot"],
      heart: ["Mineral amber", "Light through fog", "Transparent woods"],
      base: ["Sandalwood", "Driftwood", "Skin musk"],
    },
    mood: ["Composed", "Nocturnal", "Magnetic"],
    wear: ["After rain", "Late drives", "White linen at night"],
    finish:
      "A sandalwood-musk drydown with mineral amber warmth: clean, lived-in, and quietly magnetic.",
    character:
      "Freshness with poise. Maris feels like guidance in darkness rather than sunny coastal ease.",
    quote: "Salt. Signal. Silence.",
    storyLead:
      "If the opening is the sea, the heart is the beam, and the base is the body.",
    storyMantra: "Not coastal. Composed.",
    storyArc: [
      {
        label: "Air",
        title: "Exposure",
        body:
          "Salt air and green sage widen the room at first spray: cold, lucid, almost bracing.",
      },
      {
        label: "Beam",
        title: "Radiance",
        body:
          "Mineral amber and transparent woods create the signal: presence without heaviness, light moving through fog.",
      },
      {
        label: "Skin",
        title: "Memory",
        body:
          "Sandalwood, driftwood, and skin musk stay close, like weather remembered on a collar.",
      },
    ],
    size: "50mL Eau de Parfum",
    ...coreBottlePrice,
    launch: "Available Now",
    visual: {
      src: "/editorial/tara-maris-square-optimized.webp",
      alt: "Maris perfume bottle with an opaque teal label, salt crystals, driftwood, sage, and coastal water.",
    },
    homeVisual: {
      src: "/editorial/tara-maris-square-optimized.webp",
      alt: "Maris perfume bottle with an opaque teal label, salt crystals, driftwood, sage, and coastal water.",
    },
  },
  {
    slug: "eliora",
    name: "Eliora",
    audience: "For Her",
    status: "available",
    isNew: false,
    tagline: "Radiance After Dark",
    line: "Golden Floral Musk",
    summary:
      "ELIORA is a golden floral-musk made for the hour when daylight becomes secretive. A sparkling citrus-spice opening gives way to creamy white florals before clean musk, amber skin, and sheer woods settle close.",
    story:
      "ELIORA is TARA's evening secret made permanent: warm, feminine, and quietly mysterious, like a hidden bloom opening at dusk and leaving radiance remembered after the room goes quiet.",
    notes: {
      top: ["Sparkling citrus", "Soft aldehydic shimmer", "Pink pepper spice"],
      heart: ["Jasmine radiance", "Neroli", "Ylang-ylang"],
      base: ["Clean musk", "Amber skin", "Sheer woods"],
    },
    mood: ["Mysterious", "Radiant", "Intimate"],
    wear: ["Golden hour", "Evening rituals", "After-dark closeness"],
    finish:
      "Clean musk, amber warmth, soft vanilla, sheer woods, and a subtle velvet shadow.",
    character:
      "A soft-spiced floral musk with hidden radiance: polished, sensual, and controlled rather than sweet.",
    quote: "First welcomed in person. Now part of the house.",
    storyLead:
      "If the opening is a golden spark, the heart is the flower behind the curtain, and the base is the warmth remembered on skin.",
    storyMantra: "Soft spice. Hidden radiance.",
    storyArc: [
      {
        label: "Spark",
        title: "Invitation",
        body:
          "Sparkling citrus, aldehydic shimmer, and pink pepper create the first glint: bright enough to invite you in, soft enough to keep the secret intact.",
      },
      {
        label: "Bloom",
        title: "Reveal",
        body:
          "Jasmine, neroli, and ylang-ylang unfold into creamy white florals with a golden body and quiet theatrical warmth.",
      },
      {
        label: "Afterglow",
        title: "Memory",
        body:
          "Clean musk, amber skin, sheer woods, and velvet shadow settle close, leaving radiance remembered rather than announced.",
      },
    ],
    size: "50mL Eau de Parfum",
    ...coreBottlePrice,
    launch: "Available Now",
    visual: {
      src: "/editorial/tara-eliora-square-optimized.webp",
      alt: "ELIORA perfume bottle with an opaque warm label, white florals, citrus peel, amber crystals, and golden light.",
    },
    homeVisual: {
      src: "/editorial/tara-eliora-square-optimized.webp",
      alt: "ELIORA perfume bottle with an opaque warm label, white florals, citrus peel, amber crystals, and golden light.",
    },
  },
  {
    slug: "ashoka",
    name: "Ashoka",
    audience: "For Her",
    status: "available",
    isNew: false,
    tagline: "A Softness That Stays",
    line: "Almond Orchid Amber Musk",
    summary:
      "Ashoka opens with creamy almond and a soft floral hush before vanilla orchid, pale petals, and skin musk settle into a tender amber warmth. It is softness with a spine: feminine, close, and quietly impossible to forget.",
    story:
      "Ashoka is the pause after the noise leaves the room. It wears like a private softness that does not disappear: warm skin, almond silk, pale blooms, and the kind of gentleness that stays.",
    notes: {
      top: ["Creamy almond", "Soft bergamot", "Powdered petals"],
      heart: ["Vanilla orchid", "Cherry blossom", "Cashmere florals"],
      base: ["Tonka warmth", "Skin musk", "Soft amber"],
    },
    mood: ["Soft", "Tender", "Memorable"],
    wear: ["Quiet dates", "Soft daily rituals", "Close evenings"],
    finish:
      "A creamy amber-musk drydown with almond warmth and floral softness held close to skin.",
    character:
      "Sensual without sharp edges. Ashoka is made for people who want warmth, tenderness, and a lingering feminine signature.",
    quote: "A softness that stays.",
    storyLead:
      "If the opening is almond silk, the heart is a pale bloom, and the base is the warmth someone remembers.",
    storyMantra: "Softness with a spine.",
    storyArc: [
      {
        label: "Hush",
        title: "Softness",
        body:
          "Creamy almond, soft bergamot, and powdered petals open gently, like warm light through a quiet room.",
      },
      {
        label: "Bloom",
        title: "Tenderness",
        body:
          "Vanilla orchid, cherry blossom, and cashmere florals create the feminine heart: smooth, intimate, and never loud.",
      },
      {
        label: "Stay",
        title: "Memory",
        body:
          "Tonka warmth, skin musk, and soft amber remain close, turning softness into a signature that lingers.",
      },
    ],
    size: "50mL Eau de Parfum",
    ...coreBottlePrice,
    launch: "Available Now",
    visual: {
      src: "/editorial/tara-ashoka-square-optimized.webp",
      alt: "Ashoka perfume bottle with an opaque black label, golden juice, and the words a softness that stays.",
    },
    homeVisual: {
      src: "/editorial/tara-ashoka-editorial-optimized.webp",
      alt: "Ashoka perfume bottle styled with vanilla orchid, soft blossoms, almond, and warm ivory light.",
    },
  },
  {
    slug: "ardor",
    name: "Ardor",
    audience: "For Him",
    status: "available",
    isNew: false,
    tagline: "Ignite Your Presence",
    line: "Black Tea Spice Tonka Woods",
    summary:
      "Ardor opens with black tea, cardamom, and cracked pepper before lavender smoke, cinnamon bark, and amber resin heat the air. Tonka, sandalwood, and dark musk finish with a magnetic after-dark pull.",
    story:
      "Ardor is heat under control. It is the tailored dark shirt, the first charged silence, the spice that moves closer, and the confidence that does not need to raise its voice.",
    notes: {
      top: ["Black tea", "Cardamom", "Cracked pepper"],
      heart: ["Cinnamon bark", "Lavender smoke", "Amber resin"],
      base: ["Tonka bean", "Sandalwood", "Dark musk"],
    },
    mood: ["Magnetic", "Heated", "Commanding"],
    wear: ["Night plans", "Sharp entrances", "After-dark confidence"],
    finish:
      "A warm tonka-wood drydown with amber smoke, spice, and dark musk close to skin.",
    character:
      "Masculine warmth with polished restraint. Ardor feels spicy, confident, and sensual without becoming heavy.",
    quote: "Ignite your presence.",
    storyLead:
      "If the opening is black tea and spice, the heart is controlled heat, and the base is the trail that keeps attention.",
    storyMantra: "Heat under control.",
    storyArc: [
      {
        label: "Spark",
        title: "Charge",
        body:
          "Black tea, cardamom, and cracked pepper open with dry warmth and immediate presence.",
      },
      {
        label: "Heat",
        title: "Control",
        body:
          "Cinnamon bark, lavender smoke, and amber resin create a textured heart: spicy, polished, and close.",
      },
      {
        label: "Ember",
        title: "Pull",
        body:
          "Tonka bean, sandalwood, and dark musk settle into a sensual trail built for after-dark confidence.",
      },
    ],
    size: "50mL Eau de Parfum",
    ...coreBottlePrice,
    launch: "Available Now",
    visual: {
      src: "/editorial/tara-ardor-square-optimized.webp",
      alt: "Ardor perfume bottle with an opaque black label, warm amber juice, spices, tea leaves, and woods.",
    },
    homeVisual: {
      src: "/editorial/tara-ardor-square-optimized.webp",
      alt: "Ardor perfume bottle with black tea, cardamom, cinnamon, lavender, tonka, and sandalwood styling.",
    },
  },
  {
    slug: "theon",
    name: "THEON",
    audience: "For Everyone",
    status: "available",
    isNew: true,
    tagline: "steeped in divine calm",
    line: "Warm Tea Gourmand",
    summary:
      "A warm, creamy tea fragrance: golden oolong and osmanthus steeped in coconut cream, soft vanilla, and skin-close musk. THEON turns a small daily ritual into something luminous.",
    story:
      "THEON is the warmth you return to: a quiet steeping of tea, cream, pale gold, and skin. It feels ceremonial without becoming distant, tender without becoming sweet.",
    notes: {
      top: ["Bergamot", "Bright citrus lift"],
      heart: ["Golden oolong", "Osmanthus", "Green tea", "Coconut cream"],
      base: ["Soft vanilla", "Sandalwood", "Warm musk"],
    },
    mood: ["Warm", "Calm", "Luminous"],
    wear: ["Morning rituals", "Quiet evenings", "Close daily wear"],
    finish:
      "A creamy sandalwood-musk drydown with vanilla warmth and tea-soft radiance close to skin.",
    character:
      "Warm tea comfort with polished restraint. THEON feels golden, calm, intimate, and quietly memorable.",
    quote: "The warmth you return to.",
    storyLead:
      "If the opening is a small golden lift, the heart is the tea ritual, and the base is the softness that stays on skin.",
    storyMantra: "Steeped in warmth.",
    storyArc: [
      {
        label: "Lift",
        title: "First Light",
        body:
          "Bergamot and bright citrus lift the first breath, giving the tea accord a luminous opening.",
      },
      {
        label: "Steep",
        title: "Ritual",
        body:
          "Golden oolong, osmanthus, green tea, and coconut cream create the warm center: smooth, calm, and softly radiant.",
      },
      {
        label: "Stay",
        title: "Skin",
        body:
          "Soft vanilla, sandalwood, and warm musk settle close, leaving a tender trail that feels composed and familiar.",
      },
    ],
    size: "50mL and 8mL Eau de Parfum",
    ...coreBottlePrice,
    launch: "New Launch",
    visual: {
      src: "/editorial/tara-theon-50ml.png",
      alt: "THEON 50mL Eau de Parfum bottle in warm golden light with an ivory label and black cap.",
      fit: "contain",
    },
    homeVisual: {
      src: "/editorial/tara-theon-duo.png",
      alt: "THEON 50mL and 8mL Eau de Parfum bottles in warm golden light.",
    },
  },
];
