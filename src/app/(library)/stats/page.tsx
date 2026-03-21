import { db } from "@/lib/db";
import { comics, series, readingProgress } from "@/lib/db/schema";
import { count, eq, and, isNull, desc, sql } from "drizzle-orm";
import { getActiveProfileId } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const profileId = await getActiveProfileId();
  const profileCondition = profileId != null
    ? eq(readingProgress.profileId, profileId)
    : isNull(readingProgress.profileId);

  // Total read
  const [readCount] = await db.select({ total: count() }).from(readingProgress)
    .where(and(eq(readingProgress.status, "read"), profileCondition));

  // Total reading
  const [readingCount] = await db.select({ total: count() }).from(readingProgress)
    .where(and(eq(readingProgress.status, "reading"), profileCondition));

  // Total comics
  const [totalComics] = await db.select({ total: count() }).from(comics);

  // Total series
  const [totalSeries] = await db.select({ total: count() }).from(series);

  // Most read series (by number of read comics)
  const topSeries = await db
    .select({
      seriesTitle: series.title,
      seriesId: series.id,
      readCount: count(),
    })
    .from(readingProgress)
    .innerJoin(comics, eq(comics.id, readingProgress.comicId))
    .innerJoin(series, eq(series.id, comics.seriesId))
    .where(and(eq(readingProgress.status, "read"), profileCondition))
    .groupBy(series.id)
    .orderBy(desc(count()))
    .limit(5);

  // Estimated reading time (2 min per page average)
  const [totalPages] = await db
    .select({ total: sql<number>`COALESCE(SUM(${readingProgress.currentPage}), 0)` })
    .from(readingProgress)
    .where(profileCondition);

  const estimatedMinutes = (totalPages.total ?? 0) * 2;
  const estimatedHours = Math.floor(estimatedMinutes / 60);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        Statistiques
      </h1>

      {/* Main stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Comics lus", value: readCount.total },
          { label: "En cours", value: readingCount.total },
          { label: "Séries", value: totalSeries.total },
          { label: "Temps estimé", value: `${estimatedHours}h` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Top series */}
      {topSeries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Séries les plus lues
          </h2>
          <div className="space-y-2">
            {topSeries.map((s, i) => (
              <div key={s.seriesId} className="flex items-center gap-3 rounded-xl bg-card p-3">
                <span className="text-lg font-bold text-primary w-6 text-center" style={{ fontFamily: "var(--font-display)" }}>
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium">{s.seriesTitle}</span>
                <span className="text-xs text-muted-foreground">{s.readCount} lus</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress overview */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Progression globale
        </h2>
        <div className="rounded-xl bg-card p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Comics lus</span>
            <span className="font-medium">{readCount.total} / {totalComics.total}</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${totalComics.total > 0 ? (readCount.total / totalComics.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
