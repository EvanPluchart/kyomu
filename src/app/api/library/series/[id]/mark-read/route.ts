import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comics, readingProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getActiveProfileId } from "@/lib/profile";

export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const seriesId = parseInt(id, 10);
  if (isNaN(seriesId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  const profileId = await getActiveProfileId();
  const now = new Date().toISOString();

  // Get all comics for this series
  const seriesComics = await db.select({ id: comics.id }).from(comics).where(eq(comics.seriesId, seriesId));

  for (const comic of seriesComics) {
    // Upsert progress as "read"
    const existing = await db
      .select()
      .from(readingProgress)
      .where(eq(readingProgress.comicId, comic.id))
      .limit(1);

    // Filter by profile
    const match = existing.find((e) =>
      profileId != null ? e.profileId === profileId : e.profileId === null,
    );

    if (match) {
      await db
        .update(readingProgress)
        .set({
          status: "read",
          completedAt: now,
          updatedAt: now,
        })
        .where(eq(readingProgress.id, match.id));
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
