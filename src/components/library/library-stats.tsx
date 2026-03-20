interface LibraryStatsProps {
  totalSeries: number;
  totalComics: number;
  totalRead: number;
}

export function LibraryStats({ totalSeries, totalComics, totalRead }: LibraryStatsProps) {
  const percentRead = totalComics > 0 ? Math.round((totalRead / totalComics) * 100) : 0;

  return (
    <div className="flex items-center gap-8 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          {totalSeries}
        </span>
        <span>séries</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          {totalComics}
        </span>
        <span>volumes</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          {percentRead}%
        </span>
        <span>lus</span>
      </div>
    </div>
  );
}
