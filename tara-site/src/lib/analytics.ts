export type AnalyticsValue = string | number | boolean | undefined;
type GtagCommand =
  | ["event", AnalyticsEventName, Record<string, AnalyticsValue>]
  | ["config", string, Record<string, AnalyticsValue>]
  | ["js", Date]
  | ["consent", string, Record<string, string>];

export const analyticsEvents = {
  pageView: "page_view",
  ctaClick: "cta_click",
  formStart: "form_start",
  quizStart: "quiz_start",
  scentSelect: "scent_select",
  paymentCheckoutStart: "payment_checkout_start",
  paymentSuccess: "payment_success",
  paymentStatusView: "payment_status_view",
  preorderSuccessView: "preorder_success_view",
  preorderSubmit: "preorder_submit",
  whatsappClick: "whatsapp_click",
  quizComplete: "quiz_complete",
  quizLeadSubmit: "quiz_lead_submit",
  contactSubmit: "contact_submit",
  newsletterSignup: "newsletter_signup",
  hiringSubmit: "hiring_submit",
} as const;

export type AnalyticsEventName =
  (typeof analyticsEvents)[keyof typeof analyticsEvents] | (string & {});

declare global {
  interface Window {
    dataLayer?: Array<GtagCommand | Record<string, AnalyticsValue>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: AnalyticsEventName,
  params: Record<string, AnalyticsValue> = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: eventName, ...params });
  window.dispatchEvent(
    new CustomEvent("tara:analytics", {
      detail: {
        event: eventName,
        params,
      },
    }),
  );

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

function getCurrentPageParams() {
  if (typeof window === "undefined") {
    return {};
  }

  return {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
  };
}

export function trackPageView(url: string) {
  if (typeof window === "undefined") {
    return;
  }

  const pagePath = new URL(url).pathname;

  trackEvent(analyticsEvents.pageView, {
    page_title: document.title,
    page_location: url,
    page_path: pagePath,
  });
}

export function trackCtaClick(
  params: {
    linkLabel?: string;
    linkLocation?: string;
    linkUrl: string;
    linkType?: string;
  } & Record<string, AnalyticsValue>,
) {
  trackEvent(analyticsEvents.ctaClick, {
    event_category: "engagement",
    link_label: params.linkLabel,
    link_location: params.linkLocation,
    link_url: params.linkUrl,
    link_type: params.linkType,
    ...getCurrentPageParams(),
  });
}

export function trackFormStart(
  params: {
    formName: string;
    formLocation?: string;
  },
) {
  trackEvent(analyticsEvents.formStart, {
    event_category: "lead",
    form_name: params.formName,
    form_location: params.formLocation,
    ...getCurrentPageParams(),
  });
}

export function isWhatsAppUrl(href: string) {
  return href.includes("wa.me/") || href.includes("whatsapp.com/");
}

export function trackWhatsAppClick(
  params: {
    linkLabel?: string;
    linkLocation?: string;
    linkUrl: string;
  },
) {
  trackEvent(analyticsEvents.whatsappClick, {
    event_category: "engagement",
    link_label: params.linkLabel,
    link_location: params.linkLocation,
    link_url: params.linkUrl,
  });
}
