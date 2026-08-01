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
  testimonials: [
    {
      name: "Aina",
      location: "Kuala Lumpur",
      scent: "Aureya",
      quote:
        "Aureya feels soft but expensive. It stayed close on my skin through office air-cond and still smelled warm when I got home.",
      visual: {
        src: "/editorial/tara-aureya-social-optimized.webp",
        alt: "Aureya perfume bottle styled with blush florals for an early customer review.",
      },
    },
    {
      name: "Daniel",
      location: "Petaling Jaya",
      scent: "Zephyr",
      quote:
        "Zephyr is clean without smelling basic. The citrus opens bright, then the woody musk makes it feel more confident.",
      visual: {
        src: "/editorial/tara-zephyr-social-optimized.webp",
        alt: "Zephyr perfume bottle styled with city notes for an early customer review.",
      },
    },
    {
      name: "Mira",
      location: "Shah Alam",
      scent: "Eliora",
      quote:
        "I tried Eliora at the reveal and kept thinking about it after. It feels golden, feminine, and not too sweet.",
      visual: {
        src: "/editorial/tara-eliora-square-optimized.webp",
        alt: "ELIORA perfume bottle in golden floral styling for an early customer review.",
      },
    },
    {
      name: "Nadia",
      location: "Subang Jaya",
      scent: "Ashoka",
      quote:
        "Ashoka feels soft and expensive without being too sweet. The almond warmth stays close, which makes it easy to wear every day.",
      visual: {
        src: "/editorial/tara-ashoka-editorial-optimized.webp",
        alt: "Ashoka perfume bottle styled with soft florals and almond warmth for an early customer review.",
      },
    },
    {
      name: "Ryan",
      location: "Kuala Lumpur",
      scent: "Ardor",
      quote:
        "Ardor has that warm spicy confidence I wanted. It feels polished at first, then the tonka and woods make it more addictive.",
      visual: {
        src: "/editorial/tara-ardor-square-optimized.webp",
        alt: "Ardor perfume bottle styled with black tea, spice, and woods for an early customer review.",
      },
    },
  ],
  ugcPrompt: {
    title: "Share your bottle ritual.",
    body:
      "Post your TARA bottle, skin-test notes, or discovery set ranking and tag @tara_scents.my with #TARAScents.",
    hashtag: "#TARAScents",
    cta: {
      label: "Tag TARA On Instagram",
      href: brand.instagramUrl,
      variant: "secondary" as const,
    },
  },
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

export const launchUrgency = {
  eyebrow: "Launch Allocation",
  title: "First 100 bottles at RM169.",
  body:
    "Full-bottle launch pricing is limited before 50mL bottles return to RM239. If you already know your scent, reserve the RM169 allocation now.",
  remaining: 47,
  total: 100,
  ticker: [
    "RM169 launch pricing active",
    "3 x 8mL discovery set available at RM99",
    "WhatsApp scent advice open for Malaysia orders",
    "THEON has joined the TARA scent family",
  ],
  cta: {
    label: "Reserve Launch Price",
    href: "/preorder#secure-checkout",
    variant: "primary" as const,
  },
};

export const paymentLocalization = {
  eyebrow: "Malaysia-Friendly Checkout",
  title: "Pay locally. Confirm personally.",
  body:
    "Secure checkout is handled through ToyyibPay, with Malaysian-friendly payment methods shown on the hosted payment page. WhatsApp concierge remains available for order guidance before payment.",
  badges: ["ToyyibPay", "FPX", "Credit Card", "DuitNow QR when enabled", "TNG manual support"],
};

export const scentGuarantee = {
  title: "Start with RM99. Upgrade with confidence.",
  body:
    "Order the 3 x 8mL discovery set before choosing a full bottle. If you move from discovery to a 50mL preorder during the launch window, message TARA and the house can apply the sample-set value as a concierge credit where eligible.",
  note:
    "Credit is manually confirmed by TARA and applies once per customer during launch allocation.",
};
