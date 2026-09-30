import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(site, "../Content Library/Scents/MARIS/Images");
const output = path.join(site, "public/scents/maris");
const assets = [
  ["MARIS Mobile Editorial Banner.png", "maris-editorial-mobile"],
  ["MARIS_Primary hero packshot.png", "maris-50ml-hero"],
  ["MARIS Clean Alternate Angle.png", "maris-50ml-angle"],
  ["MARIS Label Detail Macro.png", "maris-label-detail"],
  ["MARIS Fragrance-World Image.png", "maris-fragrance-world"],
  ["MARIS 8 ml Travel Size.png", "maris-8ml"],
  ["MARIS 50 ml + 8 ml Scale Comparison.png", "maris-50ml-8ml-scale"],
  ["MARIS In-Hand Scale Shot.png", "maris-in-hand"],
  ["MARIS Wide Editorial Banner.png", "maris-editorial-wide"],
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
  for (const size of widths) {
    await sharp(input)
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 88, effort: 6 })
      .toFile(path.join(output, `${stem}-${size}.webp`));
  }
  manifest.push({
    source: filename,
    src: `/scents/maris/${stem}.webp`,
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
