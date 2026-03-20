import { NextResponse } from "next/server";
import {
  getRecentVolumes,
  getPopularVolumes,
  getVolumesByPublisher,
} from "@/lib/services/comicvine";
import { getKapowarrVolumes } from "@/lib/services/kapowarr";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const [recent, popular, dc, marvel, kapowarrIds] = await Promise.all([
    getRecentVolumes(),
    getPopularVolumes(),
    getVolumesByPublisher(10), // DC
    getVolumesByPublisher(31), // Marvel
    getKapowarrVolumes(),
  ]);

  function enrich(items: typeof recent) {
    return items.map((r) => ({
      ...r,
      inLibrary: kapowarrIds.includes(r.id),
    }));
  }

  return NextResponse.json({
    recent: enrich(recent),
    popular: enrich(popular),
    dc: enrich(dc),
    marvel: enrich(marvel),
  });
}
