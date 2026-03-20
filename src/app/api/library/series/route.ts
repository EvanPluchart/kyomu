import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { series, comics, readingProgress } from "@/lib/db/schema";
import { like, or, asc, desc, count, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const SORT_COLUMNS = {
  title: series.title,
  added_at: series.createdAt,
  last_read: series.updatedAt,
} as const;

type SortKey = keyof typeof SORT_COLUMNS;

function isValidSort(value: string): value is SortKey {
  return value in SORT_COLUMNS;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));
  const sortParam = searchParams.get("sort") ?? "title";
  const order = searchParams.get("order") ?? "asc";
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const sort: SortKey = isValidSort(sortParam) ? sortParam : "title";
  const offset = (page - 1) * limit;

  const sortColumn = SORT_COLUMNS[sort];
  const orderFn = order === "desc" ? desc : asc;

  // Build WHERE conditions
  const conditions = [];

  if (q) {
    conditions.push(
      or(
        like(series.title, `%${q}%`),
        like(series.author, `%${q}%`),
      ),
    );
  }

  if (status && ["unread", "reading", "read"].includes(status)) {
    // Filter by status requires a subquery to check readingProgress
    conditions.push(
      sql`${series.id} IN (
        SELECT ${comics.seriesId}
        FROM ${comics}
        LEFT JOIN ${readingProgress} ON ${readingProgress.comicId} = ${comics.id}
        WHERE ${readingProgress.status} = ${status}
      )`,
    );
  }

  const whereClause = conditions.length > 0
    ? conditions.reduce((acc, cond) => sql`${acc} AND ${cond}`)
    : undefined;

  const [dataRows, countRows] = await Promise.all([
    whereClause
      ? db
          .select()
          .from(series)
          .where(whereClause)
          .orderBy(orderFn(sortColumn))
          .limit(limit)
          .offset(offset)
      : db
          .select()
          .from(series)
          .orderBy(orderFn(sortColumn))
          .limit(limit)
          .offset(offset),
    whereClause
      ? db
          .select({ total: count() })
          .from(series)
          .where(whereClause)
      : db
          .select({ total: count() })
          .from(series),
  ]);

  const total = countRows[0]?.total ?? 0;

  return NextResponse.json({
    data: dataRows,
    total,
    page,
    limit,
  });
}
