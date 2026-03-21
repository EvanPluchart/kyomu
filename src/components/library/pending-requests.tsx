"use client";

import { useState, useEffect } from "react";
import { Download, Search, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface RequestItem {
  title: string;
  year: string | null;
  backend: "kapowarr" | "mylar3";
  status: string;
  downloaded: number;
  total: number;
}

export function PendingRequests() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requests")
      .then((r) => r.json())
      .then((d) => setRequests(d.requests ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pending = requests.filter((r) => r.status !== "complete");

  if (loading) return null;
  if (pending.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold tracking-tight flex items-center gap-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <Download className="h-5 w-5 text-primary" />
          En attente ({pending.length})
        </h2>
        <Link
          href="/requests"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Voir tout →
        </Link>
      </div>

      <div className="space-y-2">
        {pending.slice(0, 5).map((item, i) => {
          const progress =
            item.total > 0
              ? Math.round((item.downloaded / item.total) * 100)
              : 0;

          return (
            <div
              key={`${item.backend}-${item.title}-${i}`}
              className="flex items-center gap-3 rounded-xl bg-card p-3"
            >
              {item.status === "downloading" ? (
                <Download className="h-4 w-4 shrink-0 text-primary animate-pulse" />
              ) : (
                <Search className="h-4 w-4 shrink-0 text-muted-foreground animate-pulse" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                      item.backend === "mylar3"
                        ? "bg-purple-500/10 text-purple-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {item.backend === "mylar3" ? "Mylar3" : "Kapowarr"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.status === "downloading" ? "En cours" : "Recherche"}
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs font-medium tabular-nums">
                  {item.downloaded}/{item.total}
                </p>
                {item.total > 0 && (
                  <div className="w-12 h-1 rounded-full bg-muted mt-1 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
