import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, "..");
const workspaceDir = path.resolve(siteDir, "..");
const sourceDir = path.join(
  workspaceDir,
  "Content Library/Scents/AUREYA/Images/Shopee Assets/Gemini",
);
const carouselDir = path.join(
  workspaceDir,
  "Content Library/Scents/AUREYA/Images/Shopee Assets/Carousel",
);
const publicDir = path.join(siteDir, "public/scents/aureya");

const W = 1080;
const H = 1080;

const colors = {
  ivory: "#F7F3EB",
  ivorySoft: "#FFF9EF",
  onyx: "#0A0A0A",
  copy: "#221B14",
  gold: "#CA9E5B",
  amber: "#C88E4D",
  blush: "#F3C7BD",
  champagne: "#EFE1C9",
};

const sources = {
  hero: path.join(sourceDir, "1-AUREYA-Hero.jpg"),
  mood: path.join(sourceDir, "2-AUREYA-Lifestyle:Mood.jpg"),
  texture: path.join(sourceDir, "3-AUREYA-Texture:Ingredient Close-up.jpg"),
  size: path.join(sourceDir, "4-AUREYA-Size Comparison.jpg"),
  notes: path.join(sourceDir, "AUREYA-Notes Pyramid.png"),
};

const siteImages = [
  ["aureya-carousel-01-hero.webp", sources.hero],
  ["aureya-carousel-02-mood.webp", sources.mood],
  ["aureya-carousel-03-texture.webp", sources.texture],
  ["aureya-carousel-04-size-comparison.webp", sources.size],
  ["aureya-carousel-05-notes-pyramid.webp", sources.notes],
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "image/png";
}

async function imageData(file) {
  return `data:${mime(file)};base64,${(await fs.readFile(file)).toString("base64")}`;
}

function text(x, y, value, size, options = {}) {
  const {
    fill = colors.copy,
    family = "Avenir Next, Helvetica Neue, Arial, sans-serif",
    weight = 500,
    anchor = "start",
    spacing = 0,
    opacity = 1,
  } = options;

  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${spacing}" opacity="${opacity}">${esc(value)}</text>`;
}

function lineText(x, y, lines, size, leading, options = {}) {
  return lines
    .map((line, index) => text(x, y + index * leading, line, size, options))
    .join("");
}

function serif(x, y, value, size, options = {}) {
  return text(x, y, value, size, {
    ...options,
    family: "Didot, Bodoni 72, Cormorant Garamond, Georgia, serif",
    weight: options.weight ?? 400,
  });
}

function defs() {
  return `
    <defs>
      <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${colors.ivorySoft}"/>
        <stop offset="58%" stop-color="${colors.ivory}"/>
        <stop offset="100%" stop-color="${colors.champagne}"/>
      </linearGradient>
      <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${colors.gold}" stop-opacity="0"/>
        <stop offset="52%" stop-color="${colors.gold}" stop-opacity="0.92"/>
        <stop offset="100%" stop-color="${colors.gold}" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="glow" cx="24%" cy="12%" r="70%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.86"/>
        <stop offset="44%" stop-color="#FFF1DA" stop-opacity="0.42"/>
        <stop offset="100%" stop-color="${colors.ivory}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="leftWash" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${colors.ivory}" stop-opacity="0.9"/>
        <stop offset="46%" stop-color="${colors.ivory}" stop-opacity="0.78"/>
        <stop offset="76%" stop-color="${colors.ivory}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="${colors.ivory}" stop-opacity="0"/>
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="24" stdDeviation="20" flood-color="#8A5630" flood-opacity="0.18"/>
      </filter>
    </defs>`;
}

function baseFrame(number, dark = false) {
  const stroke = dark ? "rgba(247,243,235,0.58)" : "rgba(202,158,91,0.68)";
  const copy = dark ? colors.ivory : colors.gold;

  return `
    <rect x="36" y="36" width="${W - 72}" height="${H - 72}" fill="none" stroke="${stroke}" stroke-width="1.4"/>
    <path d="M36 118 C58 74 82 58 126 44" fill="none" stroke="${stroke}" stroke-width="1.2"/>
    <path d="M1044 962 C1022 1006 994 1024 948 1036" fill="none" stroke="${stroke}" stroke-width="1.2"/>
    ${text(540, 76, `0${number}/05`, 16, {
      fill: copy,
      anchor: "middle",
      weight: 700,
      spacing: 5,
    })}
  `;
}

function brandTop(y = 118, dark = false) {
  const copy = dark ? colors.ivory : colors.gold;
  return `
    <line x1="250" y1="${y}" x2="430" y2="${y}" stroke="${copy}" stroke-opacity="0.44" stroke-width="1"/>
    ${text(540, y + 10, "TARA", 31, {
      fill: copy,
      anchor: "middle",
      spacing: 14,
      weight: 500,
    })}
    <line x1="650" y1="${y}" x2="830" y2="${y}" stroke="${copy}" stroke-opacity="0.44" stroke-width="1"/>
  `;
}

