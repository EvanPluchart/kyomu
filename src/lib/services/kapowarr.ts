import { config } from "@/lib/config";

export function isKapowarrConfigured(): boolean {
  return config.kapowarrApiKey.length > 0;
}

export async function getKapowarrVolumes(): Promise<number[]> {
  if (!isKapowarrConfigured()) return [];

  const url = `${config.kapowarrInternalUrl}/api/volumes?api_key=${config.kapowarrApiKey}`;
  const res = await fetch(url);

  if (!res.ok) return [];

  const data = await res.json();
  return (data.result ?? []).map(
    (v: { comicvine_id: number }) => v.comicvine_id,
  );
}

export async function requestVolume(
  comicVineId: number,
): Promise<{ success: boolean; error?: string }> {
  if (!isKapowarrConfigured()) {
    return { success: false, error: "Kapowarr non configuré" };
  }

  const url = `${config.kapowarrInternalUrl}/api/volumes?api_key=${config.kapowarrApiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comicvine_id: comicVineId, root_folder_id: 1 }),
  });

  const data = await res.json();

  if (data.error) {
    return { success: false, error: data.error };
  }

  return { success: true };
}
