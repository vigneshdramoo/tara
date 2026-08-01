import type { VisualAsset } from "@/types/content";

export type JournalArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  keywords: string[];
  visual: VisualAsset;
  sections: Array<{
    title: string;
    body: string[];
  }>;
};

export const journalArticles: JournalArticle[] = [
  {
    slug: "perfume-malaysia-humid-weather",
    title: "How to choose perfume for Malaysia's humid weather",
    excerpt:
      "A practical guide to projection, dry-down, and note families that stay elegant in heat, rain, and air-conditioned rooms.",
    category: "Climate Guide",
    readTime: "4 min read",
    keywords: ["perfume Malaysia", "fragrance for humid climate", "Malaysia perfume"],
    visual: {
      src: "/editorial/tara-maris-square-optimized.webp",
      alt: "Maris perfume bottle with coastal minerals, salt air, sage, and driftwood styling.",
    },
    sections: [
      {
        title: "Humidity changes how scent behaves.",
        body: [
          "In Malaysia, fragrance often blooms faster because heat and humidity help volatile notes lift from skin. That can make bright citrus, aldehydes, and florals feel more immediate than they would in colder climates.",
          "The goal is not always stronger projection. For daily wear, the better question is whether the scent stays polished after the first hour and still feels close, clean, and intentional in air-conditioned spaces.",
        ],
      },
      {
        title: "Look for balance, not volume.",
        body: [
          "Fresh notes can feel sharp if they are not anchored. Woods, musks, amber, mineral accords, and soft resins help a perfume last without becoming heavy.",
          "If you want clean confidence, start with Zephyr. If you want mineral skin and quiet freshness, start with Maris. If you want warmth that remains soft, explore Aureya, Eliora, or Ashoka. If you want spice and after-dark pull, choose Ardor.",
        ],
      },
    ],
  },
  {
    slug: "scent-layering-guide",
    title: "A simple scent layering guide for everyday rituals",
    excerpt:
      "How to layer fragrance without overwhelming the room: start light, build texture, and let one scent lead.",
    category: "Scent Ritual",
    readTime: "3 min read",
    keywords: ["scent layering", "perfume layering Malaysia", "luxury perfume ritual"],
    visual: {
      src: "/editorial/tara-ashoka-ardor-launch-optimized.webp",
      alt: "Ashoka and Ardor perfume bottles for TARA scent layering inspiration.",
    },
    sections: [
      {
        title: "Let one fragrance lead.",
        body: [
          "Layering works best when one scent is the main identity and the second adds texture. If both compete, the result can feel crowded instead of luxurious.",
          "A clean scent like Zephyr can sharpen soft warmth. A mineral scent like Maris can make florals feel more transparent. Aureya, Eliora, and Ashoka add radiance or softness when you want the skin to feel warmer. Ardor adds spice and amber heat when the night needs more charge.",
        ],
      },
      {
        title: "Apply with restraint.",
        body: [
          "Begin with one spray of the brighter scent, then one spray of the warmer scent on a different pulse point or on fabric. Give it ten minutes before adding more.",
          "For close-contact settings, keep fragrance below the collarbone or on fabric rather than spraying high near the face.",
        ],
      },
    ],
  },
  {
    slug: "eid-fragrance-gifting-malaysia",
    title: "Fragrance gifting in Malaysia: Eid, birthdays, and intimate rituals",
    excerpt:
      "How to choose a thoughtful perfume gift when you do not know someone's exact scent wardrobe.",
    category: "Gifting",
    readTime: "4 min read",
    keywords: ["perfume gift Malaysia", "Eid fragrance gift", "halal fragrance Malaysia"],
    visual: {
      src: "/editorial/tara-aureya-square-optimized.webp",
      alt: "Aureya perfume bottle with blush florals, crystals, and warm dawn light.",
    },
    sections: [
      {
        title: "Gift the feeling, not just the bottle.",
        body: [
          "A good fragrance gift should match the person's rhythm. For someone soft and radiant, choose Aureya. For someone polished and focused, choose Zephyr. For someone calm and quietly magnetic, choose Maris. For golden evening warmth, choose Eliora. For tender almond-orchid softness, choose Ashoka. For warm masculine spice, choose Ardor.",
          "If you are unsure, the 3 x 8mL discovery set is safer than guessing one full bottle. It gives the recipient room to discover what actually sits well on their skin.",
        ],
      },
      {
        title: "Ask the right questions for halal-conscious gifting.",
        body: [
          "Some buyers search for halal fragrance because ingredients, alcohol source, and certification status matter to them. TARA keeps product conversations transparent, but customers who require formal halal certification should ask the house for the latest documentation before purchasing.",
          "For gifting, clarity builds trust. Include the scent notes, size, price, and care details so the perfume feels personal rather than generic.",
        ],
      },
    ],
  },
];

export function getJournalArticle(slug: string) {
  return journalArticles.find((article) => article.slug === slug);
}
