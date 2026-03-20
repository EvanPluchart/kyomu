import { db } from "@/lib/db";
import { series, comics, readingProgress } from "@/lib/db/schema";
import { asc, eq, desc } from "drizzle-orm";
import { KioskView } from "@/components/kiosk/kiosk-view";

export const dynamic = "force-dynamic";

export default async function KioskPage() {
  const allSeries = await db
    .select()
    .from(series)
    .orderBy(asc(series.title));

  // Get in-progress comics for the "continue" section
  const inProgress = await db
    .select({
      comicId: comics.id,
      comicTitle: comics.title,
      comicNumber: comics.number,
      seriesTitle: series.title,
      currentPage: readingProgress.currentPage,
      totalPages: readingProgress.totalPages,
    })
    .from(readingProgress)
    .innerJoin(comics, eq(comics.id, readingProgress.comicId))
    .leftJoin(series, eq(series.id, comics.seriesId))
    .where(eq(readingProgress.status, "reading"))
    .orderBy(desc(readingProgress.updatedAt))
    .limit(5);

  return <KioskView series={allSeries} inProgress={inProgress} />;
}
