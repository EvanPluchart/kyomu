import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getExtractor } from "@/lib/services/extractors/factory";

function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; page: string }> },
): Promise<NextResponse> {
  const { id, page } = await params;
  const comicId = parseInt(id, 10);
  const pageIndex = parseInt(page, 10);

  if (isNaN(comicId) || isNaN(pageIndex)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const rows = await db.select().from(comics).where(eq(comics.id, comicId)).limit(1);
  if (rows.length === 0) {
    return NextResponse.json({ error: "Comic non trouvé" }, { status: 404 });
  }

  const comic = rows[0];
  const extractor = getExtractor(comic.format, comic.filePath);

  try {
    const pages = await extractor.getPageList();
    if (pageIndex < 0 || pageIndex >= pages.length) {
      return NextResponse.json({ error: "Page non trouvée" }, { status: 404 });
    }

    const buffer = await extractor.getPage(pageIndex);
    const contentType = getContentType(pages[pageIndex].filename);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur d'extraction";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await extractor.close();
  }
}
