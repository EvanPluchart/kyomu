import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { series, comics } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import fs from "fs/promises";
import { getThumbnailPath, thumbnailExists, generateThumbnail } from "@/lib/services/thumbnails";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const seriesId = parseInt(id, 10);

  if (isNaN(seriesId)) {
    return servePlaceholder();
  }

  const seriesRows = await db.select().from(series).where(eq(series.id, seriesId)).limit(1);
  if (seriesRows.length === 0) {
    return servePlaceholder();
  }

  // Récupérer plusieurs comics pour fallback si le premier échoue
  const comicRows = await db
    .select()
    .from(comics)
    .where(eq(comics.seriesId, seriesId))
    .orderBy(asc(comics.number), asc(comics.id))
    .limit(10);

  if (comicRows.length === 0) {
    return servePlaceholder();
  }

  // Essayer chaque comic jusqu'à trouver un thumbnail valide
  for (const comic of comicRows) {
    if (!(await thumbnailExists(comic.id))) {
      await generateThumbnail(comic.id, comic.format, comic.filePath);
    }

    try {
      const thumbPath = getThumbnailPath(comic.id);
      const buffer = await fs.readFile(thumbPath);
      if (buffer.length > 500) {
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "image/webp",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    } catch {
      // Ce comic n'a pas de thumbnail valide, essayer le suivant
    }
  }

  return servePlaceholder();
}

function servePlaceholder(): NextResponse {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
    <rect width="300" height="450" fill="#1a1a2e" rx="8"/>
    <text x="150" y="225" text-anchor="middle" fill="#4a4a6a" font-size="14" font-family="system-ui">Couverture indisponible</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
