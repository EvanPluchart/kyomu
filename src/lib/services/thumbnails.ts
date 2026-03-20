import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { config } from "@/lib/config";
import { getExtractor } from "@/lib/services/extractors/factory";
import { db } from "@/lib/db";
import { comics } from "@/lib/db/schema";

export function getThumbnailPath(comicId: number): string {
  return path.join(path.dirname(config.databasePath), "thumbnails", `${comicId}.webp`);
}

export async function generateThumbnail(
  comicId: number,
  format: string,
  filePath: string,
): Promise<string | null> {
  const extractor = getExtractor(format, filePath);
  try {
    const buffer = await extractor.getPage(0);
    const thumbPath = getThumbnailPath(comicId);

    await fs.mkdir(path.dirname(thumbPath), { recursive: true });

    await sharp(buffer)
      .resize(300)
      .webp({ quality: 80 })
      .toFile(thumbPath);

    return thumbPath;
  } catch (error) {
    console.warn(`[thumbnails] Erreur lors de la génération du thumbnail pour le comic ${comicId}:`, error);
    return null;
  } finally {
    await extractor.close();
  }
}

export async function thumbnailExists(comicId: number): Promise<boolean> {
  const thumbPath = getThumbnailPath(comicId);
  try {
    await fs.access(thumbPath);
    return true;
  } catch {
    return false;
  }
}

async function processWithConcurrency<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  const queue = [...items];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item) await fn(item);
    }
  });
  await Promise.all(workers);
}

export async function generateMissingThumbnails(): Promise<number> {
  const allComics = await db.select().from(comics);
  let generated = 0;

  await processWithConcurrency(allComics, 2, async (comic) => {
    const exists = await thumbnailExists(comic.id);
    if (!exists) {
      const result = await generateThumbnail(comic.id, comic.format, comic.filePath);
      if (result !== null) {
        generated++;
      }
    }
  });

  return generated;
}
