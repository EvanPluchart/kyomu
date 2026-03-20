"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

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

  // Debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, updateSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Rechercher une série..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
      />
    </div>
  );
}
