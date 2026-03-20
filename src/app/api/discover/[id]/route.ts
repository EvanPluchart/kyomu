import { NextRequest, NextResponse } from "next/server";
import { getFullVolumeDetails } from "@/lib/services/comicvine";
import { getKapowarrVolumes } from "@/lib/services/kapowarr";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const volumeId = parseInt(id, 10);
  if (isNaN(volumeId)) {
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 },
    );
  }

  const [volume, kapowarrIds] = await Promise.all([
    getFullVolumeDetails(volumeId),
    getKapowarrVolumes(),
  ]);

  if (!volume) {
    return NextResponse.json(
      { error: "Volume non trouvé" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    volume: {
      ...volume,
      description: volume.description
        ? volume.description.replace(/<[^>]*>/g, "").trim()
        : null,
      inLibrary: kapowarrIds.includes(volume.id),
    },
  });
}
