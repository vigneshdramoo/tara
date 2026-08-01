import type { Cta, VisualAsset } from "@/types/content";

type AboutBenefit = {
  title: string;
  body: string;
};

type AboutNoteLayer = {
  label: string;
  title: string;
  body: string;
};

type AboutFacet = {
  title: string;
  body: string;
};

type AboutSection = {
  eyebrow: string;
  title: string;
  body: string;
  paragraphs?: string[];
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  body: string;
  note: string;
  visual: VisualAsset;
  opening: {
    title: string;
    paragraphs: string[];
    quote: string;
  };
  purpose: AboutSection;
  scentMatters: AboutSection & {
    benefits: AboutBenefit[];
  };
  magic: AboutSection & {
    layers: AboutNoteLayer[];
    closing: string[];
  };
  signature: AboutSection & {
    facets: AboutFacet[];
  };
  finalWhisper: AboutSection;
  ctas: {
    primary: Cta;
    secondary: Cta;
  };
};

export const about: AboutContent = {
  eyebrow: "About TARA",
  title: "Fragrance written like a private confession.",
  body:
    "TARA was built for women and men who do not need noise to feel magnetic. The house moves through black glass, warm skin, polished tailoring, and the lingering emotion a scent leaves behind.",
  note: "The point is not to fill the room. The point is to stay with someone after you leave it.",
  visual: {
    src: "/editorial/tara-about-private-confession-hero-optimized.webp",
    alt: "TARA perfume bottles in soft window light, written like a private fragrance confession.",
    priority: true,
  },
  opening: {
    title: "The first chapter is intentionally edited down.",
    paragraphs: [
      "Aureya turns golden softness into quiet confidence. Zephyr turns clean masculine air into magnetic radiance. Maris introduces mineral freshness for skin, linen, and late light.",
      "Every formula is composed to feel close before it feels loud. You notice the texture first, then the temperature, then the memory it leaves on fabric and skin.",
    ],
    quote:
      "The point is not to fill the room. The point is to stay with someone after you leave it.",
  },
  purpose: {
    eyebrow: "Our Purpose",
    title: "Every soul deserves to feel beautiful and seen.",
    body:
      "Perfume is not about showing off. It is about carrying your own aura.",
    paragraphs: [
      "We started TARA with a simple idea: you do not need to be rich to smell good or to feel good. Luxury should not belong only to the privileged few.",
      "That is why we work with master perfumers and ethical suppliers to make polished, lasting scents at a price that welcomes more people in.",
      "Our mission is to give you a bottle of confidence that can become part of your everyday ritual, whether you are walking into a meeting, a date, or a moment of quiet reflection.",
    ],
  },
  scentMatters: {
    eyebrow: "Why Scent Matters",
    title: "Perfume is emotional self-care.",
    body:
      "Scent reaches memory, mood, and identity with unusual speed. The right fragrance can do more than smell pleasant. It can shift how you feel and how you carry yourself.",
    benefits: [
      {
        title: "Elevates Mood",
        body:
          "Bright citrus can lift energy, while warm amber accords can bring comfort, softness, and balance within seconds.",
      },
      {
        title: "Calms Stress",
        body:
          "Familiar, soothing aromas can become a psychological anchor, telling your mind it is safe to slow down after a long day.",
      },
      {
        title: "Triggers Memory",
        body:
          "Because smell and memory are closely connected, a signature scent can become tied to people, places, and private moments.",
      },
      {
        title: "Improves Focus",
        body:
          "Certain notes can support alertness and clarity, making fragrance a subtle tool for work, study, and creative flow.",
      },
      {
        title: "Builds Confidence",
        body:
          "Feeling good about how you smell changes posture, presence, and communication. Fragrance can be a quiet act of self-empowerment.",
      },
      {
        title: "Supports Rest",
        body:
          "Used as part of an evening ritual, scent can signal the brain to unwind and prepare the body for deeper relaxation.",
      },
    ],
  },
  magic: {
    eyebrow: "How We Create Magic",
    title: "Art, chemistry, and real-world wear.",
    body:
      "TARA fragrances are built around the classic perfume pyramid, then re-imagined for modern lives, humid weather, and air-conditioned days.",
    layers: [
      {
        label: "Top Notes",
        title: "The Greeting",
        body:
          "Bright, volatile essences are the first whisper you and others notice. Citrus, herbs, and spices say hello before slowly fading.",
      },
      {
        label: "Heart Notes",
        title: "The Emotion",
        body:
          "As the top notes soften, the heart unfolds through floral, fruity, or spicy tones. This is the mood of the perfume.",
      },
      {
        label: "Base Notes",
        title: "The Memory",
        body:
          "Deep woods, musks, resins, and gourmands anchor the scent for hours, creating depth, longevity, and a lasting trail.",
      },
    ],
    paragraphs: [
      "We choose each ingredient not because it is fashionable, but because it tells part of a story.",
      "Our perfumers blend natural absolutes with innovative molecules for longevity and projection, with a focus on high oil concentration and balanced diffusion.",
    ],
    closing: [
      "Most importantly, we create perfumes that are wearable every day. They are not bottled celebrities. They are companions.",
      "Each formula goes through months of iteration and real-life testing to make sure it works in Malaysia's humid climate and in air-conditioned offices alike. Only when a perfume performs in the real world does it earn the TARA label.",
    ],
  },
  signature: {
    eyebrow: "Find Your Signature",
    title: "Use fragrance to control your presence.",
    body:
      "Different scents let you express different parts of yourself. TARA encourages exploration, layering, and choosing fragrance as intentionally as you choose what to wear.",
    facets: [
      {
        title: "Fresh and Aquatic",
        body: "Clean, open, and approachable. Built for clarity and ease.",
      },
      {
        title: "Woody Oriental",
        body: "Grounded, structured, and quietly powerful when you enter a room.",
      },
      {
        title: "Sweet or Floral",
        body: "Warm, expressive, and generous without losing refinement.",
      },
      {
        title: "Spicy Amber",
        body: "Seductive, intimate, and magnetic when the evening slows down.",
      },
    ],
    paragraphs: [
      "Our scent family lets you find a fragrance that is as unique as your thumbprint.",
      "Let fragrance become your invisible signature: the impression that lingers long after you leave the room.",
    ],
  },
  finalWhisper: {
    eyebrow: "A Final Whisper",
    title: "The right scent makes you feel complete.",
    body:
      "A fragrance does not just sit on your skin. It whispers to your mind, shapes how you feel, and quietly influences how the world responds to you. TARA exists to help you find that scent and to make sure luxury remains within reach.",
    paragraphs: [
      "Welcome to a world where affordable magic meets authentic identity.",
    ],
  },
  ctas: {
    primary: { label: "Explore Scents", href: "/scents", variant: "primary" },
    secondary: { label: "Reserve Yours", href: "/preorder", variant: "secondary" },
  },
};
