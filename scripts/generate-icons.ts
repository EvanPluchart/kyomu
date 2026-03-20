// Script pour générer les icônes PWA
// Exécuter : npx tsx scripts/generate-icons.ts

import sharp from "sharp";
import fs from "fs";
import path from "path";

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="64" fill="#0a0a0f"/>
  <text x="256" y="320" text-anchor="middle" font-size="280" font-family="serif" fill="#e4e4e7">虚</text>
</svg>`;

const ICONS_DIR = path.join(process.cwd(), "public", "icons");

async function main() {
  fs.mkdirSync(ICONS_DIR, { recursive: true });

  const svgBuffer = Buffer.from(SVG);

  await sharp(svgBuffer).resize(192).png().toFile(path.join(ICONS_DIR, "icon-192.png"));
  await sharp(svgBuffer).resize(512).png().toFile(path.join(ICONS_DIR, "icon-512.png"));

  // Maskable icon (with padding)
  const MASKABLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#0a0a0f"/>
    <text x="256" y="340" text-anchor="middle" font-size="240" font-family="serif" fill="#e4e4e7">虚</text>
  </svg>`;

  await sharp(Buffer.from(MASKABLE_SVG)).resize(512).png().toFile(path.join(ICONS_DIR, "icon-512-maskable.png"));

  console.warn("Icons generated successfully!");
}

main();
