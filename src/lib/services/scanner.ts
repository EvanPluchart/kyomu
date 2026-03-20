import fs from "fs";
import path from "path";
import { db } from "@/lib/db";
import { series, comics } from "@/lib/db/schema";
import { eq, notInArray, sql } from "drizzle-orm";
import { config } from "@/lib/config";
import { getComicFormat, slugify, extractNumberFromFilename } from "./file-utils";

/** Parcourt récursivement un dossier et retourne tous les fichiers comic trouvés */
function findComicFilesRecursive(dirPath: string): string[] {
  const results: string[] = [];

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (err) {
    console.warn(`[scanner] Impossible de lire le dossier "${dirPath}" : ${err}`);
    return results;
  }

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Descendre récursivement dans les sous-dossiers (ex: Volume XX)
      results.push(...findComicFilesRecursive(entryPath));
    } else {
      const format = getComicFormat(entryPath);
      if (format) {
        results.push(entryPath);
      }
    }
  }

  return results;
}

export interface ScanResult {
  seriesAdded: number;
  seriesRemoved: number;
  comicsAdded: number;
  comicsRemoved: number;
}

export interface ScanStatus {
  isScanning: boolean;
  lastScanAt: string | null;
  lastResult: ScanResult | null;
}

let isScanning = false;
let lastScanAt: string | null = null;
let lastResult: ScanResult | null = null;

export async function scanLibrary(): Promise<ScanResult> {
  if (isScanning) {
    console.warn("[scanner] Scan déjà en cours, abandon.");
    return { seriesAdded: 0, seriesRemoved: 0, comicsAdded: 0, comicsRemoved: 0 };
  }

  isScanning = true;

  const result: ScanResult = {
    seriesAdded: 0,
    seriesRemoved: 0,
    comicsAdded: 0,
    comicsRemoved: 0,
  };

  try {
    // Vérifier que le dossier comics existe
    if (!fs.existsSync(config.comicsPath)) {
      console.warn(`[scanner] Le dossier comics "${config.comicsPath}" n'existe pas.`);
      return result;
    }

    let topLevelEntries: fs.Dirent[];
    try {
      topLevelEntries = fs.readdirSync(config.comicsPath, { withFileTypes: true });
    } catch (err) {
      console.warn(`[scanner] Impossible de lire le dossier comics : ${err}`);
      return result;
    }

    const seriesDirs = topLevelEntries.filter((entry) => entry.isDirectory());
    const allFoundPaths: string[] = [];

    for (const seriesDir of seriesDirs) {
      const seriesDirPath = path.join(config.comicsPath, seriesDir.name);
      const seriesTitle = seriesDir.name;
      const seriesSlug = slugify(seriesTitle);

      // Upsert série
      let seriesId: number;
      try {
        const existingSeries = await db
          .select()
          .from(series)
          .where(eq(series.slug, seriesSlug))
          .limit(1);

        if (existingSeries.length === 0) {
          const inserted = await db
            .insert(series)
            .values({ title: seriesTitle, slug: seriesSlug })
            .returning({ id: series.id });
          seriesId = inserted[0].id;
          result.seriesAdded++;
        } else {
          seriesId = existingSeries[0].id;
        }
      } catch (err) {
        console.warn(`[scanner] Erreur lors de l'upsert de la série "${seriesTitle}" : ${err}`);
        continue;
      }

      // Lister récursivement les fichiers comic du dossier série (supporte les sous-dossiers type Kapowarr)
      const comicFiles = findComicFilesRecursive(seriesDirPath);

      for (const entryPath of comicFiles) {
        const format = getComicFormat(entryPath);
        if (!format) continue;

        allFoundPaths.push(entryPath);

        let stat: fs.Stats;
        try {
          stat = fs.statSync(entryPath);
        } catch (err) {
          console.warn(`[scanner] Impossible de lire les stats de "${entryPath}" : ${err}`);
          continue;
        }

        const fileSize = stat.size;
        const fileMtime = Math.floor(stat.mtimeMs);
        const fileName = path.basename(entryPath);
        const comicTitle = path.basename(fileName, path.extname(fileName));
        const number = extractNumberFromFilename(fileName);

        try {
          const existing = await db
            .select()
            .from(comics)
            .where(eq(comics.filePath, entryPath))
            .limit(1);

          if (existing.length === 0) {
            await db.insert(comics).values({
              seriesId,
              title: comicTitle,
              number,
              filePath: entryPath,
              fileSize,
              fileMtime,
              format,
            });
            result.comicsAdded++;
          } else {
            const existingComic = existing[0];
            if (existingComic.fileMtime !== fileMtime || existingComic.fileSize !== fileSize) {
              await db
                .update(comics)
                .set({ fileSize, fileMtime, title: comicTitle, number, format })
                .where(eq(comics.filePath, entryPath));
            }
          }
        } catch (err) {
          console.warn(`[scanner] Erreur lors de l'upsert du comic "${entryPath}" : ${err}`);
        }
      }
    }

    // Supprimer les comics dont le fichier source n'existe plus
    if (allFoundPaths.length > 0) {
      const deletedComics = await db
        .delete(comics)
        .where(notInArray(comics.filePath, allFoundPaths))
        .returning({ id: comics.id });
      result.comicsRemoved = deletedComics.length;
    } else {
      // Supprimer tous les comics si le dossier est vide
      const deletedComics = await db.delete(comics).returning({ id: comics.id });
      result.comicsRemoved = deletedComics.length;
    }

    // Supprimer les séries sans comics
    const deletedSeries = await db
      .delete(series)
      .where(
        sql`(SELECT COUNT(*) FROM comics WHERE comics.series_id = ${series.id}) = 0`
      )
      .returning({ id: series.id });
    result.seriesRemoved = deletedSeries.length;

    // Mettre à jour le comics_count de chaque série
    await db
      .update(series)
      .set({
        comicsCount: sql`(SELECT COUNT(*) FROM comics WHERE comics.series_id = series.id)`,
      });
  } catch (err) {
    console.warn(`[scanner] Erreur inattendue pendant le scan : ${err}`);
  } finally {
    isScanning = false;
    lastScanAt = new Date().toISOString();
    lastResult = result;
  }

  return result;
}

export function getScanStatus(): ScanStatus {
  return {
    isScanning,
    lastScanAt,
    lastResult,
  };
}
