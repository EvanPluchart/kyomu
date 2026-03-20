import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { series } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { generateSeriesFeed } from "@/lib/services/opds";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const baseUrl = new URL(request.url).origin;

  const allSeries = await db
    .select({
      id: series.id,
      title: series.title,
      author: series.author,
      comicsCount: series.comicsCount,
      updatedAt: series.updatedAt,
    })
    .from(series)
    .orderBy(asc(series.title));

  const xml = generateSeriesFeed(baseUrl, allSeries);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
