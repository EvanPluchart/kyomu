"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const updateSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, updateSearch]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  }

  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Rechercher..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleInputKeyDown}
        className="h-10 w-full rounded-xl border-0 bg-muted/50 px-10 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-muted transition-all duration-200"
      />
      <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none select-none rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
        /
      </kbd>
    </div>
  );
}
