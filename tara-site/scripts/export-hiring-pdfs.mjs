#!/usr/bin/env node
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  generateHiringConfirmationPdf,
  getHiringPdfFilename,
} from "../netlify/functions/lib/hiring-pdf.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(__dirname, "..");
const taraDir = path.resolve(siteDir, "..");
const outputDir =
  process.env.TARA_HIRING_PDF_DIR ?? path.join(taraDir, "TARA & Fiends");
const statePath =
  process.env.TARA_HIRING_PDF_STATE ??
  path.join(outputDir, ".tara-hiring-pdf-export-state.json");
const tokenPath =
  process.env.TARA_HIRING_TOKEN_PATH ??
  path.join(taraDir, ".tara_hiring_admin_token");
const submissionsUrl = "https://tarascents.com/.netlify/functions/hiring-submissions";
const pdfTemplateVersion = "official-wordmark-white-page-v1";

async function readToken() {
  const envToken =
    process.env.TARA_HIRING_ADMIN_TOKEN ??
    process.env.HIRING_ADMIN_TOKEN ??
    process.env.TOKEN ??
    "";

  if (envToken.trim()) {
    return envToken.trim();
  }

  return (await readFile(tokenPath, "utf8")).trim();
}

async function readState() {
  try {
    return JSON.parse(await readFile(statePath, "utf8"));
  } catch {
    return { exported: {} };
  }
}

async function writeState(state) {
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

async function fileExists(filePath) {
  try {
    await stat(filePath);

    return true;
  } catch {
    return false;
  }
}

async function fetchSubmissions(token) {
  const url = new URL(submissionsUrl);
  url.searchParams.set("token", token);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not fetch hiring submissions (${response.status})`);
  }

  const data = await response.json();

  return Array.isArray(data.submissions) ? data.submissions : [];
}

async function exportNewSubmissions() {
  await mkdir(outputDir, { recursive: true });

  const token = await readToken();
  const submissions = await fetchSubmissions(token);
  const sortedSubmissions = submissions
    .filter((submission) => submission?.id)
    .sort((a, b) =>
      String(a.submittedAtIso ?? a.id).localeCompare(String(b.submittedAtIso ?? b.id)),
    );
  const state = await readState();
  state.exported ??= {};

  const exported = [];
  const skipped = [];

  for (const submission of sortedSubmissions) {
    const filename = getHiringPdfFilename(submission);
    const outputPath = path.join(outputDir, filename);
    const previousExport = state.exported[submission.id];

    if (
      previousExport?.outputPath === outputPath &&
      previousExport?.pdfTemplateVersion === pdfTemplateVersion &&
      (await fileExists(outputPath))
    ) {
      skipped.push({ id: submission.id, name: submission.fullName });
      continue;
    }

    const pdfBytes = await generateHiringConfirmationPdf(submission);
    await writeFile(outputPath, pdfBytes);

    state.exported[submission.id] = {
      name: submission.fullName,
      email: submission.email,
      submittedAt: submission.submittedAt,
      outputPath,
      pdfTemplateVersion,
      exportedAt: new Date().toISOString(),
    };
    exported.push({
      id: submission.id,
      name: submission.fullName,
      outputPath,
      bytes: pdfBytes.length,
    });
  }

  state.lastCheckedAt = new Date().toISOString();
  state.totalKnownSubmissions = submissions.length;
  await writeState(state);

  return {
    ok: true,
    checkedAt: state.lastCheckedAt,
    outputDir,
    submissions: submissions.length,
    exported: exported.length,
    skipped: skipped.length,
    files: exported.map((item) => item.outputPath),
  };
}

exportNewSubmissions()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(
      JSON.stringify(
        {
          ok: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  });
