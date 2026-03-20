import { db } from "@/lib/db";
import { series, comics, readingProgress } from "@/lib/db/schema";
import { count, eq, desc } from "drizzle-orm";
import { ContinueReading } from "@/components/library/continue-reading";
import { RecentAdditions } from "@/components/library/recent-additions";
import { LibraryStats } from "@/components/library/library-stats";
import { EmptyState } from "@/components/library/empty-state";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Stats
  const [seriesCount] = await db.select({ total: count() }).from(series);
  const [comicsCount] = await db.select({ total: count() }).from(comics);
  const [readCount] = await db.select({ total: count() }).from(readingProgress).where(eq(readingProgress.status, "read"));

  const totalSeries = seriesCount.total;
  const totalComics = comicsCount.total;
  const totalRead = readCount.total;

  if (totalSeries === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Bibliothèque</h1>
        <EmptyState />
      </div>
    );
  }

  // Continuer la lecture (comics en cours)
  const inProgress = await db
    .select({
      comicId: comics.id,
      comicTitle: comics.title,
      seriesId: series.id,
      seriesTitle: series.title,
      currentPage: readingProgress.currentPage,
      totalPages: readingProgress.totalPages,
    })
    .from(readingProgress)
    .innerJoin(comics, eq(comics.id, readingProgress.comicId))
    .leftJoin(series, eq(series.id, comics.seriesId))
    .where(eq(readingProgress.status, "reading"))
    .orderBy(desc(readingProgress.updatedAt))
    .limit(10);

  // Récemment ajoutés
  const recent = await db
    .select({
      id: comics.id,
      title: comics.title,
      seriesId: comics.seriesId,
      seriesTitle: series.title,
    })
    .from(comics)
    .leftJoin(series, eq(series.id, comics.seriesId))
    .orderBy(desc(comics.createdAt))
    .limit(10);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bibliothèque</h1>
        <Link
          href="/series"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Voir toutes les séries →
        </Link>
      </div>

      <LibraryStats
        totalSeries={totalSeries}
        totalComics={totalComics}
        totalRead={totalRead}
      />

      {inProgress.length > 0 && (
        <ContinueReading comics={inProgress} />
      )}

      {recent.length > 0 && (
        <RecentAdditions comics={recent} />
      )}
    </div>
  );
}
