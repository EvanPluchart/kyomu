import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { series, comics, readingProgress } from "@/lib/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { getProfileCondition } from "@/lib/profile";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const seriesId = parseInt(id, 10);

  if (isNaN(seriesId)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const seriesRows = await db
    .select()
    .from(series)
    .where(eq(series.id, seriesId))
    .limit(1);

  if (seriesRows.length === 0) {
    return NextResponse.json({ error: "Série non trouvée" }, { status: 404 });
  }

  const seriesData = seriesRows[0];

  const profileCondition = await getProfileCondition();

  const comicsRows = await db
    .select({
      id: comics.id,
      title: comics.title,
      number: comics.number,
      filePath: comics.filePath,
      fileSize: comics.fileSize,
      format: comics.format,
      pageCount: comics.pageCount,
      createdAt: comics.createdAt,
      updatedAt: comics.updatedAt,
      progressCurrentPage: readingProgress.currentPage,
      progressTotalPages: readingProgress.totalPages,
      progressStatus: readingProgress.status,
    })
    .from(comics)
    .leftJoin(
      readingProgress,
      and(eq(readingProgress.comicId, comics.id), profileCondition),
    )
    .where(eq(comics.seriesId, seriesId))
    .orderBy(asc(comics.number));

  const comicsWithProgress = comicsRows.map((row) => ({
    id: row.id,
    title: row.title,
    number: row.number,
    filePath: row.filePath,
    fileSize: row.fileSize,
    format: row.format,
    pageCount: row.pageCount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    progress:
      row.progressStatus !== null
        ? {
            currentPage: row.progressCurrentPage,
            totalPages: row.progressTotalPages,
            status: row.progressStatus,
          }
        : null,
  }));

  return NextResponse.json({
    series: seriesData,
    comics: comicsWithProgress,
  });
}
