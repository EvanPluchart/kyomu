import Link from "next/link";
import type { Series } from "@/lib/db/schema";

interface SeriesCardProps {
  series: Series;
}

export function SeriesCard({ series }: SeriesCardProps) {
  return (
    <Link
      href={`/series/${series.id}`}
      className="group block space-y-3 cover-glow rounded-xl"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted">
        <img
          src={`/api/library/series/${series.id}/thumbnail`}
          alt={series.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
        />
        {/* Subtle vignette */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
      </div>
      <div className="space-y-0.5 px-0.5">
        <h3 className="text-sm font-semibold leading-tight line-clamp-1" style={{ fontFamily: "var(--font-display)" }}>
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
