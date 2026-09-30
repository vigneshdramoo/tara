import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function readProjectFile(filePath) {
  return readFileSync(path.join(projectRoot, filePath), "utf8");
}

function walkFiles(directory, extension) {
  const root = path.join(projectRoot, directory);

  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      return walkFiles(path.relative(projectRoot, filePath), extension);
    }

    return filePath.endsWith(extension) ? [path.relative(projectRoot, filePath)] : [];
  });
}

test("stage 8 optimized image assets exist and replace heavy production references", () => {
  const optimizedAssets = [
    "public/editorial/tara-theon-launch-hero-optimized.webp",
    "public/editorial/tara-theon-duo-optimized.webp",
    "public/editorial/tara-theon-50ml-optimized.webp",
    "public/quiz-assets/bottle-aureya.webp",
    "public/quiz-assets/bottle-zephyr.webp",
    "public/quiz-assets/bottle-eliora.webp",
    "public/quiz-assets/bottle-maris.webp",
  ];

  for (const asset of optimizedAssets) {
    const absoluteAssetPath = path.join(projectRoot, asset);
    assert.ok(existsSync(absoluteAssetPath), `${asset} should exist`);
    assert.ok(
      statSync(absoluteAssetPath).size < 70 * 1024,
      `${asset} should stay small enough for mobile delivery`,
    );
  }

  const source = walkFiles("src", ".ts")
    .concat(walkFiles("src", ".tsx"))
    .map(readProjectFile)
    .join("\n");

  assert.doesNotMatch(
    source,
    /tara-theon-launch-hero\.png|tara-theon-duo\.png|tara-theon-50ml\.png|bottle-(aureya|zephyr|eliora|maris)\.png/,
    "production source should not reference the heavy Stage 8 source PNG assets",
  );
});

test("stage 8 documents performance QA and keeps fill images sized", () => {
  const report = readProjectFile("docs/stage-8-performance.md");

  assert.match(report, /320/);
  assert.match(report, /390/);
  assert.match(report, /No document-level horizontal overflow/);

  for (const file of walkFiles("src", ".tsx")) {
    const source = readProjectFile(file);
    const imageBlocks = source.match(/<Image[\s\S]*?\/>/g) ?? [];

    for (const imageBlock of imageBlocks) {
      if (imageBlock.includes("fill")) {
        assert.match(imageBlock, /sizes=/, `${file} has a fill Image without sizes`);
      }
    }
  }
});
