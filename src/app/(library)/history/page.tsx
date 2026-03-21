import { db } from "@/lib/db";
import { comics, series, readingProgress } from "@/lib/db/schema";
import { eq, desc, or, and } from "drizzle-orm";
import Link from "next/link";
import { getProfileCondition } from "@/lib/profile";
import { formatRelativeDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const profileCondition = await getProfileCondition();

  const history = await db
    .select({
      comicId: comics.id,
      comicTitle: comics.title,
      comicNumber: comics.number,
      seriesTitle: series.title,
      seriesId: series.id,
      currentPage: readingProgress.currentPage,
      totalPages: readingProgress.totalPages,
      status: readingProgress.status,
      updatedAt: readingProgress.updatedAt,
    })
    .from(readingProgress)
    .innerJoin(comics, eq(comics.id, readingProgress.comicId))
    .leftJoin(series, eq(series.id, comics.seriesId))
    .where(
      and(
        or(
          eq(readingProgress.status, "reading"),
          eq(readingProgress.status, "read"),
        ),
        profileCondition,
      ),
    )
    .orderBy(desc(readingProgress.updatedAt))
    .limit(50);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        Historique
      </h1>

      {history.length === 0 ? (
        <p className="text-muted-foreground py-20 text-center">Aucune lecture enregistrée.</p>
      ) : (
        <div className="space-y-2">
          {history.map((h) => (
            <Link
              key={h.comicId}
              href={`/read/${h.comicId}`}
              className="flex items-center gap-4 rounded-xl bg-card p-3 hover:bg-muted/50 transition-all cursor-pointer"
            >
              <div className="shrink-0 w-10 aspect-[2/3] overflow-hidden rounded-lg bg-muted">
                <img
                  src={`/api/comics/${h.comicId}/thumbnail`}
                  alt={h.comicTitle}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ fontFamily: "var(--font-display)" }}>
                  {h.seriesTitle ?? h.comicTitle}
                  {h.comicNumber != null && ` #${h.comicNumber}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {h.status === "read" ? "Terminé" : `Page ${h.currentPage}/${h.totalPages}`}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatRelativeDate(h.updatedAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
