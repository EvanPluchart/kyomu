export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  getAuthUser,
  verifyPassword,
  generateSessionToken,
  setSessionCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body as { username?: string; password?: string };

  if (!username || !password) {
    return NextResponse.json(
      { error: "Nom d'utilisateur et mot de passe requis" },
      { status: 400 },
    );
  }

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { error: "Aucun compte configuré" },
      { status: 401 },
    );
  }

  if (user.username !== username) {
    return NextResponse.json(
      { error: "Identifiants incorrects" },
      { status: 401 },
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Identifiants incorrects" },
      { status: 401 },
    );
  }

  const sessionToken = generateSessionToken();

  await db
    .update(authUsers)
    .set({ sessionToken })
    .where(eq(authUsers.id, user.id));

  await setSessionCookie(sessionToken);

  return NextResponse.json({ success: true });
}