function pill(x, y, label, value, width = 292) {
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${width}" height="88" rx="44" fill="${colors.ivory}" fill-opacity="0.82" stroke="${colors.gold}" stroke-opacity="0.5"/>
      ${text(width / 2, 34, label, 13, {
        fill: colors.gold,
        anchor: "middle",
        weight: 800,
        spacing: 3,
      })}
      ${text(width / 2, 63, value, 22, {
        fill: colors.onyx,
        anchor: "middle",
        weight: 700,
      })}
    </g>`;
}

function overlayCard(x, y, width, height, dark = false) {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="34" fill="${dark ? colors.onyx : colors.ivory}" fill-opacity="${dark ? 0.82 : 0.84}" stroke="${colors.gold}" stroke-opacity="0.46"/>
  `;
}

function slide1(data) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${defs()}
    <rect width="${W}" height="${H}" fill="url(#paper)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <image href="${data.hero}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>
    <rect width="${W}" height="${H}" fill="url(#paper)" opacity="0.18"/>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#leftWash)"/>
    <rect x="0" y="0" width="${W}" height="${H}" fill="none"/>
    ${baseFrame(1)}
    ${brandTop(114)}
    ${text(88, 230, "AUREYA", 21, {
      fill: colors.gold,
      weight: 800,
      spacing: 7,
    })}
    ${lineText(88, 366, ["Dawn", "of radiance."], 106, 98, {
      fill: colors.onyx,
      family: "Didot, Bodoni 72, Cormorant Garamond, Georgia, serif",
      weight: 400,
    })}
    <line x1="92" y1="604" x2="414" y2="604" stroke="url(#goldLine)" stroke-width="2"/>
    ${text(90, 670, "Pear brightness, jasmine silk,", 32, {
      fill: colors.copy,
      weight: 500,
    })}
    ${text(90, 715, "and golden amber warmth.", 32, {
      fill: colors.copy,
      weight: 500,
    })}
    ${pill(88, 804, "LAUNCH", "RM169")}
    ${pill(394, 804, "REGULAR", "RM239")}
    ${text(540, 1008, "50ML EAU DE PARFUM", 18, {
      fill: colors.gold,
      anchor: "middle",
      weight: 800,
      spacing: 5,
    })}
  </svg>`;
}

function slide2(data) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${defs()}
    <image href="${data.mood}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>
    <rect width="${W}" height="${H}" fill="url(#paper)" opacity="0.16"/>
    <rect x="0" y="610" width="${W}" height="470" fill="${colors.ivory}" opacity="0.82"/>
    ${baseFrame(2)}
    ${brandTop(114)}
    ${text(84, 690, "THE FEELING", 18, {
      fill: colors.gold,
      weight: 800,
      spacing: 5,
    })}
    ${lineText(84, 790, ["Soft confidence", "that stays close."], 64, 62, {
      fill: colors.onyx,
      family: "Didot, Bodoni 72, Cormorant Garamond, Georgia, serif",
    })}
    ${text(86, 952, "Aureya moves like first light through linen:", 27, {
      fill: colors.copy,
      weight: 500,
    })}
    ${text(86, 994, "warm, graceful, and quietly remembered.", 27, {
      fill: colors.copy,
      weight: 500,
    })}
  </svg>`;
}

function slide3(data) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${defs()}
    <rect width="${W}" height="${H}" fill="url(#paper)"/>
    <image href="${data.notes}" x="90" y="112" width="900" height="900" preserveAspectRatio="xMidYMid meet" filter="url(#softShadow)"/>
    <rect x="36" y="36" width="${W - 72}" height="${H - 72}" fill="none" stroke="${colors.gold}" stroke-opacity="0.68" stroke-width="1.4"/>
    ${text(540, 76, "03/05", 16, {
      fill: colors.gold,
      anchor: "middle",
      weight: 700,
      spacing: 5,
    })}
    ${text(540, 1018, "AUREYA NOTES PYRAMID", 17, {
      fill: colors.gold,
      anchor: "middle",
      weight: 800,
      spacing: 5,
    })}
  </svg>`;
}

function slide4(data) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${defs()}
    <image href="${data.size}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>
    <rect width="${W}" height="${H}" fill="${colors.ivory}" opacity="0.14"/>
    <rect x="0" y="0" width="${W}" height="300" fill="${colors.ivory}" opacity="0.82"/>
    <rect x="0" y="812" width="${W}" height="268" fill="${colors.ivory}" opacity="0.86"/>
    ${baseFrame(4)}
    ${brandTop(112)}
    ${text(84, 206, "CHOOSE YOUR RITUAL", 18, {
      fill: colors.gold,
      weight: 800,
      spacing: 5,
    })}
    ${serif(84, 270, "Full bottle or discovery size.", 48, {
      fill: colors.onyx,
    })}
    ${text(84, 904, "50mL for your signature. 8mL to test the glow first.", 29, {
      fill: colors.copy,
      weight: 500,
    })}
    ${pill(84, 946, "FULL BOTTLE", "RM169", 322)}
    ${pill(424, 946, "DISCOVERY SET", "3 x 8mL RM99", 388)}
  </svg>`;
}

