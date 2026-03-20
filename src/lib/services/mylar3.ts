import { config } from "@/lib/config";

export function isMylar3Configured(): boolean {
  return config.mylar3ApiKey.length > 0;
}

export async function getMylar3Volumes(): Promise<number[]> {
  if (!isMylar3Configured()) return [];

  const url = `${config.mylar3InternalUrl}/api?apikey=${config.mylar3ApiKey}&cmd=getIndex`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.success) return [];
    return (data.data ?? []).map(
      (v: { id: string }) => parseInt(v.id, 10),
    ).filter((id: number) => !isNaN(id));
  } catch {
    return [];
  }
}

export async function requestMylar3Volume(
  comicVineId: number,
): Promise<{ success: boolean; error?: string }> {
  if (!isMylar3Configured()) {
    return { success: false, error: "Mylar3 non configuré" };
  }

  const url = `${config.mylar3InternalUrl}/api?apikey=${config.mylar3ApiKey}&cmd=addComic&id=${comicVineId}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.success) {
      return { success: false, error: data.error?.message ?? "Erreur Mylar3" };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
