import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

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

  if (comic.format === "folder") {
    return NextResponse.json({ error: "Téléchargement non disponible pour les dossiers" }, { status: 400 });
  }

  try {
    const fileBuffer = fs.readFileSync(comic.filePath);
    const filename = path.basename(comic.filePath);
    const contentType = comic.format === "cbz" ? "application/x-cbz" : "application/x-cbr";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }
}
