import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/content/findYourLight.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { findYourLightQuestions: questions, findYourLightProfiles: profiles, calculateFindYourLightResult: result } =
  await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const scores = (letters) => {
  const counts = Object.fromEntries(Object.keys(profiles).map((slug) => [slug, 0]));
  letters.forEach((letter, i) => counts[questions[i].options.find((option) => option.letter === letter).scent]++);
  return counts;
};

test("eight questions preserve every original answer mapping and add KAMEIRA", () => {
  const scents = ["zephyr", "aureya", "eliora", "maris", "ashoka", "ardor", "theon", "kameira"];
  assert.equal(questions.length, 8);
  questions.forEach((question) => assert.deepEqual(question.options.map((option) => option.scent), scents));
  scents.forEach((slug, i) => assert.equal(result(scores(Array(8).fill("ABCDEFGH"[i]))), slug));
});

test("mixed deterministic path can recommend KAMEIRA without unanimous answers", () => {
  assert.equal(result(scores(["H", "H", "A", "H", "B", "H", "C", "H"])), "kameira");
});

test("existing tie priorities remain unchanged, including ties with KAMEIRA", () => {
  const priority = ["theon", "ardor", "ashoka", "eliora", "maris", "zephyr", "aureya", "kameira"];
  priority.forEach((first, i) => priority.slice(i + 1).forEach((second) => {
    const tied = Object.fromEntries(Object.keys(profiles).map((slug) => [slug, 0]));
    tied[first] = 4;
    tied[second] = 4;
    assert.equal(result(tied), first);
  }));
});

test("KAMEIRA result has official positioning and both existing purchase routes", () => {
  const profile = profiles.kameira;
  assert.equal(profile.number, "08");
  assert.equal(profile.family, "Warm gourmand");
  assert.deepEqual(profile.keyNotes, ["Blackcurrant wine", "Velvet rose", "Burnished amber"]);
  assert.equal(profile.mood, "Warm, soft, skin-close");
  assert.equal(profile.occasion, "Evenings, close-range, air-conditioned rooms");
  assert.deepEqual(profile.primaryCta, { label: "Reserve 50mL Bottle", href: "/preorder?checkout=kameira#secure-checkout" });
  assert.deepEqual(profile.secondaryCta, { label: "Try In RM99 Set", href: "/preorder?checkout=three-8ml-promo#secure-checkout" });
});
