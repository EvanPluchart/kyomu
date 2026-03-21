import { db } from "@/lib/db";
import { series, comics, readingProgress } from "@/lib/db/schema";
import { count, eq, desc } from "drizzle-orm";
import { ContinueReading } from "@/components/library/continue-reading";
import { RecentAdditions } from "@/components/library/recent-additions";
import { LibraryStats } from "@/components/library/library-stats";
import { EmptyState } from "@/components/library/empty-state";
import { PendingRequests } from "@/components/library/pending-requests";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [seriesCount] = await db.select({ total: count() }).from(series);
  const [comicsCount] = await db.select({ total: count() }).from(comics);
  const [readCount] = await db
    .select({ total: count() })
    .from(readingProgress)
    .where(eq(readingProgress.status, "read"));

  const totalSeries = seriesCount.total;
  const totalComics = comicsCount.total;
  const totalRead = readCount.total;

  const [latestSeries] = await db.select().from(series).orderBy(desc(series.createdAt)).limit(1);

  if (totalSeries === 0) {
    return (
      <div className="animate-fade-in">
        <EmptyState />
      </div>
    );
  }

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
    <div className="space-y-10 animate-fade-in">
      {latestSeries && (
        <div className="relative overflow-hidden rounded-2xl h-48 sm:h-64">
          <img
            src={`/api/library/series/${latestSeries.id}/thumbnail`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover blur-xl scale-110 opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="relative flex h-full items-center gap-6 px-6">
            <img
              src={`/api/library/series/${latestSeries.id}/thumbnail`}
              alt={latestSeries.title}
              className="h-full aspect-[2/3] rounded-xl object-cover shadow-2xl"
            />
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Dernière série ajoutée</p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {latestSeries.title}
              </h2>
              <Link href={`/series/${latestSeries.id}`}>
                <Button className="gap-2 rounded-xl">Parcourir</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Bibliothèque
            </h1>
          </div>
          <Link
            href="/series"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Toutes les séries →
          </Link>
        </div>

        <LibraryStats
          totalSeries={totalSeries}
          totalComics={totalComics}
          totalRead={totalRead}
        />
      </div>

      {inProgress.length > 0 && <ContinueReading comics={inProgress} />}

      {recent.length > 0 && <RecentAdditions comics={recent} />}\n\n      <PendingRequests />
    </div>
  );
}
