import fs from "node:fs";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const root = process.cwd();
const sizes = [
  [1440, 900],
  [1366, 768],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [360, 800],
];

function readPng(file) {
  return PNG.sync.read(fs.readFileSync(file));
}

function cropTop(source, width, height) {
  const out = new PNG({ width, height });
  PNG.bitblt(source, out, 0, 0, Math.min(width, source.width), Math.min(height, source.height), 0, 0);
  return out;
}

const rows = [];
let failed = false;

for (const [width, height] of sizes) {
  const refFile = path.join(root, "docs/design-references/core-composition", `home-${width}x${height}.png`);
  const localFile = path.join(root, "apps/web/tests/visual/home.spec.ts-snapshots", `home-${width}x${height}-chromium-linux.png`);
  const ref = readPng(refFile);
  const local = readPng(localFile);
  const refCrop = cropTop(ref, width, height);
  const localCrop = cropTop(local, width, height);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(refCrop.data, localCrop.data, diff.data, width, height, { threshold: 0.14 });
  const ratio = diffPixels / (width * height);
  const outFile = path.join(root, "docs/design-references/core-composition", `diff-local-vs-reference-${width}x${height}.png`);
  fs.writeFileSync(outFile, PNG.sync.write(diff));
  if (ratio > 0.05) failed = true;
  rows.push({
    size: `${width}x${height}`,
    viewportDiff: `${(ratio * 100).toFixed(2)}%`,
    referenceFullHeight: ref.height,
    localFullHeight: local.height,
    diffFile: path.relative(root, outFile),
  });
}

console.table(rows);
process.exitCode = failed ? 1 : 0;
