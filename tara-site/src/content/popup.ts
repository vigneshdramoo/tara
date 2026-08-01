import { brand } from "@/content/brand";

const whatsappBaseUrl = brand.whatsappUrl.split("?")[0];

export const popupWhatsAppMessage =
  "Hi TARA, I would like details for TARA Scent Trail: Stop 12.";

export const popupWhatsAppUrl = `${whatsappBaseUrl}?text=${encodeURIComponent(
  popupWhatsAppMessage,
)}`;

export const popupCampaign = {
  strategySources: [
    "Content Library/TARA/Documents/Social_Strategy/Pop_Up_Launch_Update_2026-05-11/TARA-pop-up-launch-pricing-and-strategy-update-20260511-001.md",
    "Content Library/TARA/Documents/Social_Strategy/Pop_Up_Launch_Update_2026-05-11/TARA-pop-up-launch-content-manager-index-20260511-001.md",
    "Content Library/TARA/Documents/Social_Strategy/Pop_Up_Launch_Update_2026-05-11/TARA-instagram-day4-to-day21-pop-up-content-plan-20260511-001.md",
    "Content Library/TARA/Documents/Social_Strategy/Instagram_Performance_Report_2026-05-14/TARA-instagram-performance-report-20260415-to-20260512-001.md",
  ],
  event: {
    eyebrow: "TARA Scent Trail: Stop 12",
    title: "The trail returns to The Curve.",
    body:
      "TARA Scent Trail: Stops 01-11 have moved through Sunway, SS2, Huuha Land, MyTOWNKL, INTI Subang, The Curve, SunFest, Cheras, and Taylor's. Stop 12 brings TARA back to The Street @ The Curve for Lurve Market x TARA, marking the house's second visit to The Curve after Stop 06 with NANANO Market.",
    name: "TARA Scent Trail: Stop 12",
    host: "TARA",
    venue: "The Street @ The Curve",
    dates: "To be announced",
    hours: "To be announced",
    role: "Upcoming return to The Curve for scent discovery",
    status: "Upcoming",
    nextRemark:
      "Stop 12 is Lurve Market x TARA at The Street @ The Curve. Date and time will be announced soon.",
  },
  offer: {
    eyebrow: "Scent Trail Set",
    title: "Discovery continues online.",
    body:
      "The trail introduced TARA through fast skin tests, scent strips, and 8mL discovery sets. If you missed the physical stops, start online with the RM99 discovery set before choosing a full bottle.",
    note: "TARA Scent Trail: Stops 01-11 are completed. Stop 12 at The Street @ The Curve is upcoming.",
  },
  eliora: {
    eyebrow: "ELIORA / Now In The Lineup",
    title: "ELIORA stays with TARA.",
    line: "First welcomed at Sunway Square. Now part of the house.",
    body:
      "A golden floral-musk hidden in twilight, unfolding through soft spice, creamy white florals, clean musk, and amber skin warmth.",
    details: [
      "Available now",
      "For Her",
      "50mL Eau de Parfum",
      "Part of the 8mL promo",
      "Online preorder open",
    ],
  },
  ctas: {
    primary: {
      label: "Stay Tuned On Instagram",
      href: brand.instagramUrl,
      variant: "primary" as const,
    },
    secondary: {
      label: "Order Discovery Set",
      href: "/preorder?checkout=three-8ml-promo#secure-checkout",
      variant: "secondary" as const,
    },
    whatsapp: {
      label: "WhatsApp For Stop Details",
      href: popupWhatsAppUrl,
      variant: "primary" as const,
    },
  },
  visuals: {
    hero: {
      src: "/editorial/tara-four-scents-lineup-square-optimized.webp",
      alt: "Four TARA perfume bottles for Aureya, Eliora, Zephyr, and Maris with opaque labels.",
    },
    offer: {
      src: "/editorial/tara-popup-8ml-rm99-optimized.webp",
      alt: "TARA 8mL pop-up launch special showing any 3 x 8mL EDP for RM99.",
    },
    eliora: {
      src: "/editorial/tara-eliora-square-optimized.webp",
      alt: "ELIORA perfume bottle with an opaque warm label, white florals, citrus peel, amber crystals, and golden light.",
    },
  },
};

