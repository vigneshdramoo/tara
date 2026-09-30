import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(site, "../Content Library/Scents/KAMEIRA/Images");
const output = path.join(site, "public/scents/kameira");
const assets = [
  ["KAMEIRA Mobile Editorial Banner.png", "kameira-editorial-mobile"],
  ["KAMEIRA_Primary hero packshot.png", "kameira-50ml-hero"],
  ["KAMEIRA Clean Alternate Angle.png", "kameira-50ml-angle"],
  ["KAMEIRA Label : Detail Macro.png", "kameira-label-detail"],
  ["KAMEIRA Fragrance-World Image.png", "kameira-fragrance-world"],
  ["KAMEIRA 8 ml Travel Size.png", "kameira-8ml"],
  ["KAMEIRA 50 ml + 8 ml Scale Comparison.png", "kameira-50ml-8ml-scale"],
  ["KAMEIRA In-Hand : Scale Shot.png", "kameira-in-hand"],
  ["KAMEIRA Wide Editorial Banner.png", "kameira-editorial-wide"],
];
await fs.mkdir(output, { recursive: true });
const manifest = [];
for (const [filename, stem] of assets) {
  const input = path.join(source, filename);
  const { width, height } = await sharp(input).metadata();
  const widths = [...new Set([320, 640, 960, width].filter((w) => w <= width))];
  await sharp(input)
    .webp({ quality: 88, effort: 6 })
    .toFile(path.join(output, `${stem}.webp`));
  for (const size of widths) {
    await sharp(input)
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 88, effort: 6 })
      .toFile(path.join(output, `${stem}-${size}.webp`));
  }
  manifest.push({
    source: filename,
    src: `/scents/kameira/${stem}.webp`,
    width,
    height,
    widths,
  });
}
await fs.writeFile(
  path.join(output, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(manifest);
