import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(site, "../Content Library/Scents/ARDOR/Images");
const output = path.join(site, "public/scents/ardor");
const assets = [
  ["ARDOR Mobile Editorial Banner.png", "ardor-editorial-mobile"],
  ["ARDOR_Primary hero packshot.png", "ardor-50ml-hero"],
  ["ARDOR Clean Alternate Angle.png", "ardor-50ml-angle"],
  ["ARDOR Label Detail Macro.png", "ardor-label-detail"],
  ["ARDOR Fragrance-World Image.png", "ardor-fragrance-world"],
  ["ARDOR 8 ml Travel Size.png", "ardor-8ml"],
  ["ARDOR 50 ml + 8 ml Scale Comparison.png", "ardor-50ml-8ml-scale"],
  ["ARDOR In-Hand Scale Shot.png", "ardor-in-hand"],
  ["ARDOR Wide Editorial Banner.png", "ardor-editorial-wide"],
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
    src: `/scents/ardor/${stem}.webp`,
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
