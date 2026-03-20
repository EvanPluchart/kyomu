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
  const items: RequestItem[] = [];

  // Fetch Kapowarr volumes
  if (config.kapowarrApiKey) {
    try {
      const res = await fetch(
        `${config.kapowarrInternalUrl}/api/volumes?api_key=${config.kapowarrApiKey}`,
      );
      if (res.ok) {
        const data = await res.json();
        for (const v of data.result ?? []) {
          items.push({
            title: v.title,
            year: v.year ? String(v.year) : null,
            backend: "kapowarr",
            status:
              v.issues_downloaded >= v.issue_count
                ? "complete"
                : v.issues_downloaded > 0
                  ? "downloading"
                  : "searching",
            downloaded: v.issues_downloaded ?? 0,
            total: v.issue_count ?? 0,
          });
        }
      }
    } catch {
      // Kapowarr unreachable
    }
  }

  // Fetch Mylar3 volumes
  if (config.mylar3ApiKey) {
    try {
      const res = await fetch(
        `${config.mylar3InternalUrl}/api?apikey=${config.mylar3ApiKey}&cmd=getIndex`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          for (const v of data.data ?? []) {
            items.push({
              title: v.name ?? "Inconnu",
              year: v.year ?? null,
              backend: "mylar3",
              status:
                v.have >= v.total && v.total > 0
                  ? "complete"
                  : (v.have ?? 0) > 0
                    ? "downloading"
                    : "searching",
              downloaded: v.have ?? 0,
              total: v.total ?? 0,
            });
          }
        }
      }
    } catch {
      // Mylar3 unreachable
    }
  }

  return NextResponse.json({ requests: items });
}
