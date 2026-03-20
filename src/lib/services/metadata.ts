import { XMLParser } from "fast-xml-parser";
import * as yauzl from "yauzl-promise";
import { execFile as execFileCb } from "child_process";
import { promisify } from "util";
import path from "path";
import type { ComicInfo } from "@/types/comic-info";

const execFile = promisify(execFileCb);

const parser = new XMLParser({
  ignoreAttributes: true,
  isArray: () => false,
});

export function parseComicInfoXml(xml: string): ComicInfo {
  try {
    const parsed = parser.parse(xml);
    const ci = parsed.ComicInfo || {};
    return {
      title: ci.Title ?? null,
      series: ci.Series ?? null,
      number: ci.Number != null ? Number(ci.Number) : null,
      writer: ci.Writer ?? null,
      penciller: ci.Penciller ?? null,
      summary: ci.Summary ?? null,
      year: ci.Year != null ? Number(ci.Year) : null,
      publisher: ci.Publisher ?? null,
      pageCount: ci.PageCount != null ? Number(ci.PageCount) : null,
    };
  } catch {
    console.warn("[metadata] Erreur de parsing ComicInfo.xml, utilisation des valeurs par défaut");
    return {
      title: null,
      series: null,
      number: null,
      writer: null,
      penciller: null,
      summary: null,
      year: null,
      publisher: null,
      pageCount: null,
    };
  }
}

export async function extractComicInfoFromCbz(filePath: string): Promise<ComicInfo | null> {
  const zipFile = await yauzl.open(filePath);
  try {
    const entries = await zipFile.readEntries();
    const comicInfoEntry = entries.find(
      (e) => e.filename.toLowerCase() === "comicinfo.xml"
    );
    if (!comicInfoEntry) return null;

    const stream = await comicInfoEntry.openReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk as Uint8Array));
    }
    const xml = Buffer.concat(chunks).toString("utf-8");
    return parseComicInfoXml(xml);
  } finally {
    await zipFile.close();
  }
}

export async function extractComicInfoFromCbr(filePath: string): Promise<ComicInfo | null> {
  try {
    const { stdout } = await execFile("unrar", ["p", "-inul", filePath, "ComicInfo.xml"]);
    if (!stdout || stdout.length === 0) return null;
    return parseComicInfoXml(stdout);
  } catch {
    return null; // ComicInfo.xml n'existe pas dans l'archive
  }
}

export async function extractMetadata(
  filePath: string,
  format: "cbz" | "cbr" | "folder"
): Promise<ComicInfo | null> {
  switch (format) {
    case "cbz":
      return extractComicInfoFromCbz(filePath);
    case "cbr":
      return extractComicInfoFromCbr(filePath);
    case "folder":
      return null;
  }
}

export function titleFromFilename(filename: string): string {
  return path.basename(filename, path.extname(filename));
}
