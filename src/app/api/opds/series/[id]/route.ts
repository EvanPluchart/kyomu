import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { series, comics } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { generateSeriesDetailFeed } from "@/lib/services/opds";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const seriesId = parseInt(id, 10);

  if (isNaN(seriesId)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const seriesRows = await db.select().from(series).where(eq(series.id, seriesId)).limit(1);
  if (seriesRows.length === 0) {
    return NextResponse.json({ error: "Série non trouvée" }, { status: 404 });
  }

  const seriesData = seriesRows[0];
  const comicsList = await db
    .select({
      id: comics.id,
      title: comics.title,
      number: comics.number,
      format: comics.format,
      filePath: comics.filePath,
    })
    .from(comics)
    .where(eq(comics.seriesId, seriesId))
    .orderBy(asc(comics.number));

  const baseUrl = new URL(request.url).origin;
  const xml = generateSeriesDetailFeed(baseUrl, seriesData, comicsList);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
