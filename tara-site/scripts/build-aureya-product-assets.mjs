import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(site, "../Content Library/Scents/AUREYA/Images");
const output = path.join(site, "public/scents/aureya");
const assets = [
  ["AUREYA Mobile Editorial Banner.png", "aureya-editorial-mobile"],
  ["AUREYA_Primary hero packshot.png", "aureya-50ml-hero"],
  ["AUREYA_Clean Alternate Angle.png", "aureya-50ml-angle"],
  ["AUREYA Label : Detail Macro.png", "aureya-label-detail"],
  ["AUREYA Fragrance-World Image.png", "aureya-fragrance-world"],
  ["AUREYA 8 ml Travel Size.png", "aureya-8ml"],
  ["AUREYA 50 ml + 8 ml Scale Comparison.png", "aureya-50ml-8ml-scale"],
  ["AUREYA In-Hand : Scale Shot.png", "aureya-in-hand"],
  ["AUREYA Wide Editorial Banner.png", "aureya-editorial-wide"],
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
    src: `/scents/aureya/${stem}.webp`,
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
