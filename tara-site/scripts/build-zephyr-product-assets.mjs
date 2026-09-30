import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(site, "../Content Library/Scents/ZEPHYR/Images");
const output = path.join(site, "public/scents/zephyr");
const assets = [
  ["ZEPHYR Mobile Editorial Banner.png", "zephyr-editorial-mobile"],
  ["ZEPHYR_Primary hero packshot.png", "zephyr-50ml-hero"],
  ["ZEPHYR Clean Alternate Angle.png", "zephyr-50ml-angle"],
  ["ZEPHYR Label Detail Macro.png", "zephyr-label-detail"],
  ["ZEPHYR Fragrance-World Image.png", "zephyr-fragrance-world"],
  ["ZEPHYR 8 ml Travel Size.png", "zephyr-8ml"],
  ["ZEPHYR 50 ml + 8 ml Scale Comparison.png", "zephyr-50ml-8ml-scale"],
  ["ZEPHYR In-Hand Scale Shot.png", "zephyr-in-hand"],
  ["ZEPHYR Wide Editorial Banner.png", "zephyr-editorial-wide"],
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
    src: `/scents/zephyr/${stem}.webp`,
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
