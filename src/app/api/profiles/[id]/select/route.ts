import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const profileId = parseInt(id, 10);
  if (isNaN(profileId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  // Verify profile exists
  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .limit(1);
  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Profil introuvable" },
      { status: 404 },
    );
  }

  // Check PIN if set
  const profile = rows[0];
  if (profile.pin) {
    const body = await request.json().catch(() => ({}));
    if (body.pin !== profile.pin) {
      return NextResponse.json(
        { error: "PIN incorrect" },
        { status: 403 },
      );
    }
  }

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set("kyomu-profile", String(profileId), {
    path: "/",
    maxAge: 365 * 24 * 60 * 60, // 1 year
    httpOnly: false, // needs to be readable by client
    sameSite: "lax",
  });

  return NextResponse.json({ status: "ok", profile });
}
