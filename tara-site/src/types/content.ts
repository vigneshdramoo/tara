export type LinkItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "instagram" | "whatsapp";
};

export type Cta = LinkItem & {
  variant?: "primary" | "secondary" | "ghost";
};

export type Metric = {
  label: string;
  value: string;
  description: string;
  badges?: string[];
};

export type VisualAsset = {
  src: string;
  alt: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  position?: string;
};

export type ScentGalleryAsset = VisualAsset & {
  title: string;
  caption: string;
};

export type SectionIntro = {
  eyebrow?: string;
  title: string;
  body: string;
  note?: string;
};

export type StoryContent = {
  title: string;
  lead: string;
  paragraphs: string[];
  quote: string;
  highlights: string[];
  visual: VisualAsset;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  body: string;
  note: string;
  ctas: Cta[];
  metrics: Metric[];
  visual: VisualAsset;
};

export type CalloutContent = {
  title: string;
  body: string;
  primary: Cta;
  secondary?: Cta;
  note?: string;
};

export type TrustSignal = {
  title: string;
  body: string;
  icon: "shield" | "lock" | "spark" | "heart";
};

export type PaymentMethod = {
  label: string;
  kind: "visa" | "mastercard" | "paypal" | "tng" | "ssl";
};

export type QuizOption = {
  value: string;
  label: string;
  detail: string;
  weights: Record<string, number>;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export type ContactMethod = {
  label: string;
  value: string;
  href?: string;
  icon?: "mail" | "phone" | "wallet" | "shield" | "instagram" | "whatsapp";
};

export type BrandContent = {
  name: string;
  tagline: string;
  description: string;
  contactEmail: string;
  navigation: LinkItem[];
  footerLinks: LinkItem[];
  whatsappUrl: string;
  instagramUrl: string;
  socialLinks: SocialLink[];
  newsletter: {
    title: string;
    body: string;
  };
  home: {
    hero: HeroContent;
    story: StoryContent;
    trust: SectionIntro & {
      guarantee: string;
      signals: TrustSignal[];
      payments: PaymentMethod[];
    };
    eightMlPromo: CalloutContent;
    preorder: CalloutContent;
  };
  quizPage: SectionIntro & {
    intro: string;
    encouragement: string;
    questions: QuizQuestion[];
  };
  preorderPage: SectionIntro & {
    perks: string[];
    steps: string[];
    contactOptions: ContactMethod[];
    paymentLine: string;
    confirmation: SectionIntro & {
      steps: string[];
    };
  };
  contactPage: SectionIntro & {
    details: ContactMethod[];
  };
};

export type Scent = {
  slug: string;
  name: string;
  audience: string;
  status: "available" | "upcoming" | "exclusive";
  isNew?: boolean;
  tagline: string;
  line: string;
  summary: string;
  story: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  mood: string[];
  wear: string[];
  finish: string;
  character: string;
  quote: string;
  storyLead?: string;
  storyMantra?: string;
  storyArc?: {
    label: string;
    title: string;
    body: string;
  }[];
  size: string;
  price?: string;
  regularPrice?: string;
  launchPrice?: string;
  priceInSen?: number;
  launch: string;
  action?: {
    label: string;
    body: string;
    primary: Cta;
    secondary?: Cta;
  };
  visual: VisualAsset;
  homeVisual?: VisualAsset;
  gallery?: ScentGalleryAsset[];
};
