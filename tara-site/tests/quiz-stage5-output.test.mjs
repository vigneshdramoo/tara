import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { test } from "node:test";

const quizPath = new URL("../out/quiz.html", import.meta.url);
const quizSourcePath = new URL(
  "../src/components/forms/FindYourLightQuiz.tsx",
  import.meta.url,
);
const quizContentPath = new URL("../src/content/findYourLight.ts", import.meta.url);
const quizPagePath = new URL("../src/app/quiz/page.tsx", import.meta.url);
const netlifyFormsPath = new URL("../public/netlify-forms.html", import.meta.url);

const sourcePaths = [quizSourcePath, quizContentPath, quizPagePath, netlifyFormsPath];
const hasFreshExport =
  existsSync(quizPath) &&
  statSync(quizPath).mtimeMs >=
    Math.max(...sourcePaths.map((sourcePath) => statSync(sourcePath).mtimeMs));

function extractNamedForm(html, formName) {
  const formStart = html.indexOf(`name="${formName}"`);
  assert.notEqual(formStart, -1, `${formName} form should exist`);
  const nextForm = html.indexOf("<form", formStart + 1);

  return nextForm === -1 ? html.slice(formStart) : html.slice(formStart, nextForm);
}

test("Find Your Light content represents THEON in the eight-question scoring flow", () => {
  const content = readFileSync(quizContentPath, "utf8");

  assert.match(content, /\| "theon"/);
  assert.match(content, /Warm tea gourmand/);
  assert.match(content, /Golden oolong/);
  assert.match(content, /Coconut cream/);
  assert.match(content, /Soft vanilla/);
  assert.match(content, /letter: "G"[\s\S]*scent: "theon"/);
  assert.match(content, /"theon",[\s\S]*"ardor",[\s\S]*"ashoka"/);
  assert.match(content, /Try it in the RM99 discovery set/);
  assert.match(content, /Shop the 50mL bottle/);
});

test("Find Your Light result handoff is ungated and actionable", () => {
  const source = readFileSync(quizSourcePath, "utf8");

  assert.match(source, /type Phase = "landing" \| "quiz" \| "results"/);
  assert.match(source, /completeQuiz\(nextAnswers\)/);
  assert.match(source, /Your scent is/);
  assert.match(source, /resultProfile\.family/);
  assert.match(source, /resultProfile\.keyNotes/);
  assert.match(source, /resultProfile\.mood/);
  assert.match(source, /resultProfile\.occasion/);
  assert.match(source, /resultProfile\.reason/);
  assert.match(source, /Back/);
  assert.match(source, /Restart/);
  assert.match(source, /Copy Result Link/);
  assert.match(source, /Save My Result/);
  assert.match(source, /No gate/);
  assert.match(source, /Read full scent notes/);
  assert.match(source, /resultProfile\.productHref/);
  assert.match(source, /aria-valuenow=\{currentQuestionIndex \+ 1\}/);
  assert.doesNotMatch(source, /setPhase\("lead"\)/);
  assert.doesNotMatch(source, /Reveal My Scent/);
  assert.doesNotMatch(source, /result_gate/);
  assert.doesNotMatch(source, /\srequired\b/);
  assert.doesNotMatch(source, /name="gender"/);
});

test("Netlify quiz form captures optional result-saving fields only", () => {
  const html = readFileSync(netlifyFormsPath, "utf8");
  const quizForm = extractNamedForm(html, "tara-quiz-lead");

  assert.match(quizForm, /name="result_url"/);
  assert.match(quizForm, /name="scent_preference"/);
  assert.match(quizForm, /name="preferred_name"/);
  assert.match(quizForm, /name="email"/);
  assert.match(quizForm, /name="mobile"/);
  assert.doesNotMatch(quizForm, /name="gender"/);
});

test("quiz export surfaces THEON, KAMEIRA and the ungated quiz promise", {
  skip: hasFreshExport ? false : "Run npm run build before this check.",
}, () => {
  const html = readFileSync(quizPath, "utf8");

  assert.match(html, /Find your light/);
  assert.match(html, /Eight questions/);
  assert.match(html, /THEON/);
  assert.match(html, /KAMEIRA/);
});
