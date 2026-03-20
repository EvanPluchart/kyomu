import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tags, seriesTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const tagId = parseInt(id, 10);

  if (isNaN(tagId)) {
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 },
    );
  }

  // Delete associations first
  await db.delete(seriesTags).where(eq(seriesTags.tagId, tagId));
  await db.delete(tags).where(eq(tags.id, tagId));

  return NextResponse.json({ status: "ok" });
}
