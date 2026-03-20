import { NextRequest, NextResponse } from "next/server";
import { requestVolume, isKapowarrConfigured } from "@/lib/services/kapowarr";
import { requestMylar3Volume, isMylar3Configured } from "@/lib/services/mylar3";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const { comicVineId, backend } = body;

  if (!comicVineId) {
    return NextResponse.json({ error: "comicVineId requis" }, { status: 400 });
  }

  // If a specific backend is requested, use it
  if (backend === "mylar3") {
    if (!isMylar3Configured()) {
      return NextResponse.json({ error: "Mylar3 non configuré" }, { status: 503 });
    }
    const result = await requestMylar3Volume(comicVineId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ status: "ok", backend: "mylar3" });
  }

  if (backend === "kapowarr") {
    if (!isKapowarrConfigured()) {
      return NextResponse.json({ error: "Kapowarr non configuré" }, { status: 503 });
    }
    const result = await requestVolume(comicVineId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ status: "ok", backend: "kapowarr" });
  }

  // Auto: try Kapowarr first, then Mylar3
  if (isKapowarrConfigured()) {
    const result = await requestVolume(comicVineId);
    if (result.success) {
      return NextResponse.json({ status: "ok", backend: "kapowarr" });
    }
  }

  if (isMylar3Configured()) {
    const result = await requestMylar3Volume(comicVineId);
    if (result.success) {
      return NextResponse.json({ status: "ok", backend: "mylar3" });
    }
  }

  return NextResponse.json(
    { error: "Aucun backend de téléchargement configuré" },
    { status: 503 },
  );
}
