"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, ChevronDown, ChevronRight, Filter, X } from "lucide-react";
import Link from "next/link";
import { HorizontalScroll } from "@/components/library/horizontal-scroll";
import { cn } from "@/lib/utils";

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

// ── Catalogue structure ──

interface SubCategory {
  label: string;
  query: string;
}

interface Category {
  label: string;
  icon: string;
  color: string;
  subcategories: SubCategory[];
  genres?: SubCategory[];
}

const CATEGORIES: Category[] = [
  {
    label: "Marvel",
    icon: "🦸",
    color: "#e23636",
    subcategories: [
      { label: "Spider-Man", query: "Spider-Man" },
      { label: "X-Men", query: "X-Men" },
      { label: "Avengers", query: "Avengers" },
      { label: "Iron Man", query: "Iron Man" },
      { label: "Hulk", query: "Hulk" },
      { label: "Captain America", query: "Captain America" },
      { label: "Deadpool", query: "Deadpool" },
      { label: "Thor", query: "Thor" },
      { label: "Wolverine", query: "Wolverine" },
      { label: "Daredevil", query: "Daredevil" },
      { label: "Fantastic Four", query: "Fantastic Four" },
      { label: "Venom", query: "Venom" },
    ],
  },
  {
    label: "DC Comics",
    icon: "🦇",
    color: "#0074e8",
    subcategories: [
      { label: "Batman", query: "Batman" },
      { label: "Superman", query: "Superman" },
      { label: "Flash", query: "Flash" },
      { label: "Wonder Woman", query: "Wonder Woman" },
      { label: "Green Lantern", query: "Green Lantern" },
      { label: "Justice League", query: "Justice League" },
      { label: "Aquaman", query: "Aquaman" },
      { label: "Nightwing", query: "Nightwing" },
      { label: "Harley Quinn", query: "Harley Quinn" },
      { label: "Joker", query: "Joker" },
    ],
  },
  {
    label: "Manga",
    icon: "🇯🇵",
    color: "#ff6b9d",
    subcategories: [
      { label: "Shonen", query: "Shonen Jump" },
      { label: "Seinen", query: "Seinen manga" },
      { label: "Shojo", query: "Shojo manga" },
      { label: "One Piece", query: "One Piece" },
      { label: "Naruto", query: "Naruto" },
      { label: "Dragon Ball", query: "Dragon Ball" },
      { label: "Attack on Titan", query: "Attack on Titan" },
      { label: "My Hero Academia", query: "My Hero Academia" },
      { label: "Demon Slayer", query: "Demon Slayer" },
      { label: "Jujutsu Kaisen", query: "Jujutsu Kaisen" },
    ],
    genres: [
      { label: "Action", query: "manga action" },
      { label: "Horreur", query: "manga horror" },
      { label: "Romance", query: "manga romance" },
      { label: "Fantaisie", query: "manga fantasy" },
      { label: "Sci-Fi", query: "manga science fiction" },
      { label: "Tranche de vie", query: "manga slice of life" },
    ],
  },
  {
    label: "Webtoon",
    icon: "📱",
    color: "#00d564",
    subcategories: [
      { label: "Tower of God", query: "Tower of God" },
      { label: "Solo Leveling", query: "Solo Leveling" },
      { label: "Noblesse", query: "Noblesse" },
      { label: "God of High School", query: "God of High School" },
      { label: "Lookism", query: "Lookism" },
      { label: "UnOrdinary", query: "UnOrdinary" },
    ],
  },
  {
    label: "Indépendants",
    icon: "✨",
    color: "#a855f7",
    subcategories: [
      { label: "Image Comics", query: "Image Comics" },
      { label: "Dark Horse", query: "Dark Horse" },
      { label: "Invincible", query: "Invincible" },
      { label: "The Walking Dead", query: "Walking Dead" },
      { label: "Saga", query: "Saga" },
      { label: "Spawn", query: "Spawn" },
      { label: "Hellboy", query: "Hellboy" },
    ],
  },
];

// ── Components ──

function DiscoverCard({ volume }: { volume: Volume }) {
  return (
    <Link
      href={`/discover/${volume.id}`}
      className="group block space-y-2 cover-glow rounded-xl"
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
        <p className="text-sm font-semibold leading-tight line-clamp-1" style={{ fontFamily: "var(--font-display)" }}>
          {volume.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {volume.publisher?.name ?? ""} {volume.start_year ? `· ${volume.start_year}` : ""}
        </p>
      </div>
    </Link>
  );
}

function DiscoverSection({ title, volumes }: { title: string; volumes: Volume[] }) {
  if (volumes.length === 0) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h2>
      <HorizontalScroll>
        {volumes.map((v) => (
          <div key={v.id} className="shrink-0 w-36 sm:w-40 snap-start">
            <DiscoverCard volume={v} />
          </div>
        ))}
      </HorizontalScroll>
    </section>
  );
}

