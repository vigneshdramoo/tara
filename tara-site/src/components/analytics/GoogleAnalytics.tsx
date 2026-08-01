import { RouteAnalytics } from "@/components/analytics/RouteAnalytics";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-NMH4BCHS";

export function GoogleAnalyticsHead() {
  if (!measurementId || gtmId) {
    return null;
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${measurementId}');
`,
        }}
      />
    </>
  );
}

export function GoogleAnalytics() {
  if (!measurementId && !gtmId) {
    return null;
  }

  return (
    <>
      <RouteAnalytics measurementId={measurementId ?? gtmId} />
    </>
  );
}
