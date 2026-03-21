import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comics } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const [random] = await db
    .select({ id: comics.id })
    .from(comics)
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!random) {
    return NextResponse.json({ error: "Aucun comic" }, { status: 404 });
  }

  return NextResponse.json({ comicId: random.id });
}
