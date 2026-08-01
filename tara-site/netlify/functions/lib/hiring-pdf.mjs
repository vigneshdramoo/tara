import { readFile } from "node:fs/promises";
import path from "node:path";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const pageSize = [595.28, 841.89];
const margin = 44;
const contentWidth = pageSize[0] - margin * 2;
const officialLogoFilename = "tara-official-wordmark.png";
let officialLogoBytesPromise;
const colors = {
  charcoal: rgb(0.05, 0.05, 0.05),
  ink: rgb(0.13, 0.13, 0.13),
  muted: rgb(0.36, 0.36, 0.36),
  line: rgb(0.82, 0.78, 0.7),
  gold: rgb(0.72, 0.52, 0.26),
  ivory: rgb(0.98, 0.96, 0.91),
  white: rgb(1, 1, 1),
};

const candidateFields = [
  ["Full name", "fullName"],
  ["IC number", "icNumber"],
  ["Phone", "phone"],
  ["Email", "email"],
  ["Home address", "homeAddress"],
  ["Bank", "bankName"],
  ["Account number", "accountNumber"],
];

const engagementFields = [
  ["Trail stop", "activation"],
  ["Role", "role"],
  ["Period", "period"],
  ["Hours", "hours"],
  ["Status", "status"],
  ["Basic pay", "basicPay"],
  ["Commission", "commission"],
  ["Target bonus", "targetBonus"],
  ["Max daily payout", "maxDailyPayout"],
  ["SSM No.", "ssmNo"],
];

const acknowledgementFields = [
  ["Availability", "availabilityAck"],
  ["Pay", "payAck"],
  ["Conduct", "conductAck"],
  ["Attendance", "attendanceAck"],
  ["Payout", "payoutAck"],
  ["Accuracy", "accuracyAck"],
];

function valueOf(record, key) {
  return String(record?.[key] ?? "-").trim() || "-";
}

