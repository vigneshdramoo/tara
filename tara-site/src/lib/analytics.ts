export type AnalyticsValue = string | number | boolean | undefined;
type GtagCommand =
  | ["event", AnalyticsEventName, Record<string, AnalyticsValue>]
  | ["config", string, Record<string, AnalyticsValue>]
  | ["js", Date]
  | ["consent", string, Record<string, string>];

export const analyticsEvents = {
  pageView: "page_view",
  ctaClick: "cta_click",
  heroPrimaryCtaClick: "hero_primary_cta_click",
  discoverySetClick: "discovery_set_click",
  discoverySetView: "discovery_set_view",
  discoverySetSelectionStarted: "discovery_set_selection_started",
  discoverySetScentSelected: "discovery_set_scent_selected",
  discoverySetScentDeselected: "discovery_set_scent_deselected",
  discoverySetSelectionCompleted: "discovery_set_selection_completed",
  discoverySetAddToCart: "discovery_set_add_to_cart",
  formStart: "form_start",
  quizStart: "quiz_start",
  scentSelect: "scent_select",
  paymentCheckoutStart: "payment_checkout_start",
  checkoutStart: "checkout_start",
  paymentRedirect: "payment_redirect",
  paymentSuccess: "payment_success",
  paymentStatusView: "payment_status_view",
  preorderSuccessView: "preorder_success_view",
  preorderSubmit: "preorder_submit",
  manualPreorderStart: "manual_preorder_start",
  manualPreorderSubmit: "manual_preorder_submit",
  whatsappClick: "whatsapp_click",
  conciergeClick: "concierge_click",
  quizComplete: "quiz_complete",
  quizResultRevealed: "quiz_result_revealed",
  quizResultProductClick: "quiz_result_product_click",
  quizLeadSubmit: "quiz_lead_submit",
  contactSubmit: "contact_submit",
  newsletterSignup: "newsletter_signup",
  emailSignup: "email_signup",
  productAddToCart: "product_add_to_cart",
  scentMoodSelected: "scent_mood_selected",
  scentFilterUsed: "scent_filter_used",
  scentSortUsed: "scent_sort_used",
  productQuickViewOpened: "product_quick_view_opened",
  productCompareAdded: "product_compare_added",
  productCompareRemoved: "product_compare_removed",
  sampleScentSelected: "sample_scent_selected",
  sampleScentRemoved: "sample_scent_removed",
  sampleSetAddedToCart: "sample_set_added_to_cart",
  sampleSetCtaClicked: "sample_set_cta_clicked",
  product50mlAddedToCart: "product_50ml_added_to_cart",
  stickyCtaClicked: "sticky_cta_clicked",
  catalogueFilterOpened: "catalogue_filter_opened",
  catalogueFilterApplied: "catalogue_filter_applied",
  catalogueSortChanged: "catalogue_sort_changed",
  productQuickViewCtaClicked: "product_quick_view_cta_clicked",
  productSampleCtaClicked: "product_sample_cta_clicked",
  stickySampleCtaClicked: "sticky_sample_cta_clicked",
  cartView: "cart_view",
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

function sanitizeUrlForAnalytics(url: string) {
  if (isWhatsAppUrl(url)) {
    return url.split("?")[0];
  }

  return url;
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
    eventName?: AnalyticsEventName;
    linkLabel?: string;
    linkLocation?: string;
    linkUrl: string;
    linkType?: string;
  } & Record<string, AnalyticsValue>,
) {
  const {
    eventName,
    linkLabel,
    linkLocation,
    linkUrl,
    linkType,
    ...customParams
  } = params;

  trackEvent(eventName ?? analyticsEvents.ctaClick, {
    event_category: "engagement",
    link_label: linkLabel,
    link_location: linkLocation,
    link_url: sanitizeUrlForAnalytics(linkUrl),
    link_type: linkType,
    ...getCurrentPageParams(),
    ...customParams,
  });
}

export function trackFormStart(params: {
  formName: string;
  formLocation?: string;
}) {
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

export function trackWhatsAppClick(params: {
  linkLabel?: string;
  linkLocation?: string;
  linkUrl: string;
}) {
  const eventParams = {
    event_category: "engagement",
    link_label: params.linkLabel,
    link_location: params.linkLocation,
    link_url: sanitizeUrlForAnalytics(params.linkUrl),
    ...getCurrentPageParams(),
  };

  trackEvent(analyticsEvents.whatsappClick, eventParams);
  trackEvent(analyticsEvents.conciergeClick, eventParams);
}
