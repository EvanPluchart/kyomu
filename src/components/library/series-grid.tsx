import type { Series } from "@/lib/db/schema";
import { SeriesCard } from "@/components/library/series-card";

interface SeriesGridProps {
  series: Series[];
}

export function SeriesGrid({ series }: SeriesGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {series.map((s) => (
        <SeriesCard key={s.id} series={s} />
      ))}
    </div>
  );
}
