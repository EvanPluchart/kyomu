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
  const matches = nameWithoutExt.match(/\d+/g);
  if (!matches || matches.length === 0) return null;
  const lastMatch = matches[matches.length - 1];
  const num = parseInt(lastMatch, 10);
  return Number.isNaN(num) ? null : num;
}