export const scentTrailStops = [
  {
    stop: "Stop 01",
    title: "Foodie Tour v27: Romantic Cupid Sakura",
    venue: "Sunway Square South Quay Lake",
    host: "Flash Mobs Entertainment",
    dates: "27 May to 2 June 2026",
    hours: "4pm to 11pm daily",
    status: "Completed",
    body:
      "TARA's first physical scent-discovery moment. Visitors met Aureya, Zephyr, Maris, and the first reveal of Eliora in person.",
    highlights: ["First TARA booth", "ELIORA first welcomed", "3 x 8mL RM99 launch set"],
  },
  {
    stop: "Stop 02",
    title: "The Hub SS2 Weekend Stop",
    venue: "The Hub @ SS2, Petaling Jaya",
    host: "TARA Scent Trail: Stop 02",
    dates: "6 June to 7 June 2026",
    hours: "11am to 9pm daily",
    status: "Completed",
    body:
      "A neighborhood scent bar built for quick testing, gifting conversations, and discovery-set matching across the full TARA family.",
    highlights: ["Weekend scent bar", "Petaling Jaya stop", "Full scent family testing"],
  },
  {
    stop: "Stop 03",
    title: "KL Sidewalk @ Huuha Land",
    venue: "KL Sidewalk @ Huuha Land",
    host: "KL Sidewalk",
    dates: "12 June to 14 June 2026",
    hours: "5pm to 12am daily",
    status: "Completed",
    body:
      "A night-market trail stop where visitors explored TARA through scent cards, 8mL sets, and evening-wear recommendations.",
    highlights: ["Night market stop", "Aureya, Zephyr, Maris, Eliora", "Scent cards and 8mL sets"],
  },
  {
    stop: "Stop 04",
    title: "Public Market 5.0",
    venue: "Booth 7, MRT Tunnel, MyTOWNKL",
    host: "Public Market 5.0 x MRT MyTOWNKL",
    dates: "19 June to 21 June 2026",
    hours: "10am to 10pm daily",
    status: "Completed",
    body:
      "A high-speed scent bar in the MRT tunnel flow, designed for commuters, market browsers, and mall visitors to meet the full TARA lineup.",
    highlights: ["Booth 7", "MRT Tunnel, MyTOWNKL", "Fast scent matching"],
  },
  {
    stop: "Stop 05",
    title: "INTI College, Subang",
    venue: "INTI College, Subang",
    host: "TARA Scent Trail: Stop 05",
    dates: "30 June 2026",
    hours: "10am to 4pm",
    status: "Completed",
    body:
      "A one-day campus scent discovery stop where visitors met TARA's after-dark launch direction and tested the expanded scent family.",
    highlights: ["INTI Subang", "One-day campus stop", "After-dark discovery"],
  },
  {
    stop: "Stop 06",
    title: "TARA x NANANO Market",
    venue: "The Street, The Curve",
    host: "NANANO Market",
    dates: "1 July to 5 July 2026",
    hours: "10am to 10pm daily",
    status: "Completed",
    body:
      "A five-day TARA x NANANO Market stop at The Curve, with ARDOR and ASHOKA joining the discovery conversation.",
    highlights: ["The Street, The Curve", "TARA x NANANO Market", "ARDOR and ASHOKA launch"],
  },
  {
    stop: "Stop 07",
    title: "INTI College, Subang",
    venue: "INTI College, Subang",
    host: "TARA Scent Trail: Stop 07",
    dates: "6 July 2026",
    hours: "10am to 4pm",
    status: "Completed",
    body:
      "A return to INTI Subang for another focused campus scent-discovery session, built for fast trials, travel-size matching, and student gifting conversations.",
    highlights: ["INTI Subang return", "Campus scent bar", "Fast scent matching"],
  },
  {
    stop: "Stop 08",
    title: "SunFest @ Sunway University College",
    venue: "Sunway University College",
    host: "SunFest",
    dates: "6 July to 8 July 2026 and 10 July 2026",
    hours: "10am to 6pm on event days",
    status: "Completed",
    body:
      "A multi-day SunFest activation that brought TARA back to the Sunway student community for fragrance testing, discovery sets, and in-person scent conversations.",
    highlights: ["SunFest", "Sunway University College", "Multi-day campus activation"],
  },
  {
    stop: "Stop 09",
    title: "INTI College, Subang",
    venue: "INTI College, Subang",
    host: "TARA Scent Trail: Stop 09",
    dates: "13 July 2026",
    hours: "10am to 4pm",
    status: "Completed",
    body:
      "A one-day return to INTI Subang for campus visitors to discover the TARA scent family, build travel-size sets, and find a scent that fits the day.",
    highlights: ["INTI Subang", "One-day campus stop", "10am to 4pm"],
  },
  {
    stop: "Stop 10",
    title: "WARLOK Vol. 1.0",
    venue: "SUCA Urban Sip, Cheras",
    host: "WARLOK Vol. 1.0 x The Community Market",
    dates: "18 July to 19 July 2026",
    hours: "12pm to 10pm daily",
    status: "Completed",
    body:
      "A weekend community-market stop at SUCA Urban Sip, connecting TARA with local brands, coffee, and the Cheras weekend crowd.",
    highlights: ["SUCA Urban Sip", "Cheras community market", "12pm to 10pm"],
  },
  {
    stop: "Stop 11",
    title: "Matcha Market x TARA",
    venue: "Arcadia, Taylor's Lakeside Campus",
    host: "Matcha Market",
    dates: "20 July and 22 July 2026",
    hours: "10am to 5pm on TARA event days",
    status: "Completed",
    body:
      "A fresh campus-market stop at Taylor's Lakeside Campus, pairing TARA scent discovery with Matcha Market's student-led energy.",
    highlights: ["Taylor's Lakeside Campus", "Arcadia", "20 & 22 July"],
  },
  {
    stop: "Stop 12",
    title: "Lurve Market x TARA",
    venue: "The Street @ The Curve",
    host: "Lurve Market",
    dates: "To be announced",
    hours: "To be announced",
    status: "Upcoming",
    body:
      "TARA returns to The Street @ The Curve for its second Curve visit, following Stop 06 with NANANO Market, bringing the Scent Trail back into a familiar lifestyle-market flow.",
    highlights: ["Second visit to The Curve", "The Street @ The Curve", "Lurve Market x TARA"],
  },
] as const;

