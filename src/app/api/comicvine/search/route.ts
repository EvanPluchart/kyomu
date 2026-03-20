import { NextRequest, NextResponse } from "next/server";
import {
  searchVolumes,
  isComicVineConfigured,
} from "@/lib/services/comicvine";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isComicVineConfigured()) {
    return NextResponse.json(
      { error: "Clé API ComicVine non configurée" },
      { status: 503 },
    );
  }

  const query = request.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json(
      { error: "Le paramètre q est requis" },
      { status: 400 },
    );
  }

  const results = await searchVolumes(query);
  return NextResponse.json({ results });
}
