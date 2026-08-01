import { brand } from "@/content/brand";

export const homepageTrust = {
  eyebrow: "Why TARA",
  title: "Luxury, made easier to trust.",
  body:
    "TARA is a registered Malaysian fragrance house built for affordable luxury: edited scents, clear launch pricing, direct concierge support, and transparent order confirmation.",
  registration: {
    label: "Registered in Malaysia",
    value: "SSM No. 202603110736",
  },
  credentials: [
    {
      title: "Local Launch Operations",
      body:
        "Orders are handled through TARA-owned channels with personal confirmation before fulfillment, so customers are not left guessing after checkout.",
      icon: "shield" as const,
    },
    {
      title: "Transparent Scent Structure",
      body:
        "Every scent page discloses top, heart, and base note families so buyers understand the mood, dry-down, and wear profile before ordering.",
      icon: "spark" as const,
    },
    {
      title: "Malaysia-Ready Wear Testing",
      body:
        "The first lineup is written for humid days, air-conditioned offices, evening plans, and close-contact wear without becoming too loud.",
      icon: "globe" as const,
    },
  ],
  launchStats: [
    {
      value: "127",
      label: "Discovery sets sold this month",
      body:
        "Sampling is becoming the first step for new TARA customers before committing to a 50mL bottle.",
    },
    {
      value: "7",
      label: "Full-bottle scents online",
      body:
        "Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, and THEON are now available as TARA's growing scent family.",
    },
    {
      value: "RM99",
      label: "Lowest-risk first order",
      body:
        "The 3 x 8mL discovery set helps you test on skin before choosing the bottle that stays with you.",
    },
  ],
};

export const scentDiscoveryExperience = {
  eyebrow: "Find Your Signature Scent",
  title: "Choose by mood, occasion, and skin memory.",
  body:
    "Fragrance is hard to judge through a screen. Answer three quick questions and TARA will match you to the scent most likely to fit your mood, occasion, and preferred notes.",
  quizPromise:
    "Work, date, daily, or special. Luminous, magnetic, fresh, or warm. Citrus, floral, woods, or amber.",
  primary: {
    label: "Take The Scent Quiz",
    href: "/quiz",
    variant: "primary" as const,
  },
  secondary: {
    label: "Text Us For Scent Advice",
    href: brand.whatsappUrl,
    variant: "secondary" as const,
  },
  videoPrompt:
    "Not sure? Text us your skin type, usual perfumes, and the kind of impression you want. If you have a spray or dry-down video, send it too and TARA will recommend the closest match.",
};
