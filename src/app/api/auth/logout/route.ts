export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  getAuthUser,
  getSessionFromCookie,
  validateSession,
  clearSessionCookie,
} from "@/lib/auth";

export async function POST() {
  const token = await getSessionFromCookie();
  if (token) {
    const valid = await validateSession(token);
    if (valid) {
      const user = await getAuthUser();
      if (user) {
        await db
          .update(authUsers)
          .set({ sessionToken: null })
          .where(eq(authUsers.id, user.id));
      }
    }
  }

  await clearSessionCookie();

  return NextResponse.json({ success: true });
}
