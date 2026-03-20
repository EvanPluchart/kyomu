import { db } from "@/lib/db";
import { series, comics, readingProgress } from "@/lib/db/schema";
import { asc, like, or, sql } from "drizzle-orm";
import { SeriesGrid } from "@/components/library/series-grid";
import { EmptyState } from "@/components/library/empty-state";
import { SearchBar } from "@/components/library/search-bar";
import { Filters } from "@/components/library/filters";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface SeriesPageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  const { q, status } = await searchParams;

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
    conditions.push(
      sql`${series.id} IN (
        SELECT ${comics.seriesId}
        FROM ${comics}
        LEFT JOIN ${readingProgress} ON ${readingProgress.comicId} = ${comics.id}
        WHERE ${readingProgress.status} = ${status}
      )`,
    );
  }

  // Apply conditions and order
  const allSeries =
    conditions.length > 0
      ? await db
          .select()
          .from(series)
          .where(conditions.reduce((acc, c) => sql`${acc} AND ${c}`))
          .orderBy(asc(series.title))
      : await db.select().from(series).orderBy(asc(series.title));

  // Check if library is completely empty (no filters applied)
  const isLibraryEmpty = !q && !status && allSeries.length === 0;

  return (
    <div className="space-y-6">
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
