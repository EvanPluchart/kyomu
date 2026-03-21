import { db } from "@/lib/db";
import { series, comics, readingProgress } from "@/lib/db/schema";
import { eq, asc, and, isNull, count } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SeriesHeader } from "@/components/library/series-header";
import { VolumeGrid } from "@/components/library/volume-grid";
import { SimilarSeries } from "@/components/library/similar-series";
import { getActiveProfileId } from "@/lib/profile";

export const dynamic = "force-dynamic";

interface SeriesDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function SeriesDetailPage({ params, searchParams }: SeriesDetailPageProps) {
  const { id } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const perPage = 20;
  const offset = (page - 1) * perPage;

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

  // Compter le total de comics pour la pagination
  const [{ total: totalComics }] = await db
    .select({ total: count() })
    .from(comics)
    .where(eq(comics.seriesId, seriesId));

  // Fetch all comics pour trouver "Continuer la lecture" (besoin de tous les statuts)
  const allComicsRows = await db
    .select({
      id: comics.id,
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
  const continueComic = allComicsRows.find(
    (c) => c.status === "reading" || c.status === null || c.status === "unread",
  );

  // Fetch comics paginés avec progression filtrée par profil
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
    .orderBy(asc(comics.number), asc(comics.id))
    .limit(perPage)
    .offset(offset);

  const totalPages = Math.ceil(totalComics / perPage);

  return (
    <div className="space-y-6">
      <SeriesHeader
        series={seriesData}
        comicsCount={totalComics}
        continueComicId={continueComic?.id ?? null}
      />
      <VolumeGrid comics={comicsRows} />
      {totalComics > perPage && (
        <div className="flex items-center justify-center gap-4 pt-6">
          {page > 1 && (
            <Link
              href={`/series/${seriesId}?page=${page - 1}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              &larr; Précédent
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/series/${seriesId}?page=${page + 1}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              Suivant &rarr;
            </Link>
          )}
        </div>
      )}
      <SimilarSeries seriesTitle={seriesData.title} />
    </div>
  );
}
