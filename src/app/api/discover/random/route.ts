import { NextResponse } from "next/server";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  if (!config.comicVineApiKey) {
    return NextResponse.json({ error: "ComicVine non configuré" }, { status: 503 });
  }

  // Get a random volume by picking a random offset
  const randomOffset = Math.floor(Math.random() * 5000);
  const url = `https://comicvine.gamespot.com/api/volumes/?api_key=${config.comicVineApiKey}&format=json&sort=count_of_issues:desc&offset=${randomOffset}&limit=1&field_list=id,name,description,publisher,start_year,image,count_of_issues`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Kyomu Comic Reader" },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Erreur ComicVine" }, { status: 502 });
  }

  const data = await response.json();
  const result = data.results?.[0];

  if (!result) {
    return NextResponse.json({ error: "Aucun résultat" }, { status: 404 });
  }

  return NextResponse.json({ volume: result });
}
