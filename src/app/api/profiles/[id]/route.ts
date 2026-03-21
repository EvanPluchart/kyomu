import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { profiles, readingProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const profileId = parseInt(id, 10);
  if (isNaN(profileId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const body = await request.json();
  const { name, color, pin } = body;

  await db
    .update(profiles)
    .set({
      ...(name !== undefined && { name: name.trim() }),
      ...(color !== undefined && { color }),
      ...(pin !== undefined && { pin: pin || null }),
    })
    .where(eq(profiles.id, profileId));

  return NextResponse.json({ status: "ok" });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const profileId = parseInt(id, 10);
  if (isNaN(profileId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  // Delete reading progress for this profile
  await db
    .delete(readingProgress)
    .where(eq(readingProgress.profileId, profileId));
  await db.delete(profiles).where(eq(profiles.id, profileId));

  return NextResponse.json({ status: "ok" });
}
