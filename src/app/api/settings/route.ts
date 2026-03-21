import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { series, comics, readingProgress } from "@/lib/db/schema";
import { count, eq, and, isNull } from "drizzle-orm";
import { config } from "@/lib/config";
import { getActiveProfileId } from "@/lib/profile";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
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

  return NextResponse.json({
    config: {
      comicsPath: config.comicsPath,
      scanIntervalMinutes: config.scanIntervalMinutes,
      kapowarrUrl: config.kapowarrUrl,
      mylar3Url: config.mylar3Url,
      comicVineConfigured: config.comicVineApiKey.length > 0,
      kapowarrConfigured: config.kapowarrApiKey.length > 0,
      mylar3Configured: config.mylar3ApiKey.length > 0,
    },
    stats: {
      series: seriesCount.total,
      comics: comicsCount.total,
      read: readCount.total,
    },
    version: "0.1.0",
  });
}
