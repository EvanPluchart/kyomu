"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { HorizontalScroll } from "@/components/library/horizontal-scroll";

interface Volume {
  id: number;
  name: string;
  publisher: { name: string } | null;
  start_year: string | null;
  image: { medium_url: string } | null;
  count_of_issues: number;
  inLibrary: boolean;
}

interface BrowseSection {
  title: string;
  items: Volume[];
}

interface BrowseData {
  sections: BrowseSection[];
}

function DiscoverCard({ volume }: { volume: Volume }) {
  return (
    <Link
      href={`/discover/${volume.id}`}
      className="group shrink-0 w-36 sm:w-40 space-y-2 snap-start cover-glow rounded-xl"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted">
        {volume.image?.medium_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={volume.image.medium_url}
            alt={volume.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
            Pas d&apos;image
          </div>
        )}
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
        {volume.inLibrary && (
          <div className="absolute top-2 left-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-medium text-white shadow">
            En bibliothèque
          </div>
        )}
      </div>
      <div className="px-0.5">
        <p
          className="text-sm font-semibold leading-tight line-clamp-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {volume.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {volume.publisher?.name ?? ""}{" "}
          {volume.start_year ? `· ${volume.start_year}` : ""}
        </p>
      </div>
    </Link>
  );
}

function DiscoverSection({
  title,
  volumes,
}: {
  title: string;
  volumes: Volume[];
}) {
  if (volumes.length === 0) return null;
  return (
    <section className="space-y-4">
      <h2
        className="text-lg font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <HorizontalScroll>
        {volumes.map((v) => (
          <DiscoverCard key={v.id} volume={v} />
        ))}
      </HorizontalScroll>
    </section>
  );
}

export default function DiscoverPage() {
  const [browse, setBrowse] = useState<BrowseData | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Volume[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingBrowse, setLoadingBrowse] = useState(true);

  // Load browse data on mount
  useEffect(() => {
    fetch("/api/discover/browse")
      .then((r) => r.json())
      .then(setBrowse)
      .catch(() => {})
      .finally(() => setLoadingBrowse(false));
  }, []);

  async function handleSearch() {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const res = await fetch(
      `/api/discover/search?q=${encodeURIComponent(query)}`,
    );
    if (res.ok) {
      const data = await res.json();
      setSearchResults(data.results ?? []);
    }
    setSearching(false);
  }

  const showSearchResults = searchResults.length > 0 || searching;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header + Search */}
      <div className="space-y-6">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Découvrir
        </h1>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un comic..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value.trim()) setSearchResults([]);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-14 w-full rounded-2xl border-0 bg-muted/50 pl-12 pr-4 text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-muted transition-all duration-200"
          />
          {searching && (
            <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Search results */}
      {showSearchResults ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {searchResults.map((v) => (
            <DiscoverCard key={v.id} volume={v} />
          ))}
        </div>
      ) : loadingBrowse ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : browse ? (
        /* Browse sections — Netflix style */
        <>
          {browse.sections.map((section) => (
            <DiscoverSection
              key={section.title}
              title={section.title}
              volumes={section.items}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}
