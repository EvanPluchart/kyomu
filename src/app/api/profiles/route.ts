import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const all = await db.select().from(profiles);
  return NextResponse.json({ profiles: all });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const { name, color, pin } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
  }

  // Max 6 profiles
  const existing = await db.select().from(profiles);
  if (existing.length >= 6) {
    return NextResponse.json(
      { error: "Maximum 6 profils" },
      { status: 400 },
    );
  }

  const [created] = await db
    .insert(profiles)
    .values({
      name: name.trim(),
      color: color ?? "#e8a030",
      pin: pin ?? null,
    })
    .returning();

  return NextResponse.json({ profile: created }, { status: 201 });
}
