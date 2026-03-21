import { db } from "@/lib/db";
import { series, comics, readingProgress } from "@/lib/db/schema";
import { count, eq, desc, and, isNull } from "drizzle-orm";
import { ContinueReading } from "@/components/library/continue-reading";
import { RecentAdditions } from "@/components/library/recent-additions";
import { LibraryStats } from "@/components/library/library-stats";
import { EmptyState } from "@/components/library/empty-state";
import { PendingRequests } from "@/components/library/pending-requests";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { getActiveProfileId } from "@/lib/profile";
import { RandomReadButton } from "@/components/library/random-read-button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const profileId = await getActiveProfileId();

  const profileCondition =
    profileId != null
      ? eq(readingProgress.profileId, profileId)
      : isNull(readingProgress.profileId);

  const [seriesCount] = await db.select({ total: count() }).from(series);
  const [comicsCount] = await db.select({ total: count() }).from(comics);
  const [readCount] = await db
    .select({ total: count() })
    .from(readingProgress)
    .where(and(eq(readingProgress.status, "read"), profileCondition));

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
    .where(and(eq(readingProgress.status, "reading"), profileCondition))
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

      {inProgress.length > 0 && (
        <Link
          href={`/read/${inProgress[0].comicId}`}
          className="flex items-center gap-4 rounded-xl bg-primary/10 p-4 hover:bg-primary/15 transition-colors cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Reprendre la lecture
            </p>
            <p className="text-xs text-muted-foreground">
              {inProgress[0].seriesTitle} {inProgress[0].comicTitle !== inProgress[0].seriesTitle ? `\u2014 ${inProgress[0].comicTitle}` : ""}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary" />
        </Link>
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
          <div className="flex items-center gap-3">
            <RandomReadButton />
            <Link
              href="/series"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Toutes les séries →
            </Link>
          </div>
        </div>

        <LibraryStats
          totalSeries={totalSeries}
          totalComics={totalComics}
          totalRead={totalRead}
        />
      </div>

      {inProgress.length > 0 && <ContinueReading comics={inProgress} />}

      {recent.length > 0 && <RecentAdditions comics={recent} />}

      <PendingRequests />
    </div>
  );
}
