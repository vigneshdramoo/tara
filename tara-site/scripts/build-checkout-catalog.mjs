import { writeFileSync } from "node:fs";
import { buildCheckoutCatalog } from "./lib/load-content.mjs";
writeFileSync(
  new URL(
    "../netlify/functions/lib/generated-checkout-catalog.mjs",
    import.meta.url,
  ),
  `// Generated from src/content by npm run prebuild. Do not edit.\nconst catalogue = ${JSON.stringify(buildCheckoutCatalog(), null, 2)};\nexport default catalogue;\n`,
);
console.log(
  "Generated authoritative checkout and discovery eligibility catalogue.",
);
