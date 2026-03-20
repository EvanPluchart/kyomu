"use client";

import { useState } from "react";
import { Search, Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComicVineResult {
  id: number;
  name: string;
  description: string | null;
  publisher: { name: string } | null;
  start_year: string | null;
  image: { medium_url: string } | null;
  count_of_issues: number;
  inLibrary: boolean;
}

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ComicVineResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [requesting, setRequesting] = useState<number | null>(null);
  const [requested, setRequested] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    setResults([]);

    const res = await fetch(
      `/api/discover/search?q=${encodeURIComponent(query)}`,
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

  async function handleRequest(comicVineId: number) {
    setRequesting(comicVineId);

    const res = await fetch("/api/discover/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comicVineId }),
    });

    setRequesting(null);

    if (res.ok) {
      setRequested((prev) => new Set([...prev, comicVineId]));
    }
  }

  function stripHtml(html: string | null): string {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Découvrir
        </h1>
        <p className="text-muted-foreground">
          Recherchez des comics sur ComicVine et ajoutez-les à votre
          bibliothèque via Kapowarr.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un comic, une série..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-12 w-full rounded-xl border-0 bg-muted/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-muted transition-all duration-200"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={searching || !query.trim()}
          className="h-12 rounded-xl px-6"
        >
          {searching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Rechercher"
          )}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Résultats */}
      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {results.length} résultats
          </p>
          {results.map((result) => {
            const isInLibrary = result.inLibrary || requested.has(result.id);
            const isRequesting = requesting === result.id;

            return (
              <div
                key={result.id}
                className="flex gap-4 rounded-xl bg-card p-4 transition-all hover:bg-muted/30"
              >
                {/* Couverture */}
                {result.image?.medium_url && (
                  <div className="shrink-0 w-20 aspect-[2/3] overflow-hidden rounded-lg bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.image.medium_url}
                      alt={result.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Informations */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3
                        className="text-lg font-semibold"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {result.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {result.publisher && (
                          <span>{result.publisher.name}</span>
                        )}
                        {result.start_year && (
                          <>
                            <span className="text-border">·</span>
                            <span>{result.start_year}</span>
                          </>
                        )}
                        <span className="text-border">·</span>
                        <span>{result.count_of_issues} numéros</span>
                      </div>
                    </div>

                    {/* Bouton d'action */}
                    {isInLibrary ? (
                      <div className="flex items-center gap-1.5 shrink-0 rounded-xl bg-green-500/10 px-3 py-2 text-sm text-green-500">
                        <Check className="h-4 w-4" />
                        {requested.has(result.id)
                          ? "Ajouté"
                          : "En bibliothèque"}
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleRequest(result.id)}
                        disabled={isRequesting}
                        className="shrink-0 gap-2 rounded-xl"
                      >
                        {isRequesting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        Ajouter
                      </Button>
                    )}
                  </div>

                  {result.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {stripHtml(result.description)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!searching && results.length === 0 && query && !error && (
        <div className="py-12 text-center text-muted-foreground">
          Aucun résultat. Essayez un autre terme de recherche.
        </div>
      )}
    </div>
  );
}
