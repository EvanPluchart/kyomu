import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { series } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  getVolumeDetails,
  isComicVineConfigured,
} from "@/lib/services/comicvine";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const seriesId = parseInt(id, 10);

  if (isNaN(seriesId)) {
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 },
    );
  }

  if (!isComicVineConfigured()) {
    return NextResponse.json(
      { error: "Clé API ComicVine non configurée" },
      { status: 503 },
    );
  }

  const body = await request.json();
  const { comicVineId } = body;

  if (!comicVineId || typeof comicVineId !== "number") {
    return NextResponse.json(
      { error: "comicVineId requis" },
      { status: 400 },
    );
  }

  const volume = await getVolumeDetails(comicVineId);
  if (!volume) {
    return NextResponse.json(
      { error: "Volume non trouvé sur ComicVine" },
      { status: 404 },
    );
  }

  await db
    .update(series)
    .set({
      description: volume.description,
      publisher: volume.publisher,
      year: volume.startYear,
    })
    .where(eq(series.id, seriesId));

  return NextResponse.json({ status: "ok", metadata: volume });
}