export const nextTrailStopNotice = {
  eyebrow: "Next Trail Stop",
  title: "Stop 12 returns to The Street @ The Curve.",
  body:
    "TARA joins Lurve Market x TARA at The Street @ The Curve for Stop 12. This is TARA's second Scent Trail visit to The Curve after Stop 06 with NANANO Market. Date and time will be announced soon.",
};

export const popupQuickFacts = [
  {
    label: "Status",
    value: "Stop 12 upcoming",
    detail: "TARA returns to The Street @ The Curve with Lurve Market x TARA.",
  },
  {
    label: "Stops",
    value: "11 completed / 01 upcoming",
    detail: "Stops 01-11 are completed. Stop 12 is the next confirmed trail stop.",
  },
  {
    label: "Lineup",
    value: "Seven-scent family",
    detail: "Aureya, Zephyr, Maris, Eliora, Ardor, Ashoka, and THEON are available for discovery.",
  },
  {
    label: "Next",
    value: "Stop 12",
    detail: "Lurve Market x TARA at The Street @ The Curve. Date and time to be announced.",
  },
];

export const popupEventCardCopy = {
  headline: "TARA Scent Trail: Stop 12",
  subhead: "Stops 01-11 completed. Stop 12 returns TARA to The Street @ The Curve.",
  details: [
    "TARA Scent Trail: Stop 01 - Foodie Tour v27, Sunway Square South Quay Lake",
    "TARA Scent Trail: Stop 02 - The Hub @ SS2, Petaling Jaya",
    "TARA Scent Trail: Stop 03 - KL Sidewalk @ Huuha Land",
    "TARA Scent Trail: Stop 04 - Public Market 5.0, MRT Tunnel, MyTOWNKL",
    "TARA Scent Trail: Stop 05 - INTI College, Subang",
    "TARA Scent Trail: Stop 06 - TARA x NANANO Market, The Street, The Curve",
    "TARA Scent Trail: Stop 07 - INTI College, Subang",
    "TARA Scent Trail: Stop 08 - SunFest @ Sunway University College",
    "TARA Scent Trail: Stop 09 - INTI College, Subang",
    "TARA Scent Trail: Stop 10 - WARLOK Vol. 1.0, SUCA Urban Sip, Cheras",
    "TARA Scent Trail: Stop 11 - Matcha Market x TARA, Arcadia, Taylor's Lakeside Campus",
    "TARA Scent Trail: Stop 12 - Lurve Market x TARA, The Street @ The Curve",
    popupCampaign.event.nextRemark,
  ],
  footer: "TARA Scent Trail: Stop 12 | Lurve Market x TARA | The Street @ The Curve",
  cta: "Follow TARA for TARA Scent Trail: Stop 12 updates.",
};

