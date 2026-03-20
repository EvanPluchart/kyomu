import { NextRequest, NextResponse } from "next/server";
import { requestVolume, isKapowarrConfigured } from "@/lib/services/kapowarr";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isKapowarrConfigured()) {
    return NextResponse.json(
      { error: "Kapowarr non configuré" },
      { status: 503 },
    );
  }

  const body = await request.json();
  const { comicVineId } = body;

  if (!comicVineId) {
    return NextResponse.json(
      { error: "comicVineId requis" },
      { status: 400 },
    );
  }

  const result = await requestVolume(comicVineId);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ status: "ok" });
}
