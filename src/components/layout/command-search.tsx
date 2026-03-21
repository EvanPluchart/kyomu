"use client";

import { useState, useEffect, useRef } from "react";
import { Search, BookOpen, Compass } from "lucide-react";
import { useRouter } from "next/navigation";

interface LocalResult {
  id: number;
  title: string;
  type: "series";
}

export function CommandSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [localResults, setLocalResults] = useState<LocalResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setLocalResults([]);
    }
  }, [open]);

  // Search local library
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setLocalResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/library/series?q=${encodeURIComponent(query)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setLocalResults(
            (data.data ?? []).map((s: { id: number; title: string }) => ({
              id: s.id,
              title: s.title,
              type: "series" as const,
            }))
          );
        }
      } catch {
        /* ignore */
      }
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(result: LocalResult) {
    setOpen(false);
    router.push(`/series/${result.id}`);
  }

  function handleSearchComicVine() {
    setOpen(false);
    router.push(`/discover?q=${encodeURIComponent(query)}`);
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Dialog */}
      <div className="fixed left-1/2 top-[20%] z-[101] w-full max-w-lg -translate-x-1/2">
        <div className="rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher dans la bibliothèque..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 flex-1 bg-transparent text-base placeholder:text-muted-foreground/60 focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results */}
          {query.trim().length >= 2 && (
            <div className="max-h-80 overflow-y-auto p-2">
              {/* Local results */}
              {localResults.length > 0 && (
                <div className="mb-2">
                  <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Bibliothèque
                  </p>
                  {localResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelect(r)}
                      className="w-full cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                    >
                      <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                      {r.title}
                    </button>
                  ))}
                </div>
              )}

              {/* ComicVine search option */}
              <button
                onClick={handleSearchComicVine}
                className="w-full cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors text-left text-primary"
              >
                <Compass className="h-4 w-4 shrink-0" />
                Chercher &ldquo;{query}&rdquo; sur ComicVine
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
