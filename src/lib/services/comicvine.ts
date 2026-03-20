import { config } from "@/lib/config";

export interface ComicVineSearchResult {
  id: number;
  name: string;
  description: string | null;
  publisher: { name: string } | null;
  start_year: string | null;
  image: { medium_url: string } | null;
  count_of_issues: number;
}

export interface ComicVineVolume {
  name: string;
  description: string | null;
  publisher: string | null;
  startYear: number | null;
}

const BASE_URL = "https://comicvine.gamespot.com/api";

export function isComicVineConfigured(): boolean {
  return config.comicVineApiKey.length > 0;
}

export async function searchVolumes(
  query: string,
): Promise<ComicVineSearchResult[]> {
  if (!isComicVineConfigured()) return [];

  const url = `${BASE_URL}/search/?api_key=${config.comicVineApiKey}&format=json&resources=volume&query=${encodeURIComponent(query)}&limit=10`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Kyomu Comic Reader" },
  });

  if (!response.ok) return [];

  const data = await response.json();
  return data.results ?? [];
}

export async function getVolumeDetails(
  volumeId: number,
): Promise<ComicVineVolume | null> {
  if (!isComicVineConfigured()) return null;

  const url = `${BASE_URL}/volume/4050-${volumeId}/?api_key=${config.comicVineApiKey}&format=json&field_list=name,description,publisher,start_year`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Kyomu Comic Reader" },
  });

  if (!response.ok) return null;

  const data = await response.json();
  const result = data.results;

  if (!result) return null;

  const cleanDescription = result.description
    ? result.description.replace(/<[^>]*>/g, "").trim()
    : null;

  return {
    name: result.name,
    description: cleanDescription,
    publisher: result.publisher?.name ?? null,
    startYear: result.start_year ? parseInt(result.start_year, 10) : null,
  };
}
