import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(site, "../Content Library/Scents/ASHOKA/Images");
const output = path.join(site, "public/scents/ashoka");
const assets = [
  ["ASHOKA Mobile Editorial Banner.png", "ashoka-editorial-mobile"],
  ["ASHOKA_Primary hero packshot.png", "ashoka-50ml-hero"],
  ["ASHOKA Clean Alternate Angle.png", "ashoka-50ml-angle"],
  ["ASHOKA Label Detail Macro.png", "ashoka-label-detail"],
  ["ASHOKA Architectural Product Portrait.png", "ashoka-architectural"],
  ["ASHOKA Fragrance-World Image.png", "ashoka-fragrance-world"],
  ["ASHOKA 8 ml Travel Size.png", "ashoka-8ml"],
  ["ASHOKA 50 ml + 8 ml Scale Comparison.png", "ashoka-50ml-8ml-scale"],
  ["ASHOKA In-Hand Scale Shot.png", "ashoka-in-hand"],
  ["ASHOKA Wide Editorial Banner.png", "ashoka-editorial-wide"],
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
    src: `/scents/ashoka/${stem}.webp`,
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
