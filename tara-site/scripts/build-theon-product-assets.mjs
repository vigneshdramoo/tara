import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(site, "../Content Library/Scents/THEON/Images");
const output = path.join(site, "public/scents/theon");
const assets = [
  ["THEON Mobile Editorial Banner.png", "theon-editorial-mobile"],
  ["THEON_Primary hero packshot.png", "theon-50ml-hero"],
  ["THEON Clean Alternate Angle.png", "theon-50ml-angle"],
  ["THEON Label Detail Macro.png", "theon-label-detail"],
  ["THEON Fragrance-World Image.png", "theon-fragrance-world"],
  ["THEON 8 ml Travel Size.png", "theon-8ml"],
  ["THEON 50 ml + 8 ml Scale Comparison.png", "theon-50ml-8ml-scale"],
  ["THEON In-Hand Scale Shot.png", "theon-in-hand"],
  ["THEON Wide Editorial Banner.png", "theon-editorial-wide"],
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
    src: `/scents/theon/${stem}.webp`,
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