export const popupPinnedPostCopy = {
  beforeLaunch: [
    {
      title: "Official Pop-Up Announcement",
      caption:
        "TARA will make its first physical appearance at Foodie Tour v27: Romantic Cupid Sakura. Visit us at Sunway Square South Quay Lake from 27 May to 2 June 2026, 4pm to 11pm daily, and come smell the TARA scent lineup in person.",
      cta: "Save this post and WhatsApp TARA for booth details.",
      pinnedComment:
        "We will be there every day from 4pm to 11pm, 27 May to 2 June.",
    },
    {
      title: "ELIORA First Reveal",
      caption:
        "ELIORA joined TARA at the pop-up and earned its place in the permanent scent lineup. This golden floral-musk is available in 50mL EDP and eligible for the 8mL promo set.",
      cta: "Save this as your ELIORA reminder.",
      pinnedComment: "ELIORA stays with TARA. Would you try it first in 50mL, 8mL, or both?",
    },
    {
      title: "3 x 8mL RM99 Launch Bundle",
      caption:
        "Build your 3-scent TARA set for RM99 at the booth. Each 8mL is RM45 individually; for the pop-up launch, choose any 3 x 8mL EDP for RM99 while booth stock lasts.",
      cta: "Comment your 3-scent set in order.",
      pinnedComment:
        "Build your set: AUREYA, ZEPHYR, MARIS, ELIORA. Which 3 would you choose?",
    },
  ],
  duringEvent: [
    {
      title: "Live Today",
      caption:
        "TARA is live at Foodie Tour v27. Come smell the full scent lineup at Sunway Square South Quay Lake today from 4pm to 11pm.",
      cta: "Visit today or WhatsApp TARA for booth details.",
      pinnedComment: "Today only? No, we are here until 2 June, 4pm-11pm daily.",
    },
    {
      title: "ELIORA Joined The Lineup",
      caption:
        "ELIORA was first introduced at the booth and is now part of the TARA scent lineup online.",
      cta: "Save this if ELIORA is your reason to explore TARA.",
      pinnedComment: "Come for the original scents. Stay for ELIORA.",
    },
    {
      title: "Any 3 x 8mL For RM99",
      caption:
        "The pop-up launch special is still running: any 3 x 8mL EDP for RM99 while booth stock lasts.",
      cta: "Build your set at the booth.",
      pinnedComment: "Which 3 would you choose today?",
    },
  ],
};
