import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const allTags = await db
    .select({
      id: tags.id,
      name: tags.name,
      color: tags.color,
      seriesCount:
        sql<number>`(SELECT COUNT(*) FROM series_tags WHERE series_tags.tag_id = tags.id)`,
    })
    .from(tags);

  return NextResponse.json({ tags: allTags });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const { name, color } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
  }

  const inserted = await db
    .insert(tags)
    .values({ name: name.trim(), color: color ?? "#e8a030" })
    .returning();

  return NextResponse.json({ tag: inserted[0] }, { status: 201 });
}
