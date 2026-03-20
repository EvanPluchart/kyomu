import { NextRequest, NextResponse } from "next/server";
import { requestVolume, isKapowarrConfigured } from "@/lib/services/kapowarr";
import { requestMylar3Volume, isMylar3Configured } from "@/lib/services/mylar3";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const { comicVineId } = body;

  if (!comicVineId) {
    return NextResponse.json({ error: "comicVineId requis" }, { status: 400 });
  }

  const backends: string[] = [];
  const errors: string[] = [];

  // Send to both backends in parallel — first to download wins
  const promises: Promise<void>[] = [];

  if (isKapowarrConfigured()) {
    promises.push(
      requestVolume(comicVineId).then((result) => {
        if (result.success) {
          backends.push("kapowarr");
        } else {
          errors.push(`Kapowarr: ${result.error}`);
        }
      }),
    );
  }

  if (isMylar3Configured()) {
    promises.push(
      requestMylar3Volume(comicVineId).then((result) => {
        if (result.success) {
          backends.push("mylar3");
        } else {
          errors.push(`Mylar3: ${result.error}`);
        }
      }),
    );
  }

  if (promises.length === 0) {
    return NextResponse.json(
      { error: "Aucun backend de téléchargement configuré" },
      { status: 503 },
    );
  }

  await Promise.allSettled(promises);

  if (backends.length === 0) {
    return NextResponse.json(
      { error: errors.join(", ") || "Échec sur tous les backends" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    status: "ok",
    backends,
    message: `Envoyé à ${backends.join(" + ")}`,
  });
}
