"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Check } from "lucide-react";

interface ComicVineResult {
  id: number;
  name: string;
  description: string | null;
  publisher: { name: string } | null;
  start_year: string | null;
  count_of_issues: number;
}

interface ComicVineEnricherProps {
  seriesId: number;
  seriesTitle: string;
}

export function ComicVineEnricher({
  seriesId,
  seriesTitle,
}: ComicVineEnricherProps) {
  const [results, setResults] = useState<ComicVineResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    setSearching(true);
    setError(null);
    const res = await fetch(
      `/api/comicvine/search?q=${encodeURIComponent(seriesTitle)}`,
    );
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur de recherche");
      setSearching(false);
      return;
    }
    const data = await res.json();
    setResults(data.results ?? []);
    setSearching(false);
  }

  async function handleSelect(comicVineId: number) {
    setLoading(true);
    await fetch(`/api/library/series/${seriesId}/metadata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comicVineId }),
    });
    setLoading(false);
    setDone(true);
    setResults([]);
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-500">
        <Check className="h-4 w-4" />
        Métadonnées importées — rechargez la page
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (results.length > 0) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Sélectionnez la série correspondante :
        </p>
        <div className="max-h-60 space-y-1 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r.id)}
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-muted/50 p-2 text-left text-sm transition-colors hover:bg-muted"
            >
              <span className="font-medium">{r.name}</span>
              {r.start_year && (
                <span className="text-muted-foreground">
                  {" "}
                  ({r.start_year})
                </span>
              )}
              {r.publisher && (
                <span className="text-muted-foreground">
                  {" "}
                  — {r.publisher.name}
                </span>
              )}
              <span className="text-muted-foreground">
                {" "}
                · {r.count_of_issues} issues
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSearch}
      disabled={searching}
      className="gap-2 rounded-xl cursor-pointer"
    >
      {searching ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      Enrichir via ComicVine
    </Button>
  );
}
