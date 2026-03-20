import { db } from "@/lib/db";
import { comics, series } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ComicReader } from "@/components/reader/comic-reader";

export const dynamic = "force-dynamic";

export default async function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const comicId = parseInt(id, 10);
  if (isNaN(comicId)) notFound();

  const rows = await db
    .select({
      id: comics.id,
      title: comics.title,
      seriesId: comics.seriesId,
      seriesTitle: series.title,
      pageCount: comics.pageCount,
    })
    .from(comics)
    .leftJoin(series, eq(series.id, comics.seriesId))
    .where(eq(comics.id, comicId))
    .limit(1);

  if (rows.length === 0) notFound();

  const comic = rows[0];

  return (
    <ComicReader
      comicId={comic.id}
      title={comic.title}
      seriesTitle={comic.seriesTitle ?? ""}
      seriesId={comic.seriesId}
    />
  );
}
