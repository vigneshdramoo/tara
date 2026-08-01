const metricoolHash =
  process.env.NEXT_PUBLIC_METRICOOL_HASH ?? "2c19ac38152a09d912e40e7278562f5a";

export function MetricoolTrackerHead() {
  if (!metricoolHash) {
    return null;
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
  function loadScript(callback) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://tracker.metricool.com/resources/be.js";
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
  }

  loadScript(function() {
    beTracker.t({ hash: "${metricoolHash}" });
  });
`,
      }}
    />
  );
}
