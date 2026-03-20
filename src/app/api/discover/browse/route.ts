import { NextResponse } from "next/server";
import {
  getRecentVolumes,
  getPopularVolumes,
  searchVolumesLarge,
} from "@/lib/services/comicvine";
import { getKapowarrVolumes } from "@/lib/services/kapowarr";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const [recent, popular, batman, spiderman, xmen, starwars, kapowarrIds] =
    await Promise.all([
      getRecentVolumes(),
      getPopularVolumes(),
      searchVolumesLarge("Batman"),
      searchVolumesLarge("Spider-Man"),
      searchVolumesLarge("X-Men"),
      searchVolumesLarge("Star Wars"),
      getKapowarrVolumes(),
    ]);

  function enrich(items: typeof recent) {
    return items.map((r) => ({
      ...r,
      inLibrary: kapowarrIds.includes(r.id),
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
