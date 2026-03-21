import { db } from "@/lib/db";
import { series, comics, readingProgress } from "@/lib/db/schema";
import { asc, desc, like, or, sql } from "drizzle-orm";
import { SeriesGrid } from "@/components/library/series-grid";
import { EmptyState } from "@/components/library/empty-state";
import { SearchBar } from "@/components/library/search-bar";
import { Filters } from "@/components/library/filters";
import { SortSelect } from "@/components/library/sort-select";
import { Suspense } from "react";
import { getActiveProfileId } from "@/lib/profile";

export const dynamic = "force-dynamic";

interface SeriesPageProps {
  searchParams: Promise<{ q?: string; status?: string; sort?: string }>;
}

function getOrderBy(sort: string | undefined) {
  switch (sort) {
    case "volumes":
      return desc(series.comicsCount);
    case "added":
      return desc(series.createdAt);
    default:
      return asc(series.title);
  }
}

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  const { q, status, sort } = await searchParams;
  const profileId = await getActiveProfileId();

  // Build query with filters
  const conditions = [];

  if (q) {
    conditions.push(
      or(
        like(series.title, `%${q}%`),
        like(series.author, `%${q}%`),
      ),
    );
  }

  if (status && ["unread", "reading", "read"].includes(status)) {
    const profileSql =
      profileId != null
        ? sql`AND ${readingProgress.profileId} = ${profileId}`
        : sql`AND ${readingProgress.profileId} IS NULL`;

    conditions.push(
      sql`${series.id} IN (
        SELECT ${comics.seriesId}
        FROM ${comics}
        LEFT JOIN ${readingProgress} ON ${readingProgress.comicId} = ${comics.id}
        WHERE ${readingProgress.status} = ${status} ${profileSql}
      )`,
    );
  }

  const orderBy = getOrderBy(sort);

  // Apply conditions and order
  const allSeries =
    conditions.length > 0
      ? await db
          .select()
          .from(series)
          .where(conditions.reduce((acc, c) => sql`${acc} AND ${c}`))
          .orderBy(orderBy)
      : await db.select().from(series).orderBy(orderBy);

  // Check if library is completely empty (no filters applied)
  const isLibraryEmpty = !q && !status && allSeries.length === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Séries</h1>

      {isLibraryEmpty ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Suspense>
                <SearchBar />
              </Suspense>
            </div>
            <Suspense>
              <SortSelect />
            </Suspense>
            <Suspense>
              <Filters />
            </Suspense>
          </div>

          {allSeries.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                Aucun résultat pour votre recherche.
              </p>
            </div>
          ) : (
            <SeriesGrid series={allSeries} />
          )}
        </>
      )}
    </div>
  );
}
