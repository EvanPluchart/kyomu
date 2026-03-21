import { NextResponse } from "next/server";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

interface RequestItem {
  title: string;
  year: string | null;
  backend: "kapowarr" | "mylar3";
  status: string;
  downloaded: number;
  total: number;
}

export async function GET(): Promise<NextResponse> {
  const [kapowarrItems, mylar3Items] = await Promise.all([
    // Fetch Kapowarr volumes
    (async (): Promise<RequestItem[]> => {
      if (!config.kapowarrApiKey) return [];
      try {
        const res = await fetch(
          `${config.kapowarrInternalUrl}/api/volumes?api_key=${config.kapowarrApiKey}`,
        );
        if (!res.ok) return [];
        const data = await res.json();
        return (data.result ?? []).map((v: Record<string, unknown>) => ({
          title: v.title as string,
          year: v.year ? String(v.year) : null,
          backend: "kapowarr" as const,
          status:
            (v.issues_downloaded as number) >= (v.issue_count as number)
              ? "complete"
              : (v.issues_downloaded as number) > 0
                ? "downloading"
                : "searching",
          downloaded: (v.issues_downloaded as number) ?? 0,
          total: (v.issue_count as number) ?? 0,
        }));
      } catch {
        return [];
      }
    })(),
    // Fetch Mylar3 volumes
    (async (): Promise<RequestItem[]> => {
      if (!config.mylar3ApiKey) return [];
      try {
        const res = await fetch(
          `${config.mylar3InternalUrl}/api?apikey=${config.mylar3ApiKey}&cmd=getIndex`,
        );
        if (!res.ok) return [];
        const data = await res.json();
        if (!data.success) return [];
        return (data.data ?? []).map((v: Record<string, unknown>) => ({
          title: (v.name as string) ?? "Inconnu",
          year: (v.year as string) ?? null,
          backend: "mylar3" as const,
          status:
            (v.have as number) >= (v.total as number) && (v.total as number) > 0
              ? "complete"
              : ((v.have as number) ?? 0) > 0
                ? "downloading"
                : "searching",
          downloaded: (v.have as number) ?? 0,
          total: (v.total as number) ?? 0,
        }));
      } catch {
        return [];
      }
    })(),
  ]);

  return NextResponse.json({ requests: [...kapowarrItems, ...mylar3Items] });
}
