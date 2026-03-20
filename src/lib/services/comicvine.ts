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

export async function getRecentVolumes(): Promise<ComicVineSearchResult[]> {
  if (!isComicVineConfigured()) return [];
  const url = `${BASE_URL}/volumes/?api_key=${config.comicVineApiKey}&format=json&sort=date_added:desc&limit=20&field_list=id,name,description,publisher,start_year,image,count_of_issues`;
  const response = await fetch(url, {
    headers: { "User-Agent": "Kyomu Comic Reader" },
    next: { revalidate: 3600 },
  });
  if (!response.ok) return [];
  const data = await response.json();
  return data.results ?? [];
}

export async function getPopularVolumes(): Promise<ComicVineSearchResult[]> {
  if (!isComicVineConfigured()) return [];
  const url = `${BASE_URL}/volumes/?api_key=${config.comicVineApiKey}&format=json&sort=count_of_issues:desc&limit=20&field_list=id,name,description,publisher,start_year,image,count_of_issues`;
  const response = await fetch(url, {
    headers: { "User-Agent": "Kyomu Comic Reader" },
    next: { revalidate: 3600 },
  });
  if (!response.ok) return [];
  const data = await response.json();
  return data.results ?? [];
}

export async function searchVolumesLarge(
  query: string,
): Promise<ComicVineSearchResult[]> {
  if (!isComicVineConfigured()) return [];
  const url = `${BASE_URL}/search/?api_key=${config.comicVineApiKey}&format=json&resources=volume&query=${encodeURIComponent(query)}&limit=20&field_list=id,name,description,publisher,start_year,image,count_of_issues`;
  const response = await fetch(url, {
    headers: { "User-Agent": "Kyomu Comic Reader" },
    next: { revalidate: 3600 },
  });
  if (!response.ok) return [];
  const data = await response.json();
  return data.results ?? [];
}

export async function getFullVolumeDetails(volumeId: number): Promise<{
  id: number;
  name: string;
  description: string | null;
  publisher: { name: string } | null;
  start_year: string | null;
  image: { medium_url: string; super_url: string } | null;
  count_of_issues: number;
  first_issue: {
    id: number;
    name: string;
    issue_number: string;
  } | null;
  last_issue: { id: number; name: string; issue_number: string } | null;
  characters: { id: number; name: string }[] | null;
} | null> {
  if (!isComicVineConfigured()) return null;
  const url = `${BASE_URL}/volume/4050-${volumeId}/?api_key=${config.comicVineApiKey}&format=json`;
  const response = await fetch(url, {
    headers: { "User-Agent": "Kyomu Comic Reader" },
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.results ?? null;
}
