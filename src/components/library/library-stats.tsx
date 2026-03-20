import { BookOpen, Library, CheckCircle } from "lucide-react";

interface LibraryStatsProps {
  totalSeries: number;
  totalComics: number;
  totalRead: number;
}

export function LibraryStats({ totalSeries, totalComics, totalRead }: LibraryStatsProps) {
  const percentRead = totalComics > 0 ? Math.round((totalRead / totalComics) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex items-center gap-3 rounded-lg bg-blue-500/10 p-3">
        <Library className="h-5 w-5 text-blue-400 shrink-0" />
        <div>
          <p className="text-lg font-bold">{totalSeries}</p>
          <p className="text-xs text-muted-foreground">Séries</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-amber-500/10 p-3">
        <BookOpen className="h-5 w-5 text-amber-400 shrink-0" />
        <div>
          <p className="text-lg font-bold">{totalComics}</p>
          <p className="text-xs text-muted-foreground">Volumes</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-green-500/10 p-3">
        <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
        <div>
          <p className="text-lg font-bold">{percentRead}%</p>
          <p className="text-xs text-muted-foreground">Lus</p>
        </div>
      </div>
    </div>
  );
}
