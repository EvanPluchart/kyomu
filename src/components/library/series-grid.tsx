import type { Series } from "@/lib/db/schema";
import { SeriesCard } from "@/components/library/series-card";

interface SeriesGridProps {
  series: Series[];
}

export function SeriesGrid({ series }: SeriesGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {series.map((s, i) => (
        <div
          key={s.id}
          className="animate-slide-up"
          style={{ animationDelay: `${Math.min(i * 50, 300)}ms`, animationFillMode: "both" }}
        >
          <SeriesCard series={s} />
        </div>
      ))}
    </div>
  );
}
