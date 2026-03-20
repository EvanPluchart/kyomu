import Link from "next/link";
import type { Series } from "@/lib/db/schema";

interface SeriesCardProps {
  series: Series;
}

export function SeriesCard({ series }: SeriesCardProps) {
  return (
    <Link
      href={`/series/${series.id}`}
      className="group block space-y-2"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
        <img
          src={`/api/library/series/${series.id}/thumbnail`}
          alt={series.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-tight line-clamp-2">
          {series.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {series.comicsCount ?? 0}{" "}
          {(series.comicsCount ?? 0) > 1 ? "volumes" : "volume"}
        </p>
      </div>
    </Link>
  );
}