function Sidebar({
  activeCategory,
  activeSubCategory,
  onSelect,
  onClear,
  mobileSidebarOpen,
  onCloseMobile,
}: {
  activeCategory: string | null;
  activeSubCategory: string | null;
  onSelect: (category: string, sub: SubCategory) => void;
  onClear: () => void;
  mobileSidebarOpen: boolean;
  onCloseMobile: () => void;
}) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(activeCategory);

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-background border-r border-border p-4 overflow-y-auto transition-transform duration-300 md:sticky md:top-20 md:h-auto md:max-h-[calc(100vh-6rem)] md:z-0 md:translate-x-0 md:border-0 md:bg-transparent md:p-0 md:w-56",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h3 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Catégories</h3>
          <button onClick={onCloseMobile} className="cursor-pointer p-1 hover:bg-muted rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {activeCategory && (
          <button
            onClick={onClear}
            className="mb-4 w-full cursor-pointer rounded-lg bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
          >
            ← Toutes les catégories
          </button>
        )}

        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isExpanded = expandedCategory === cat.label;
            const isActive = activeCategory === cat.label;

            return (
              <div key={cat.label}>
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : cat.label)}
                  className={cn(
                    "w-full cursor-pointer flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted/50",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 pl-3" style={{ borderColor: `${cat.color}30` }}>
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub.label}
                        onClick={() => {
                          onSelect(cat.label, sub);
                          onCloseMobile();
                        }}
                        className={cn(
                          "w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-all duration-150",
                          activeSubCategory === sub.label
                            ? "text-primary bg-primary/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                        )}
                      >
                        {sub.label}
                      </button>
                    ))}

                    {cat.genres && (
                      <>
                        <div className="my-2 h-px bg-border" />
                        <p className="px-2.5 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground/60">
                          Genres
                        </p>
                        {cat.genres.map((genre) => (
                          <button
                            key={genre.label}
                            onClick={() => {
                              onSelect(cat.label, genre);
                              onCloseMobile();
                            }}
                            className={cn(
                              "w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-all duration-150",
                              activeSubCategory === genre.label
                                ? "text-primary bg-primary/5"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                            )}
                          >
                            {genre.label}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}

// ── Main page ──

export default function DiscoverPage() {
  const [browse, setBrowse] = useState<{ sections: BrowseSection[] } | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Volume[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingBrowse, setLoadingBrowse] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [categoryResults, setCategoryResults] = useState<Volume[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/discover/browse")
      .then((r) => r.json())
      .then(setBrowse)
      .catch(() => {})
      .finally(() => setLoadingBrowse(false));
  }, []);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    setActiveCategory(null);
    setActiveSubCategory(null);
    const res = await fetch(`/api/discover/search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(data.results ?? []);
    }
    setSearching(false);
  }, [query]);

  async function handleCategorySelect(category: string, sub: SubCategory) {
    setActiveCategory(category);
    setActiveSubCategory(sub.label);
    setQuery("");
    setSearchResults([]);
    setLoadingCategory(true);

    const res = await fetch(`/api/discover/search?q=${encodeURIComponent(sub.query)}`);
    if (res.ok) {
      const data = await res.json();
      setCategoryResults(data.results ?? []);
    }
    setLoadingCategory(false);
  }

  function handleClearCategory() {
    setActiveCategory(null);
    setActiveSubCategory(null);
    setCategoryResults([]);
  }

  const showSearchResults = searchResults.length > 0 || searching;
  const showCategoryResults = activeCategory !== null;
  const showBrowse = !showSearchResults && !showCategoryResults;

  return (
    <div className="animate-fade-in">
      {/* Header + Search */}
      <div className="space-y-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Découvrir
        </h1>

        <div className="flex gap-3">
          {/* Mobile filter button */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex md:hidden items-center justify-center h-14 w-14 shrink-0 rounded-2xl bg-muted/50 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <Filter className="h-5 w-5" />
          </button>

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un comic, manga, webtoon..."
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
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <Sidebar
          activeCategory={activeCategory}
          activeSubCategory={activeSubCategory}
          onSelect={handleCategorySelect}
          onClear={handleClearCategory}
          mobileSidebarOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search results */}
          {showSearchResults && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {searchResults.length} résultats pour &ldquo;{query}&rdquo;
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {searchResults.map((v) => (
                  <DiscoverCard key={v.id} volume={v} />
                ))}
              </div>
            </div>
          )}

          {/* Category results */}
          {showCategoryResults && !showSearchResults && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  {activeSubCategory}
                </h2>
                <span className="text-sm text-muted-foreground">
                  dans {activeCategory}
                </span>
              </div>

              {loadingCategory ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : categoryResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {categoryResults.map((v) => (
                    <DiscoverCard key={v.id} volume={v} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  Aucun résultat trouvé.
                </div>
              )}
            </div>
          )}

          {/* Browse sections (default) */}
          {showBrowse && (
            <>
              {loadingBrowse ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : browse ? (
                <div className="space-y-10">
                  {browse.sections.map((section) => (
                    <DiscoverSection key={section.title} title={section.title} volumes={section.items} />
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
