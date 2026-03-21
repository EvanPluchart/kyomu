import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comics, readingProgress } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getActiveProfileId } from "@/lib/profile";
import { getProfileCondition } from "@/lib/profile";

export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const seriesId = parseInt(id, 10);
  if (isNaN(seriesId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  const profileId = await getActiveProfileId();
  const profileCondition = await getProfileCondition();
  const now = new Date().toISOString();

  // Get all comics for this series
  const seriesComics = await db.select({ id: comics.id }).from(comics).where(eq(comics.seriesId, seriesId));

  // Get existing progress for these comics in a single query
  const comicIds = seriesComics.map((c) => c.id);
  const existingProgress = comicIds.length > 0
    ? await db
        .select()
        .from(readingProgress)
        .where(
          and(
            sql`${readingProgress.comicId} IN (${sql.join(comicIds.map((id) => sql`${id}`), sql`, `)})`,
            profileCondition,
          ),
        )
    : [];

  const existingMap = new Map(existingProgress.map((p) => [p.comicId, p]));

  for (const comic of seriesComics) {
    const existing = existingMap.get(comic.id);
    if (existing) {
      await db
        .update(readingProgress)
        .set({
          status: "read",
          completedAt: now,
          updatedAt: now,
        })
        .where(eq(readingProgress.id, existing.id));
    } else {
      await db.insert(readingProgress).values({
        comicId: comic.id,
        profileId,
        currentPage: 0,
        totalPages: 0,
        status: "read",
        startedAt: now,
        completedAt: now,
        updatedAt: now,
      });
    }
  }

  return NextResponse.json({ status: "ok", marked: seriesComics.length });
}
