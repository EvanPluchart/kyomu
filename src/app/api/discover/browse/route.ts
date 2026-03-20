import { NextResponse } from "next/server";
import {
  getRecentVolumes,
  getPopularVolumes,
  searchVolumesLarge,
} from "@/lib/services/comicvine";
import { getKapowarrVolumes } from "@/lib/services/kapowarr";
import { getMylar3Volumes } from "@/lib/services/mylar3";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const [recent, popular, batman, spiderman, xmen, starwars, kapowarrIds, mylar3Ids] =
    await Promise.all([
      getRecentVolumes(),
      getPopularVolumes(),
      searchVolumesLarge("Batman"),
      searchVolumesLarge("Spider-Man"),
      searchVolumesLarge("X-Men"),
      searchVolumesLarge("Star Wars"),
      getKapowarrVolumes(),
      getMylar3Volumes(),
    ]);

  const libraryIds = new Set([...kapowarrIds, ...mylar3Ids]);

  function enrich(items: typeof recent) {
    return items.map((r) => ({
      ...r,
      inLibrary: libraryIds.has(r.id),
    }));
  }

  return NextResponse.json({
    sections: [
      { title: "Récemment ajoutés", items: enrich(recent) },
      { title: "Les plus populaires", items: enrich(popular) },
      { title: "Batman", items: enrich(batman) },
      { title: "Spider-Man", items: enrich(spiderman) },
      { title: "X-Men", items: enrich(xmen) },
      { title: "Star Wars", items: enrich(starwars) },
    ],
  });
}
