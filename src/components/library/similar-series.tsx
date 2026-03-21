"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SimilarVolume {
  id: number;
  name: string;
  publisher: { name: string } | null;
  start_year: string | null;
  image: { medium_url: string } | null;
}

interface SimilarSeriesProps {
  seriesTitle: string;
}

export function SimilarSeries({ seriesTitle }: SimilarSeriesProps) {
  const [results, setResults] = useState<SimilarVolume[]>([]);

  useEffect(() => {
    fetch(`/api/discover/search?q=${encodeURIComponent(seriesTitle)}`)
      .then((r) => r.json())
      .then((d) => setResults((d.results ?? []).slice(0, 6)))
      .catch(() => {});
  }, [seriesTitle]);

  if (results.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        Séries similaires
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {results.map((v) => (
          <Link key={v.id} href={`/discover/${v.id}`} className="group block space-y-1.5">
            <div className="aspect-[2/3] overflow-hidden rounded-xl bg-muted">
              {v.image?.medium_url && (
                <img
                  src={v.image.medium_url}
                  alt={v.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <p className="text-xs font-medium line-clamp-1">{v.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
