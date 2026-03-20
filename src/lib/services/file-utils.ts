import fs from "fs";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export function getComicFormat(filePath: string): "cbz" | "cbr" | "folder" | null {
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

  // Fallback : dernier nombre dans le nom de fichier
  const matches = nameWithoutExt.match(/\d+/g);
  if (!matches || matches.length === 0) return null;
  const lastMatch = matches[matches.length - 1];
  const num = parseInt(lastMatch, 10);
  return Number.isNaN(num) ? null : num;
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

  // Fallback : nom sans extension
  return path.basename(filename, path.extname(filename));
}
