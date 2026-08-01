import type { Cta } from "@/types/content";

export type PolicySection = {
  title: string;
  body?: string;
  items?: string[];
};

export type PolicyPageContent = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  lastUpdated: string;
  intro: string;
  sections: PolicySection[];
  primaryCta?: Cta;
  secondaryCta?: Cta;
};

const lastUpdated = "May 2, 2026";
const legalEmail = "hello@tarascents.com";
const legalWhatsApp = "+01143042883";
const registrationLine = "Registered in Malaysia - SSM No. 202603110736";

export const legalPages = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    eyebrow: "Privacy",
    description:
      "How TARA collects, uses, protects, and manages customer information for orders, checkout, forms, analytics, and concierge support.",
    lastUpdated,
    intro:
      "TARA collects only the information needed to operate a careful fragrance experience: to answer inquiries, process orders, arrange delivery, improve the website, and keep customers close to launch updates they choose to receive.",
    primaryCta: { label: "Contact Concierge", href: "/contact", variant: "primary" },
    secondaryCta: { label: "Preorder Securely", href: "/preorder", variant: "secondary" },
    sections: [
      {
        title: "Who We Are",
        body:
          `TARA is a Malaysian fragrance brand. ${registrationLine}. For privacy questions or personal data requests, contact ${legalEmail} or WhatsApp ${legalWhatsApp}.`,
      },
      {
        title: "Information We Collect",
        items: [
          "Contact details such as name, email address, phone number, WhatsApp handle, city, and delivery information.",
          "Order details such as selected scent, 8mL promo set selection, quantity, notes, delivery preference, payment status, and customer support history.",
          "Quiz and preference details such as scent answers, recommended match, gifting intent, and optional fragrance notes shared by the customer.",
          "Newsletter details such as email address, signup source, consent timestamp where available, and unsubscribe preferences.",
          "Website analytics such as pages visited, clicks, device/browser information, approximate location, traffic source, and event data including checkout, WhatsApp, quiz, contact, and newsletter actions.",
        ],
      },
      {
        title: "How We Use Information",
        items: [
          "To respond to inquiries, recommend scents, confirm preorders, and provide concierge support.",
          "To process checkout, payment status, delivery coordination, customer service, refunds, replacements, and fraud prevention.",
          "To send launch updates, preorder windows, newsletters, and product announcements only where the customer has opted in or contacted us for that purpose.",
          "To improve website performance, measure marketing effectiveness, understand product demand, and refine the quiz and preorder experience.",
          "To comply with legal, accounting, tax, security, and regulatory obligations that apply to TARA.",
        ],
      },
      {
        title: "Payments And Sensitive Details",
        body:
          "Online payments are handled by payment partners such as ToyyibPay. TARA does not ask for, receive, or store full card numbers, online banking credentials, or FPX banking passwords. Payment references, bill codes, transaction status, and customer confirmation details may be stored for order support and reconciliation.",
      },
      {
        title: "Cookies, Analytics, And Tracking",
        body:
          "The website may use cookies, pixels, analytics scripts, and event tracking to understand visits, improve the shopping flow, and measure conversions. This may include Google Analytics 4 and first-party event tracking for preorder submissions, WhatsApp clicks, quiz completions, contact submissions, newsletter signups, checkout starts, and payment result views.",
      },
      {
        title: "Sharing Information",
        items: [
          "Payment processors, checkout providers, banks, and fraud prevention tools where needed to process transactions.",
          "Courier, logistics, and fulfillment partners where needed to deliver orders.",
          "Website, analytics, email, form, hosting, and customer support providers that help operate the TARA website and customer experience.",
          "Professional advisers, authorities, or regulators where disclosure is required by law or needed to protect TARA, customers, or the public.",
        ],
      },
      {
        title: "Retention",
        body:
          "TARA keeps personal data only for as long as reasonably needed for the purpose it was collected, including order support, accounting, legal compliance, customer service, analytics, and future launch communication where the customer has not unsubscribed.",
      },
      {
        title: "Your Choices And Rights",
        items: [
          "You may request access to or correction of personal data held by TARA.",
          "You may unsubscribe from marketing emails or ask TARA to stop non-essential promotional contact.",
          "You may ask questions about how your information is used, subject to identity verification and legal retention requirements.",
          `Requests can be sent to ${legalEmail} or through WhatsApp at ${legalWhatsApp}.`,
        ],
      },
      {
        title: "Security",
        body:
          "TARA uses reasonable administrative, technical, and operational safeguards to protect customer information. No online service can be guaranteed as completely secure, so customers should avoid sending banking passwords, full card details, or sensitive identity documents through chat or open form fields unless specifically requested through a secure process.",
      },
      {
        title: "Updates",
        body:
          "This policy may be updated as TARA introduces new checkout, delivery, analytics, or customer support tools. The latest version will always appear on this page.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms Of Service",
    eyebrow: "Terms",
    description:
      "The terms that govern use of the TARA website, preorder flow, checkout, product information, and concierge communication.",
    lastUpdated,
    intro:
      "These terms keep the experience clear on both sides: what TARA offers, how orders are accepted, how payments work, and what customers can expect when reserving fragrance from the first drop.",
    primaryCta: { label: "Shop The Scents", href: "/scents", variant: "primary" },
    secondaryCta: { label: "Contact TARA", href: "/contact", variant: "secondary" },
    sections: [
      {
        title: "Business Identity",
        body:
          `This website is operated by TARA, a Malaysian fragrance brand. ${registrationLine}. Contact ${legalEmail} or WhatsApp ${legalWhatsApp} for order, product, or policy questions.`,
      },
      {
        title: "Using The Website",
        items: [
          "You agree to use the website only for lawful personal, gifting, press, retail, or business inquiry purposes.",
          "You must not misuse forms, submit false customer details, attempt unauthorized access, interfere with checkout, copy protected brand assets, or use the website in a way that damages TARA or other visitors.",
          "TARA may update, pause, remove, or improve website features without notice where needed for security, stock, launch, or operational reasons.",
        ],
      },
      {
        title: "Product Information",
        body:
          "TARA describes scents through notes, mood, storytelling, imagery, and expected use occasions. Fragrance perception is personal and may vary by skin chemistry, climate, storage, and wearer preference. Images, packaging, color, and presentation may be adjusted as production and launch details are finalized.",
      },
      {
        title: "Pricing And Availability",
        items: [
          "Full bottles are listed at RM239 regular price, with the first 100 bottles offered at RM169 while launch allocation lasts.",
          "The 3 x any 8mL Eau de Parfum promo set is listed at RM99 while promo allocation lasts unless otherwise stated.",
          "Prices are shown in Malaysian Ringgit and may be updated for launches, campaigns, taxes, courier costs, or operational changes.",
          "An item placed in a form, cart, or checkout flow is not reserved until payment or concierge confirmation is completed.",
        ],
      },
      {
        title: "Orders And Preorders",
        items: [
          "A preorder request is an expression of intent until TARA confirms order details, allocation, payment, and delivery information.",
          "TARA may decline, cancel, or refund an order if stock is unavailable, payment fails, details cannot be verified, suspected misuse occurs, or fulfillment is not possible.",
          "Customers are responsible for providing accurate name, phone number, email, city, and delivery details.",
        ],
      },
      {
        title: "Payment",
        body:
          "Secure checkout may be provided through ToyyibPay or another Malaysian-friendly payment provider. Available methods may include FPX, credit card, DuitNow QR, or other supported channels depending on provider configuration. Manual concierge payment may be arranged at TARA's discretion.",
      },
      {
        title: "Delivery",
        body:
          "Delivery timelines are estimates, not guarantees. TARA is not responsible for delays caused by courier operations, incomplete addresses, failed delivery attempts, weather, public holidays, customs, payment verification, or events outside reasonable control.",
      },
      {
        title: "Refunds, Returns, And Cancellations",
        body:
          "Refunds, returns, exchanges, and cancellations are handled according to the Refund And Return Policy. Because fragrance is a personal-care product, opened, used, sprayed, damaged, or tampered items are generally not accepted for return unless the issue is caused by TARA or the item is defective on arrival.",
      },
      {
        title: "Intellectual Property",
        body:
          "The TARA name, logo, wordmark, scent names, imagery, copy, design direction, product stories, and website content belong to TARA or its licensors. They may not be copied, reused, resold, modified, or presented as another brand without written permission.",
      },
      {
        title: "Limitation Of Liability",
        body:
          "To the fullest extent permitted by Malaysian law, TARA is not liable for indirect, incidental, special, or consequential loss arising from website use, delays, interrupted checkout, subjective scent preference, or misuse of products. Nothing in these terms excludes rights that cannot be excluded under applicable law.",
      },
      {
        title: "Governing Law",
        body:
          "These terms are governed by the laws of Malaysia. Any dispute should first be raised directly with TARA so the house can attempt a practical resolution before formal escalation.",
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund And Return Policy",
    eyebrow: "Refunds",
    description:
      "How TARA handles cancellations, damaged parcels, incorrect items, defective products, hygiene-based fragrance returns, and approved refunds.",
    lastUpdated,
    intro:
      "Fragrance is intimate and personal, so the policy balances customer care with product safety. If something arrives wrong, damaged, or defective, TARA will make it right with a calm, documented process.",
    primaryCta: { label: "Start A Support Request", href: "/contact", variant: "primary" },
    secondaryCta: { label: "WhatsApp Concierge", href: "/contact", variant: "secondary" },
    sections: [
      {
        title: "Quick Position",
        items: [
          "Opened, used, sprayed, tampered, or damaged fragrance products are not returnable for hygiene and product integrity reasons unless confirmed defective or incorrect by TARA.",
          "Damaged, defective, missing, or wrong items must be reported within 48 hours of delivery.",
          "Approved refunds are processed to the original payment method where possible or through another agreed method.",
          "Shipping fees are refunded only when the issue is caused by TARA or the courier damage is accepted under the support process.",
        ],
      },
      {
        title: "Cancellations Before Dispatch",
        body:
          "A preorder or order may be cancelled before packing or dispatch if TARA has not already allocated, prepared, or handed the parcel to the courier. Once dispatch begins, the order moves under the return and delivery rules below.",
      },
      {
        title: "Damaged, Defective, Or Incorrect Items",
        items: [
          "Contact TARA within 48 hours of delivery.",
          "Provide order details, delivery date, clear photos of the outer parcel, inner packaging, bottle, label, damage, and any leakage.",
          "Keep all packaging until TARA confirms the next step.",
          "If the issue is approved, TARA may offer a replacement, exchange, store credit, refund, or another practical resolution depending on stock and courier findings.",
        ],
      },
      {
        title: "Change Of Mind And Scent Preference",
        body:
          "Fragrance reacts differently on each wearer. TARA cannot accept returns or refunds for change of mind, subjective scent preference, scent longevity expectation, or personal sensitivity after a product has been opened, sprayed, or used. Customers unsure of their match should choose the 3 x 8mL promo set first while available.",
      },
      {
        title: "8mL Promo Set",
        body:
          "The 3 x 8mL promo set is designed to help customers compare TARA scents before buying a full bottle. Once dispatched, 8mL promo sets are not refundable for scent preference or change of mind. If the set arrives damaged, missing, or incorrect, report it within 48 hours with photos.",
      },
      {
        title: "Allergy Or Sensitivity",
        body:
          "Customers should review product information and test fragrance carefully before regular wear. Stop using a fragrance if irritation occurs. TARA does not provide medical advice and cannot guarantee suitability for every skin type. Returns for sensitivity are reviewed only where the item is unopened or where a verified product defect is involved.",
      },
      {
        title: "Return Condition",
        items: [
          "Items approved for return must be sent back in the condition requested by TARA.",
          "Original packaging, bottle, cap, seal, inserts, and outer parcel evidence may be required.",
          "TARA may reject returns that are incomplete, altered, used beyond inspection, damaged after delivery, or sent without approval.",
        ],
      },
      {
        title: "Refund Timing",
        body:
          "Approved refunds are processed after TARA confirms eligibility and, where required, receives the returned item or courier evidence. Bank, card, FPX, e-wallet, and payment provider timelines may vary and are outside TARA's direct control.",
      },
      {
        title: "How To Request Help",
        body:
          `Email ${legalEmail} or WhatsApp ${legalWhatsApp} with your name, order reference, product, delivery date, issue summary, and photos where relevant.`,
      },
    ],
  },
  {
    slug: "shipping-policy",
    title: "Shipping And Delivery Policy",
    eyebrow: "Shipping",
    description:
      "Delivery coverage, processing times, preorder dispatch expectations, address rules, courier delays, and customer responsibilities for TARA orders.",
    lastUpdated,
    intro:
      "TARA ships with a personal confirmation mindset: the house verifies the order, prepares the parcel carefully, and keeps customers informed when preorder or courier timing needs attention.",
    primaryCta: { label: "Preorder Now", href: "/preorder", variant: "primary" },
    secondaryCta: { label: "Ask About Delivery", href: "/contact", variant: "secondary" },
    sections: [
      {
        title: "Delivery Coverage",
        body:
          "TARA primarily serves customers in Malaysia. International delivery is not standard at launch and may be arranged only through direct concierge confirmation when available.",
      },
      {
        title: "Processing Time",
        items: [
          "In-stock orders are usually prepared within 1 to 3 working days after payment confirmation.",
          "Preorders ship according to launch allocation, stock arrival, and final house confirmation.",
          "Orders placed on weekends, public holidays, or during campaign peaks may require additional processing time.",
        ],
      },
      {
        title: "Estimated Delivery Time",
        items: [
          "West Malaysia: usually 2 to 5 working days after dispatch.",
          "East Malaysia: usually 4 to 8 working days after dispatch.",
          "Remote areas, courier restrictions, weather, public holidays, and high-volume periods may take longer.",
        ],
      },
      {
        title: "Shipping Fees",
        body:
          "Shipping fees, free-shipping offers, courier choices, or delivery surcharges will be shown at checkout or confirmed by the concierge before payment where manual ordering is used.",
      },
      {
        title: "Address Accuracy",
        items: [
          "Customers are responsible for providing complete and accurate delivery details, including name, phone number, address, postcode, city, state, and any delivery instructions.",
          "Address changes can only be requested before packing or dispatch.",
          "TARA is not responsible for failed delivery caused by incomplete, outdated, or incorrect customer details.",
        ],
      },
      {
        title: "Tracking And Courier Updates",
        body:
          "Where tracking is available, TARA or the courier will provide tracking details after dispatch. Courier tracking may take time to activate after a parcel is handed over.",
      },
      {
        title: "Failed Delivery Or Returned Parcels",
        body:
          "If a parcel is returned because of an incorrect address, unreachable recipient, failed delivery attempts, or refusal to accept delivery, TARA may charge a reshipping fee before sending the parcel again.",
      },
      {
        title: "Damaged Parcels",
        body:
          "If a parcel arrives visibly damaged, photograph the outer parcel before opening where possible. Report damaged, leaking, missing, or incorrect items within 48 hours of delivery so TARA can investigate with the courier and arrange the next step.",
      },
      {
        title: "Preorder Communication",
        body:
          "Preorder customers will receive confirmation through the contact method provided. If launch timing changes because of production, packaging, courier, or operational reasons, TARA will update affected customers as soon as reasonably possible.",
      },
    ],
  },
] satisfies PolicyPageContent[];

export function getPolicyPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
