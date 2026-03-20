import { db } from "@/lib/db";
import { series } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { SeriesGrid } from "@/components/library/series-grid";
import { EmptyState } from "@/components/library/empty-state";

export const dynamic = "force-dynamic";

export default async function SeriesPage() {
  const allSeries = await db
    .select()
    .from(series)
    .orderBy(asc(series.title));

  if (allSeries.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Séries</h1>
      <SeriesGrid series={allSeries} />
    </div>
  );
}
