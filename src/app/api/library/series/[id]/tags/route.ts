import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tags, seriesTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const seriesId = parseInt(id, 10);

  if (isNaN(seriesId)) {
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 },
    );
  }

  const result = await db
    .select({
      id: tags.id,
      name: tags.name,
      color: tags.color,
    })
    .from(seriesTags)
    .innerJoin(tags, eq(tags.id, seriesTags.tagId))
    .where(eq(seriesTags.seriesId, seriesId));

  return NextResponse.json({ tags: result });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const seriesId = parseInt(id, 10);

  if (isNaN(seriesId)) {
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 },
    );
  }

  const body = await request.json();
  const { tagIds } = body;

  if (!Array.isArray(tagIds)) {
    return NextResponse.json(
      { error: "tagIds doit être un tableau" },
      { status: 400 },
    );
  }

  // Delete existing, insert new
  await db.delete(seriesTags).where(eq(seriesTags.seriesId, seriesId));

  if (tagIds.length > 0) {
    await db
      .insert(seriesTags)
      .values(tagIds.map((tagId: number) => ({ seriesId, tagId })));
  }

  return NextResponse.json({ status: "ok" });
}
