import { NextRequest, NextResponse } from "next/server";
import { searchVolumes } from "@/lib/services/comicvine";
import { getKapowarrVolumes } from "@/lib/services/kapowarr";
import { getMylar3Volumes } from "@/lib/services/mylar3";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "q requis" }, { status: 400 });
  }

  const [results, kapowarrIds, mylar3Ids] = await Promise.all([
    searchVolumes(query),
    getKapowarrVolumes(),
    getMylar3Volumes(),
  ]);

  const libraryIds = new Set([...kapowarrIds, ...mylar3Ids]);

  const enriched = results.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    publisher: r.publisher,
    start_year: r.start_year,
    image: r.image,
    count_of_issues: r.count_of_issues,
    inLibrary: libraryIds.has(r.id),
  }));

  return NextResponse.json({ results: enriched });
}