function slide5(data) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${defs()}
    <image href="${data.texture}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>
    <rect width="${W}" height="${H}" fill="${colors.onyx}" opacity="0.08"/>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#paper)" opacity="0.2"/>
    ${baseFrame(5)}
    ${overlayCard(74, 610, 932, 342)}
    ${text(540, 704, "READY FOR AUREYA?", 18, {
      fill: colors.gold,
      anchor: "middle",
      weight: 800,
      spacing: 5,
    })}
    ${lineText(540, 788, ["Wear the glow", "before it becomes memory."], 48, 50, {
      fill: colors.onyx,
      family: "Didot, Bodoni 72, Cormorant Garamond, Georgia, serif",
      anchor: "middle",
    })}
    ${text(540, 912, "Shop the 50mL launch bottle or start with the 3 x 8mL RM99 set.", 23, {
      fill: colors.copy,
      anchor: "middle",
      weight: 500,
    })}
    ${text(540, 1008, "TARASCENTS.COM  /  @TARA_SCENTS.MY", 18, {
      fill: colors.gold,
      anchor: "middle",
      weight: 800,
      spacing: 4,
    })}
  </svg>`;
}

const slides = [
  ["AUREYA-carousel-01-hero.jpg", slide1],
  ["AUREYA-carousel-02-mood.jpg", slide2],
  ["AUREYA-carousel-03-notes.jpg", slide3],
  ["AUREYA-carousel-04-sizes.jpg", slide4],
  ["AUREYA-carousel-05-cta.jpg", slide5],
];

async function renderCarousel() {
  await fs.mkdir(carouselDir, { recursive: true });
  const data = {
    hero: await imageData(sources.hero),
    mood: await imageData(sources.mood),
    texture: await imageData(sources.texture),
    size: await imageData(sources.size),
    notes: await imageData(sources.notes),
  };

  const outputs = [];
  for (const [fileName, draw] of slides) {
    const output = path.join(carouselDir, fileName);
    await sharp(Buffer.from(draw(data)))
      .jpeg({ quality: 94, mozjpeg: true })
      .toFile(output);
    outputs.push(output);
  }

  const thumbs = await Promise.all(
    outputs.map((file) => sharp(file).resize(216, 216).toBuffer()),
  );

  await sharp({
    create: {
      width: 216 * outputs.length,
      height: 216,
      channels: 3,
      background: colors.ivory,
    },
  })
    .composite(thumbs.map((input, index) => ({ input, left: index * 216, top: 0 })))
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(path.join(carouselDir, "AUREYA-carousel-preview.jpg"));

  await fs.writeFile(
    path.join(carouselDir, "caption-and-alt-text.md"),
    `# AUREYA Carousel

## Caption
AUREYA: dawn of radiance.

Pear brightness. Jasmine silk. Golden amber warmth.

Choose the 50mL Eau de Parfum as your signature scent, or start with the 3 x 8mL RM99 discovery set before you commit.

Shop at tarascents.com or message @tara_scents.my for scent advice.

#TARAScents #AUREYA #PerfumeMalaysia #FragranceMalaysia #AffordableLuxury #ScentOfTheDay

## Alt Text
1. AUREYA perfume bottle on an ivory silk-inspired background with launch and regular pricing.
2. AUREYA perfume bottle in warm morning light with pear and soft floral styling.
3. AUREYA notes pyramid showing pear, neroli, citrus, jasmine, white petals, white musk, golden amber, and tonka.
4. AUREYA 50mL bottle beside an 8mL discovery vial for size comparison.
5. AUREYA ingredient close-up with jasmine and blush perfume detail, ending with shop and Instagram call to action.
`,
  );

  return outputs;
}

async function renderSiteImages() {
  await fs.mkdir(publicDir, { recursive: true });

  await Promise.all(
    siteImages.map(async ([fileName, source]) => {
      await sharp(source)
        .resize(1200, 1200, { fit: "cover", position: "center" })
        .webp({ quality: 86, effort: 5 })
        .toFile(path.join(publicDir, fileName));
    }),
  );
}

await renderCarousel();
await renderSiteImages();

console.log(`Created AUREYA carousel exports in: ${carouselDir}`);
console.log(`Created AUREYA site assets in: ${publicDir}`);
