import Link from "next/link";
import type { Series } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";

interface SeriesHeaderProps {
  series: Series;
  comicsCount: number;
  continueComicId: number | null;
}

export function SeriesHeader({ series, comicsCount, continueComicId }: SeriesHeaderProps) {
  return (
    <div className="space-y-4">
      <Link
        href="/series"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux séries
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="shrink-0">
          <img
            src={`/api/library/series/${series.id}/thumbnail`}
            alt={series.title}
            className="w-32 sm:w-40 aspect-[2/3] rounded-lg object-cover"
          />
        </div>

        <div className="flex-1 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold">{series.title}</h1>

          {series.author && (
            <p className="text-muted-foreground">{series.author}</p>
          )}

          {series.description && (
            <p className="text-sm text-muted-foreground line-clamp-4">{series.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{comicsCount} {comicsCount > 1 ? "volumes" : "volume"}</span>
            {series.year && <span>{series.year}</span>}
            {series.publisher && <span>{series.publisher}</span>}
          </div>

          {continueComicId && (
            <Link href={`/read/${continueComicId}`}>
              <Button className="gap-2">
                <BookOpen className="h-4 w-4" />
                Continuer la lecture
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
