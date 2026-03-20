import { NextRequest, NextResponse } from "next/server";
import { searchVolumes } from "@/lib/services/comicvine";
import { getKapowarrVolumes } from "@/lib/services/kapowarr";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "q requis" }, { status: 400 });
  }

  const [results, kapowarrIds] = await Promise.all([
    searchVolumes(query),
    getKapowarrVolumes(),
  ]);

  const enriched = results.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    publisher: r.publisher,
    start_year: r.start_year,
    image: r.image,
    count_of_issues: r.count_of_issues,
    inLibrary: kapowarrIds.includes(r.id),
  }));

  return NextResponse.json({ results: enriched });
}
