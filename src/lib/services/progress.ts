import { db } from "@/lib/db";
import { readingProgress } from "@/lib/db/schema";
import { eq, and, isNull, type SQL } from "drizzle-orm";

interface ProgressData {
  currentPage: number;
  totalPages: number;
  status: "unread" | "reading" | "read";
  startedAt: string | null;
  completedAt: string | null;
}

function profileFilter(profileId?: number | null): SQL {
  if (profileId != null) {
    return eq(readingProgress.profileId, profileId);
  }
  return isNull(readingProgress.profileId);
}

export async function getProgress(
  comicId: number,
  profileId?: number | null,
): Promise<ProgressData | null> {
  const rows = await db
    .select()
    .from(readingProgress)
    .where(and(eq(readingProgress.comicId, comicId), profileFilter(profileId)))
    .limit(1);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    currentPage: row.currentPage,
    totalPages: row.totalPages,
    status: row.status as "unread" | "reading" | "read",
    startedAt: row.startedAt,
    completedAt: row.completedAt,
  };
}

export async function saveProgress(
  comicId: number,
  currentPage: number,
  totalPages: number,
  profileId?: number | null,
): Promise<void> {
  const now = new Date().toISOString();
  const isLastPage = currentPage >= totalPages - 1;
  const status = isLastPage ? "read" : "reading";

  const existing = await db
    .select()
    .from(readingProgress)
    .where(and(eq(readingProgress.comicId, comicId), profileFilter(profileId)))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(readingProgress).values({
      comicId,
      profileId: profileId ?? null,
      currentPage,
      totalPages,
      status,
      startedAt: now,
      completedAt: isLastPage ? now : null,
      updatedAt: now,
    });
  } else {
    await db
      .update(readingProgress)
      .set({
        currentPage,
        totalPages,
        status,
        completedAt: isLastPage ? now : existing[0].completedAt,
        updatedAt: now,
      })
      .where(
        and(eq(readingProgress.comicId, comicId), profileFilter(profileId)),
      );
  }
}

export async function markAs(
  comicId: number,
  status: "read" | "unread",
  profileId?: number | null,
): Promise<void> {
  const now = new Date().toISOString();
  const condition = and(
    eq(readingProgress.comicId, comicId),
    profileFilter(profileId),
  );

  const existing = await db
    .select()
    .from(readingProgress)
    .where(condition)
    .limit(1);

  if (status === "unread") {
    if (existing.length > 0) {
      await db.delete(readingProgress).where(condition);
    }
    return;
  }

  // Mark as read
  if (existing.length === 0) {
    await db.insert(readingProgress).values({
      comicId,
      profileId: profileId ?? null,
      currentPage: 0,
      totalPages: 0,
      status: "read",
      startedAt: now,
      completedAt: now,
      updatedAt: now,
    });
  } else {
    await db
      .update(readingProgress)
      .set({
        status: "read",
        completedAt: now,
        updatedAt: now,
      })
      .where(condition);
  }
}
