export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authUsers } from "@/lib/db/schema";
import {
  isAuthConfigured,
  hashPassword,
  generateSessionToken,
  setSessionCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Ne permettre l'inscription que s'il n'y a pas encore de compte
  const configured = await isAuthConfigured();
  if (configured) {
    return NextResponse.json(
      { error: "Un compte existe déjà" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const { username, password } = body as { username?: string; password?: string };

  if (!username || !password) {
    return NextResponse.json(
      { error: "Nom d'utilisateur et mot de passe requis" },
      { status: 400 },
    );
  }

  if (password.length < 4) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 4 caractères" },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(password);
  const sessionToken = generateSessionToken();

  await db.insert(authUsers).values({
    username,
    passwordHash,
    sessionToken,
  });

  await setSessionCookie(sessionToken);

  return NextResponse.json({ success: true });
}