function cleanFilenamePart(value, fallback) {
  return String(value || fallback)
    .trim()
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[/:*?"<>|\\]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\.+$/g, "")
    .slice(0, 90)
    .trim();
}

function getDatePart(record) {
  return valueOf(record, "period").replace(/\s+-\s+/g, " to ");
}

function getVenuePart(record) {
  return valueOf(record, "venue").split(",")[0].trim();
}

export function getHiringPdfFilename(record) {
  const parts = [
    cleanFilenamePart(record?.fullName, "Candidate"),
    cleanFilenamePart(record?.role, "Role"),
    cleanFilenamePart(getDatePart(record), "Date"),
    cleanFilenamePart(getVenuePart(record), "Venue"),
  ];

  return `${parts.join("-")}.pdf`;
}

async function getOfficialLogoImage(pdf) {
  try {
    officialLogoBytesPromise ??= readOfficialLogoBytes();

    return pdf.embedPng(await officialLogoBytesPromise);
  } catch {
    return null;
  }
}

async function readOfficialLogoBytes() {
  const candidatePaths = [
    path.join(
      process.cwd(),
      "netlify",
      "functions",
      "lib",
      "assets",
      officialLogoFilename,
    ),
    path.join(process.cwd(), "lib", "assets", officialLogoFilename),
    path.join(process.cwd(), "assets", officialLogoFilename),
  ];

  for (const candidatePath of candidatePaths) {
    try {
      return await readFile(candidatePath);
    } catch {
      // Try the next runtime path shape.
    }
  }

  throw new Error("Official TARA wordmark asset could not be loaded.");
}

function splitLongWord(word, font, size, maxWidth) {
  const chunks = [];
  let current = "";

  for (const character of word) {
    const next = current + character;

    if (font.widthOfTextAtSize(next, size) <= maxWidth || !current) {
      current = next;
    } else {
      chunks.push(current);
      current = character;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function wrapLine(line, font, size, maxWidth) {
  const words = String(line).split(/\s+/).filter(Boolean);
  const wrapped = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      continue;
    }

    if (current) {
      wrapped.push(current);
      current = "";
    }

    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      current = word;
    } else {
      wrapped.push(...splitLongWord(word, font, size, maxWidth));
    }
  }

  if (current) {
    wrapped.push(current);
  }

  return wrapped.length ? wrapped : [""];
}

function wrapText(text, font, size, maxWidth) {
  return String(text || "-")
    .replace(/\r/g, "")
    .split("\n")
    .flatMap((line) => wrapLine(line, font, size, maxWidth));
}

function parsePngSignature(dataUrl) {
  const match = String(dataUrl || "").match(/^data:image\/png;base64,(.+)$/);

  if (!match) {
    return null;
  }

  return Buffer.from(match[1], "base64");
}

export async function generateHiringConfirmationPdf(record) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const officialLogo = await getOfficialLogoImage(pdf);
  const activationLabel = valueOf(record, "activation");
  let page = pdf.addPage(pageSize);
  let y = page.getHeight() - margin;

  function drawPageBackground() {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
      color: colors.white,
    });
  }

  function addPage() {
    page = pdf.addPage(pageSize);
    drawPageBackground();
    y = page.getHeight() - margin;
  }

  function ensureSpace(height) {
    if (y - height < margin + 30) {
      addPage();
    }
  }

  function drawText(text, x, baseline, options = {}) {
    page.drawText(String(text), {
      x,
      y: baseline,
      size: options.size ?? 10,
      font: options.font ?? regular,
      color: options.color ?? colors.ink,
      lineHeight: options.lineHeight,
    });
  }

  function drawRule(offset = 0) {
    page.drawLine({
      start: { x: margin, y: y - offset },
      end: { x: page.getWidth() - margin, y: y - offset },
      thickness: 0.8,
      color: colors.line,
    });
  }

  function drawWrapped(text, x, maxWidth, options = {}) {
    const size = options.size ?? 10;
    const font = options.font ?? regular;
    const lineHeight = options.lineHeight ?? size + 5;
    const lines = wrapText(text, font, size, maxWidth);

    for (const line of lines) {
      ensureSpace(lineHeight + 2);
      drawText(line, x, y, {
        size,
        font,
        color: options.color,
      });
      y -= lineHeight;
    }

    return lines.length;
  }

  function drawSectionTitle(title) {
    ensureSpace(42);
    y -= 12;
    drawRule();
    y -= 24;
    drawText(title.toUpperCase(), margin, y, {
      size: 9,
      font: bold,
      color: colors.gold,
    });
    y -= 18;
  }

  function drawField(label, value) {
    const labelWidth = 142;
    const fieldValue = valueOf({ value }, "value");
    const lines = wrapText(fieldValue, regular, 10, contentWidth - labelWidth - 18);
    const rowHeight = Math.max(24, lines.length * 15 + 8);

    ensureSpace(rowHeight + 2);
    const rowTop = y;
    page.drawLine({
      start: { x: margin, y: y + 8 },
      end: { x: page.getWidth() - margin, y: y + 8 },
      thickness: 0.4,
      color: colors.line,
    });
    drawText(label, margin, rowTop - 6, {
      size: 8,
      font: bold,
      color: colors.muted,
    });

    let valueY = rowTop - 6;
    for (const line of lines) {
      drawText(line, margin + labelWidth, valueY, {
        size: 10,
        font: regular,
        color: colors.ink,
      });
      valueY -= 15;
    }

    y -= rowHeight;
  }

  drawPageBackground();
  page.drawRectangle({
    x: 0,
    y: page.getHeight() - 150,
    width: page.getWidth(),
    height: 150,
    color: colors.charcoal,
  });

  if (officialLogo) {
    const logoWidth = 260;
    const logoHeight = logoWidth * (officialLogo.height / officialLogo.width);

    page.drawImage(officialLogo, {
      x: margin,
      y: page.getHeight() - 88,
      width: logoWidth,
      height: logoHeight,
    });
  } else {
    drawText("TARA", margin, page.getHeight() - 78, {
      size: 38,
      font: serifBold,
      color: colors.gold,
    });
  }

  drawText(`${activationLabel.toUpperCase()} CONFIRMATION`, margin, page.getHeight() - 130, {
    size: 10,
    font: bold,
    color: colors.ivory,
  });
  drawText(valueOf(record, "submittedAt"), page.getWidth() - margin - 160, page.getHeight() - 130, {
    size: 9,
    font: regular,
    color: colors.ivory,
  });

  y = page.getHeight() - 190;
  drawText("Hiring confirmation received", margin, y, {
    size: 24,
    font: serifBold,
    color: colors.ink,
  });
  y -= 26;
  drawWrapped(
    `${valueOf(record, "fullName")} accepted the ${valueOf(record, "role")} engagement for ${valueOf(record, "activation")} (${valueOf(record, "period")}).`,
    margin,
    contentWidth,
    { size: 11, lineHeight: 17, color: colors.muted },
  );

  drawSectionTitle("Candidate Details");
  for (const [label, key] of candidateFields) {
    drawField(label, valueOf(record, key));
  }

  drawSectionTitle("Engagement Terms");
  for (const [label, key] of engagementFields) {
    drawField(label, valueOf(record, key));
  }

  drawSectionTitle("Acknowledgements");
  for (const [label, key] of acknowledgementFields) {
    drawField(label, valueOf(record, key));
  }

  drawSectionTitle("Signature");
  drawField("Printed name", valueOf(record, "signatureName"));
  drawField("Date", valueOf(record, "signatureDate"));

  const signaturePng = parsePngSignature(record?.signatureDataUrl);

  if (signaturePng) {
    try {
      const signatureImage = await pdf.embedPng(signaturePng);
      const maxSignatureWidth = 260;
      const maxSignatureHeight = 100;
      const widthScale = maxSignatureWidth / signatureImage.width;
      const heightScale = maxSignatureHeight / signatureImage.height;
      const scale = Math.min(widthScale, heightScale, 1);
      const imageWidth = signatureImage.width * scale;
      const imageHeight = signatureImage.height * scale;

      ensureSpace(imageHeight + 58);
      drawText("Signature image", margin, y, {
        size: 8,
        font: bold,
        color: colors.muted,
      });
      y -= 16;
      page.drawRectangle({
        x: margin,
        y: y - imageHeight - 8,
        width: imageWidth + 16,
        height: imageHeight + 16,
        borderColor: colors.line,
        borderWidth: 0.8,
        color: colors.white,
      });
      page.drawImage(signatureImage, {
        x: margin + 8,
        y: y - imageHeight,
        width: imageWidth,
        height: imageHeight,
      });
      y -= imageHeight + 28;
    } catch {
      drawField("Signature image", "Captured signature could not be embedded.");
    }
  } else {
    drawField("Signature image", "No signature image available.");
  }

  drawSectionTitle("Submission");
  drawField("Submission ID", valueOf(record, "id"));
  drawField("Submitted at", valueOf(record, "submittedAt"));
  drawField("Source page", valueOf(record, "sourcePage"));

  const pageCount = pdf.getPageCount();
  for (const [index, pdfPage] of pdf.getPages().entries()) {
    pdfPage.drawText(`${activationLabel} Confirmation | Page ${index + 1} of ${pageCount}`, {
      x: margin,
      y: 24,
      size: 8,
      font: regular,
      color: colors.muted,
    });
  }

  return pdf.save();
}
