"use client";

import { useState, useEffect } from "react";
import { Loader2, Download, CheckCircle, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RequestItem {
  title: string;
  year: string | null;
  backend: "kapowarr" | "mylar3";
  status: string;
  downloaded: number;
  total: number;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/requests")
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setRequests(d.requests ?? []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  function loadRequests() {
    setLoading(true);
    fetch("/api/requests")
      .then((r) => r.json())
      .then((d) => setRequests(d.requests ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  const searching = requests.filter((r) => r.status === "searching");
  const downloading = requests.filter((r) => r.status === "downloading");
  const complete = requests.filter((r) => r.status === "complete");

  function StatusIcon({ status }: { status: string }) {
    if (status === "complete") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === "downloading") return <Download className="h-4 w-4 text-primary animate-pulse" />;
    return <Search className="h-4 w-4 text-muted-foreground animate-pulse" />;
  }

  function StatusLabel({ status }: { status: string }) {
    if (status === "complete") return <span className="text-green-500">Complet</span>;
    if (status === "downloading") return <span className="text-primary">En cours</span>;
    return <span className="text-muted-foreground">Recherche</span>;
  }

  function BackendBadge({ backend }: { backend: string }) {
    return (
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
        backend === "mylar3"
          ? "bg-purple-500/10 text-purple-400"
          : "bg-blue-500/10 text-blue-400"
      }`}>
        {backend === "mylar3" ? "Mylar3" : "Kapowarr"}
      </span>
    );
  }

  function RequestRow({ item }: { item: RequestItem }) {
    const progress = item.total > 0
      ? Math.round((item.downloaded / item.total) * 100)
      : 0;

    return (
      <div className="flex items-center gap-4 rounded-xl bg-card p-4">
        <StatusIcon status={item.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate" style={{ fontFamily: "var(--font-display)" }}>
              {item.title}
            </p>
            {item.year && <span className="text-xs text-muted-foreground">({item.year})</span>}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <BackendBadge backend={item.backend} />
            <span className="text-xs text-muted-foreground">
              <StatusLabel status={item.status} />
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-medium tabular-nums">
            {item.downloaded}/{item.total}
          </p>
          {item.total > 0 && (
            <div className="w-16 h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Requêtes
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={loadRequests}
          disabled={loading}
          className="gap-2 rounded-xl cursor-pointer hover:text-foreground"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {loading && requests.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Download className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">Aucune requête en cours.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Searching */}
          {searching.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                En recherche ({searching.length})
              </h2>
              <div className="space-y-2">
                {searching.map((item, i) => (
                  <RequestRow key={`${item.backend}-${item.title}-${i}`} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Downloading */}
          {downloading.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                En téléchargement ({downloading.length})
              </h2>
              <div className="space-y-2">
                {downloading.map((item, i) => (
                  <RequestRow key={`${item.backend}-${item.title}-${i}`} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Complete */}
          {complete.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Terminés ({complete.length})
              </h2>
              <div className="space-y-2">
                {complete.map((item, i) => (
                  <RequestRow key={`${item.backend}-${item.title}-${i}`} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
