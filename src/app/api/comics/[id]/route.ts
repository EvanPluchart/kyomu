import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { series, comics, readingProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const comicId = parseInt(id, 10);

  if (isNaN(comicId)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const rows = await db
    .select({
      comicId: comics.id,
      comicTitle: comics.title,
      comicNumber: comics.number,
      comicFilePath: comics.filePath,
      comicFileSize: comics.fileSize,
      comicFormat: comics.format,
      comicPageCount: comics.pageCount,
      comicMetadataJson: comics.metadataJson,
      comicCreatedAt: comics.createdAt,
      comicUpdatedAt: comics.updatedAt,
      seriesId: series.id,
      seriesTitle: series.title,
      seriesSlug: series.slug,
      progressCurrentPage: readingProgress.currentPage,
      progressTotalPages: readingProgress.totalPages,
      progressStatus: readingProgress.status,
      progressStartedAt: readingProgress.startedAt,
      progressCompletedAt: readingProgress.completedAt,
    })
    .from(comics)
    .leftJoin(series, eq(series.id, comics.seriesId))
    .leftJoin(readingProgress, eq(readingProgress.comicId, comics.id))
    .where(eq(comics.id, comicId))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Comic non trouvé" }, { status: 404 });
  }

  const row = rows[0];

  return NextResponse.json({
    comic: {
      id: row.comicId,
      title: row.comicTitle,
      number: row.comicNumber,
      filePath: row.comicFilePath,
      fileSize: row.comicFileSize,
      format: row.comicFormat,
      pageCount: row.comicPageCount,
      metadataJson: row.comicMetadataJson,
      createdAt: row.comicCreatedAt,
      updatedAt: row.comicUpdatedAt,
      series:
        row.seriesId !== null
          ? {
              id: row.seriesId,
              title: row.seriesTitle,
              slug: row.seriesSlug,
            }
          : null,
      progress:
        row.progressStatus !== null
          ? {
              currentPage: row.progressCurrentPage,
              totalPages: row.progressTotalPages,
              status: row.progressStatus,
              startedAt: row.progressStartedAt,
              completedAt: row.progressCompletedAt,
            }
          : null,
    },
  });
}
