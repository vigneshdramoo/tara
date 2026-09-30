import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(site, "../Content Library/Scents/ELIORA/Images");
const output = path.join(site, "public/scents/eliora");
const assets = [
  ["ELIORA Mobile Editorial Banner.png", "eliora-editorial-mobile"],
  ["ELIORA_Primary hero packshot.png", "eliora-50ml-hero"],
  ["ELIORA Clean Alternate Angle.png", "eliora-50ml-angle"],
  ["ELIORA Label Detail Macro.png", "eliora-label-detail"],
  ["ELIORA Fragrance-World Image.png", "eliora-fragrance-world"],
  ["ELIORA 8 ml Travel Size.png", "eliora-8ml"],
  ["ELIORA 50 ml + 8 ml Scale Comparison.png", "eliora-50ml-8ml-scale"],
  ["ELIORA In-Hand Scale Shot.png", "eliora-in-hand"],
  ["ELIORA Wide Editorial Banner.png", "eliora-editorial-wide"],
];
await fs.mkdir(output, { recursive: true });
const manifest = [];
for (const [filename, stem] of assets) {
  const input = path.join(source, filename);
  const { width, height } = await sharp(input).metadata();
  const widths = [
    ...new Set([320, 640, 960, width].filter((value) => value <= width)),
  ];
  await sharp(input)
    .webp({ quality: 88, effort: 6 })
    .toFile(path.join(output, `${stem}.webp`));
  for (const size of widths)
    await sharp(input)
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 88, effort: 6 })
      .toFile(path.join(output, `${stem}-${size}.webp`));
  manifest.push({
    source: filename,
    src: `/scents/eliora/${stem}.webp`,
    width,
    height,
    widths,
  });
}
await fs.writeFile(
  path.join(output, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(manifest);
