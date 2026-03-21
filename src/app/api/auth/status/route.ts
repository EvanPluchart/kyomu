export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAuthConfigured, getSessionFromCookie, validateSession } from "@/lib/auth";

export async function GET() {
  const configured = await isAuthConfigured();

  let authenticated = false;
  const token = await getSessionFromCookie();
  if (token) {
    authenticated = await validateSession(token);
  }

  return NextResponse.json({ configured, authenticated });
}
