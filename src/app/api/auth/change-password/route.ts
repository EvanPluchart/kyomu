export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  getAuthUser,
  verifyPassword,
  hashPassword,
  getSessionFromCookie,
  validateSession,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const sessionToken = await getSessionFromCookie();
  if (!sessionToken || !(await validateSession(sessionToken))) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const { currentPassword, newPassword } = body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Mot de passe actuel et nouveau mot de passe requis" },
      { status: 400 },
    );
  }

  if (newPassword.length < 4) {
    return NextResponse.json(
      { error: "Le nouveau mot de passe doit contenir au moins 4 caractères" },
      { status: 400 },
    );
  }

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Aucun compte" }, { status: 404 });
  }

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Mot de passe actuel incorrect" },
      { status: 401 },
    );
  }

  const newHash = await hashPassword(newPassword);
  await db
    .update(authUsers)
    .set({ passwordHash: newHash })
    .where(eq(authUsers.id, user.id));

  return NextResponse.json({ success: true });
}
