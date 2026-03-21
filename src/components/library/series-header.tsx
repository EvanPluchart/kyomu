import Link from "next/link";
import type { Series } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft } from "lucide-react";
import { ComicVineEnricher } from "@/components/library/comicvine-enricher";
import { MarkAllReadButton } from "@/components/library/mark-all-read-button";

interface SeriesHeaderProps {
  series: Series;
  comicsCount: number;
  continueComicId: number | null;
}

export function SeriesHeader({ series, comicsCount, continueComicId }: SeriesHeaderProps) {
  return (
    <div className="space-y-6">
      <Link
        href="/series"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Séries
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="shrink-0">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={`/api/library/series/${series.id}/thumbnail`}
              alt={series.title}
              className="w-36 sm:w-44 aspect-[2/3] object-cover"
            />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {series.title}
            </h1>
            {series.author && (
              <p className="text-muted-foreground">{series.author}</p>
            )}
          </div>

          {series.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {series.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{comicsCount} {comicsCount > 1 ? "volumes" : "volume"}</span>
            {series.year && (
              <>
                <span className="text-border">·</span>
                <span>{series.year}</span>
              </>
            )}
            {series.publisher && (
              <>
                <span className="text-border">·</span>
                <span>{series.publisher}</span>
              </>
            )}
          </div>

          <Link
            href={`/discover?q=${encodeURIComponent(series.title)}`}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Voir sur ComicVine →
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {continueComicId && (
              <Link href={`/read/${continueComicId}`}>
                <Button className="gap-2 rounded-xl">
                  <BookOpen className="h-4 w-4" />
                  Continuer la lecture
                </Button>
              </Link>
            )}
            <MarkAllReadButton seriesId={series.id} />
            <ComicVineEnricher seriesId={series.id} seriesTitle={series.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
