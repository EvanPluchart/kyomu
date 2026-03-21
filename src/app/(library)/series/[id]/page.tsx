import { db } from "@/lib/db";
import { series, comics, readingProgress } from "@/lib/db/schema";
import { eq, asc, and, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SeriesHeader } from "@/components/library/series-header";
import { VolumeGrid } from "@/components/library/volume-grid";
import { SimilarSeries } from "@/components/library/similar-series";
import { getActiveProfileId } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seriesId = parseInt(id, 10);
  if (isNaN(seriesId)) notFound();

  const seriesRows = await db.select().from(series).where(eq(series.id, seriesId)).limit(1);
  if (seriesRows.length === 0) notFound();
  const seriesData = seriesRows[0];

  const profileId = await getActiveProfileId();

  const profileCondition =
    profileId != null
      ? eq(readingProgress.profileId, profileId)
      : isNull(readingProgress.profileId);

  // Fetch comics avec progression filtrée par profil
  const comicsRows = await db
    .select({
      id: comics.id,
      title: comics.title,
      number: comics.number,
      format: comics.format,
      pageCount: comics.pageCount,
      currentPage: readingProgress.currentPage,
      totalPages: readingProgress.totalPages,
      status: readingProgress.status,
    })
    .from(comics)
    .leftJoin(
      readingProgress,
      and(eq(readingProgress.comicId, comics.id), profileCondition),
    )
    .where(eq(comics.seriesId, seriesId))
    .orderBy(asc(comics.number), asc(comics.id));

  // Trouver le premier volume non lu ou en cours pour "Continuer la lecture"
  const continueComic = comicsRows.find(
    (c) => c.status === "reading" || c.status === null || c.status === "unread",
  );

  return (
    <div className="space-y-6">
      <SeriesHeader
        series={seriesData}
        comicsCount={comicsRows.length}
        continueComicId={continueComic?.id ?? null}
      />
      <VolumeGrid comics={comicsRows} />
      <SimilarSeries seriesTitle={seriesData.title} />
    </div>
  );
}
