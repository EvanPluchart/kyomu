import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "kyomu-profile";

export async function getActiveProfileId(): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie?.value) return null;
    const id = parseInt(cookie.value, 10);
    return isNaN(id) ? null : id;
  } catch {
    return null;
  }
}

export async function getActiveProfile(): Promise<{
  id: number;
  name: string;
  color: string;
  theme: string;
  accent: string;
} | null> {
  const id = await getActiveProfileId();
  if (id === null) return null;

  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function ensureDefaultProfile(): Promise<number> {
  const all = await db.select().from(profiles).limit(1);
  if (all.length > 0) return all[0].id;

  const [created] = await db
    .insert(profiles)
    .values({ name: "Par défaut", color: "#e8a030" })
    .returning({ id: profiles.id });
  return created.id;
}
