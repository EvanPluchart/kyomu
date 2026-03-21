import { db } from "@/lib/db";
import { comics, series, readingProgress } from "@/lib/db/schema";
import { eq, desc, and, isNull } from "drizzle-orm";
import Link from "next/link";
import { getActiveProfileId } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default async function ReadingPage() {
  const profileId = await getActiveProfileId();

  const profileCondition =
    profileId != null
      ? eq(readingProgress.profileId, profileId)
      : isNull(readingProgress.profileId);

  const inProgress = await db
    .select({
      comicId: comics.id,
      comicTitle: comics.title,
      comicNumber: comics.number,
      seriesId: series.id,
      seriesTitle: series.title,
      currentPage: readingProgress.currentPage,
      totalPages: readingProgress.totalPages,
      updatedAt: readingProgress.updatedAt,
    })
    .from(readingProgress)
    .innerJoin(comics, eq(comics.id, readingProgress.comicId))
    .leftJoin(series, eq(series.id, comics.seriesId))
    .where(and(eq(readingProgress.status, "reading"), profileCondition))
    .orderBy(desc(readingProgress.updatedAt));

  return (
    <div className="space-y-8 animate-fade-in">
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        En cours de lecture
      </h1>

      {inProgress.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-muted-foreground">
            Aucun comic en cours de lecture.
          </p>
          <Link
            href="/series"
            className="text-sm text-primary hover:underline"
          >
            Parcourir les séries →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {inProgress.map((comic) => {
            const progress =
              comic.totalPages > 0
                ? Math.round((comic.currentPage / comic.totalPages) * 100)
                : 0;

            return (
              <Link
                key={comic.comicId}
                href={`/read/${comic.comicId}`}
                className="group flex items-center gap-4 rounded-xl bg-card p-3 transition-all duration-200 hover:bg-muted/50 cursor-pointer"
              >
                <div className="relative shrink-0 w-14 aspect-[2/3] overflow-hidden rounded-lg bg-muted">
                  <img
                    src={`/api/comics/${comic.comicId}/thumbnail`}
                    alt={comic.comicTitle}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div>
                    <p className="text-sm font-semibold truncate" style={{ fontFamily: "var(--font-display)" }}>
                      {comic.seriesTitle ?? comic.comicTitle}
                      {comic.comicNumber != null && ` #${comic.comicNumber}`}
                    </p>
                    {comic.seriesTitle && comic.comicTitle !== comic.seriesTitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {comic.comicTitle}
                      </p>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {comic.currentPage}/{comic.totalPages}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
