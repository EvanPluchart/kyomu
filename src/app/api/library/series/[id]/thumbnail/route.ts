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

  // Vérifier que la série existe
  const seriesRows = await db.select().from(series).where(eq(series.id, seriesId)).limit(1);
  if (seriesRows.length === 0) {
    return servePlaceholder();
  }

  // Trouver le premier comic
  const comicRows = await db
    .select()
    .from(comics)
    .where(eq(comics.seriesId, seriesId))
    .orderBy(asc(comics.number), asc(comics.id))
    .limit(1);

  if (comicRows.length === 0) {
    return servePlaceholder();
  }

  const comic = comicRows[0];

  if (!(await thumbnailExists(comic.id))) {
    await generateThumbnail(comic.id, comic.format, comic.filePath);
  }

  try {
    const thumbPath = getThumbnailPath(comic.id);
    const buffer = await fs.readFile(thumbPath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return servePlaceholder();
  }
}

function servePlaceholder(): NextResponse {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
    <rect width="300" height="450" fill="#1a1a2e" rx="8"/>
    <text x="150" y="210" text-anchor="middle" fill="#4a4a6a" font-size="48" font-family="system-ui">📖</text>
    <text x="150" y="260" text-anchor="middle" fill="#4a4a6a" font-size="14" font-family="system-ui">Couverture indisponible</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
