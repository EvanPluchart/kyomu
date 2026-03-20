"use client";

import { useState } from "react";
import Link from "next/link";
import type { Series } from "@/lib/db/schema";

interface InProgressComic {
  comicId: number;
  comicTitle: string;
  comicNumber: number | null;
  seriesTitle: string | null;
  currentPage: number;
  totalPages: number;
}

interface KioskViewProps {
  series: Series[];
  inProgress: InProgressComic[];
}

export function KioskView({ series, inProgress }: KioskViewProps) {
  const [mode, setMode] = useState<"series" | "continue">("series");

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Minimal header */}
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="text-primary">虚</span> Kyomu
        </h1>

        <div className="flex items-center gap-4">
          {inProgress.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => setMode("series")}
                className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  mode === "series"
                    ? "bg-primary text-primary-foreground"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Séries
              </button>
              <button
                onClick={() => setMode("continue")}
                className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  mode === "continue"
                    ? "bg-primary text-primary-foreground"
                    : "text-white/60 hover:text-white"
                }`}
              >
                En cours
              </button>
            </div>
          )}
          <Link
            href="/"
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            Quitter
          </Link>
        </div>
      </div>

      {/* Content */}
      {mode === "series" ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {series.map((s, i) => (
            <Link
              key={s.id}
              href={`/series/${s.id}`}
              className="group block animate-fade-in"
              style={{ animationDelay: `${Math.min(i * 30, 500)}ms`, animationFillMode: "both" }}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/5">
                <img
                  src={`/api/library/series/${s.id}/thumbnail`}
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                {/* Title overlay on hover */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                  <div>
                    <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                      {s.title}
                    </p>
                    <p className="text-sm text-white/60">
                      {s.comicsCount} {(s.comicsCount ?? 0) > 1 ? "volumes" : "volume"}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {inProgress.map((comic) => {
            const progress = comic.totalPages > 0
              ? Math.round((comic.currentPage / comic.totalPages) * 100)
              : 0;

            return (
              <Link
                key={comic.comicId}
                href={`/read/${comic.comicId}`}
                className="group block space-y-3 animate-fade-in"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/5">
                  <img
                    src={`/api/comics/${comic.comicId}/thumbnail`}
                    alt={comic.comicTitle}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
                    <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                    {comic.seriesTitle}
                    {comic.comicNumber != null && ` #${comic.comicNumber}`}
                  </p>
                  <p className="text-sm text-white/40">{progress}%</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
