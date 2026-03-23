import fs from "fs";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export function getComicFormat(filePath: string): "cbz" | "cbr" | "pdf" | "folder" | null {
  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      return isImageDirectory(filePath) ? "folder" : null;
    }
  } catch {
    return null;
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".cbz") return "cbz";
  if (ext === ".cbr") return "cbr";
  if (ext === ".pdf") return "pdf";
  return null;
}

export function isImageDirectory(dirPath: string): boolean {
  try {
    const entries = fs.readdirSync(dirPath);
    return entries.some((entry) =>
      IMAGE_EXTENSIONS.has(path.extname(entry).toLowerCase())
    );
  } catch {
    return false;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractNumberFromFilename(filename: string): number | null {
  const nameWithoutExt = path.basename(filename, path.extname(filename));

  // Pattern Kapowarr : "Batman (2025) Volume 01 Issue 001"
  const kapowarrMatch = nameWithoutExt.match(/Issue\s+(\d+)/i);
  if (kapowarrMatch) {
    return parseInt(kapowarrMatch[1], 10);
  }

  // Pattern "XX (of YY)" : "Batman - White Knight 02 (of 08)"
  const ofMatch = nameWithoutExt.match(/(\d+)\s*\(of\s+\d+\)/i);
  if (ofMatch) {
    return parseInt(ofMatch[1], 10);
  }

  // Pattern "#XX" : "Spider-Man #42"
  const hashMatch = nameWithoutExt.match(/#(\d+)/);
  if (hashMatch) {
    return parseInt(hashMatch[1], 10);
  }

  // Fallback : premier nombre qui n'est pas une année (4 chiffres 19xx/20xx)
  const matches = nameWithoutExt.match(/\d+/g);
  if (!matches || matches.length === 0) return null;

  for (const m of matches) {
    const num = parseInt(m, 10);
    if (Number.isNaN(num)) continue;
    // Ignorer les années (1900-2099)
    if (num >= 1900 && num <= 2099 && m.length === 4) continue;
    return num;
  }

  // Si tout est des années, prendre le dernier nombre
  const lastNum = parseInt(matches[matches.length - 1], 10);
  return Number.isNaN(lastNum) ? null : lastNum;
}

export interface KapowarrInfo {
  seriesName: string;
  year: number | null;
  volume: number | null;
  issue: number | null;
}

export function parseKapowarrFilename(filename: string): KapowarrInfo | null {
  const nameWithoutExt = path.basename(filename, path.extname(filename));

  // Pattern : "Batman (2025) Volume 01 Issue 001"
  const match = nameWithoutExt.match(
    /^(.+?)\s*\((\d{4})\)\s*Volume\s+(\d+)\s+Issue\s+(\d+)/i
  );

  if (!match) return null;

  return {
    seriesName: match[1].trim(),
    year: parseInt(match[2], 10),
    volume: parseInt(match[3], 10),
    issue: parseInt(match[4], 10),
  };
}

export function cleanComicTitle(filename: string): string {
  const kapowarr = parseKapowarrFilename(filename);
  if (kapowarr) {
    return kapowarr.seriesName;
  }

  const nameWithoutExt = path.basename(filename, path.extname(filename));

  // Pattern Mylar3 : "Title v01 (2025) (Digital) (Group)"
  const mylarClean = nameWithoutExt
    .replace(/\s+v\d+\s*\(.*$/i, "")  // "Title v01 (2025)..." → "Title"
    .replace(/\s*\(\d{4}\).*$/, "")     // "Title (2025)..." → "Title"
    .replace(/\s*\(Digital\).*$/i, "")   // "Title (Digital)..." → "Title"
    .replace(/\s*#\d+.*$/, "")           // "Title #1..." → "Title"
    .trim();

  if (mylarClean && mylarClean !== nameWithoutExt) {
    return mylarClean;
  }

  // Fallback : nom sans extension
  return nameWithoutExt;
}
