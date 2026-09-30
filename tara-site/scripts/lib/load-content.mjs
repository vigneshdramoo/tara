import ts from "typescript";
import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
export function loadContent(entry, cache = new Map()) {
  const filename = path.resolve(root, entry);
  if (cache.has(filename)) return cache.get(filename).exports;
  const contentModule = { exports: {} };
  cache.set(filename, contentModule);
  const code = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const requireContent = (specifier) => {
    if (!specifier.startsWith("@/content/"))
      throw new Error(`Unexpected content import: ${specifier}`);
    return loadContent(`src/${specifier.slice(2)}.ts`, cache);
  };
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, {
    filename,
  })(requireContent, contentModule, contentModule.exports);
  return contentModule.exports;
}
export function buildCheckoutCatalog() {
  const { checkoutProducts } = loadContent("src/content/products.ts");
  const { scents } = loadContent("src/content/scents.ts");
  return {
    products: Object.fromEntries(
      checkoutProducts.map(({ slug, name, priceInSen }) => [
        slug,
        { name, priceInSen },
      ]),
    ),
    eligibleScents: Object.fromEntries(
      scents
        .filter(
          (scent) =>
            scent.status === "available" && scent.profile.sampleAvailable,
        )
        .map(({ slug, name }) => [slug, { name }]),
    ),
  };
}
