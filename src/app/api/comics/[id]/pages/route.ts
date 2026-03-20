import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getExtractor } from "@/lib/services/extractors/factory";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const comicId = parseInt(id, 10);

  if (isNaN(comicId)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const rows = await db.select().from(comics).where(eq(comics.id, comicId)).limit(1);
  if (rows.length === 0) {
    return NextResponse.json({ error: "Comic non trouvé" }, { status: 404 });
  }

  const comic = rows[0];
  const extractor = getExtractor(comic.format, comic.filePath);

  try {
    const pageCount = await extractor.getPageCount();
    const pages = await extractor.getPageList();
    return NextResponse.json({ pageCount, pages });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur d'extraction";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await extractor.close();
  }
}
