import Link from "next/link";
import { Check } from "lucide-react";

interface VolumeCardProps {
  comic: {
    id: number;
    title: string;
    number: number | null;
    currentPage: number | null;
    totalPages: number | null;
    status: string | null;
  };
}

export function VolumeCard({ comic }: VolumeCardProps) {
  const isRead = comic.status === "read";
  const isReading = comic.status === "reading";
  const progress =
    isReading && comic.currentPage != null && comic.totalPages != null && comic.totalPages > 0
      ? Math.round((comic.currentPage / comic.totalPages) * 100)
      : 0;

  return (
    <Link
      href={`/read/${comic.id}`}
      className="group block space-y-2 cover-glow rounded-xl"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted">
        <img
          src={`/api/comics/${comic.id}/thumbnail`}
          alt={comic.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />

        {isRead && (
          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow-lg">
            <Check className="h-3.5 w-3.5 text-white" />
          </div>
        )}
        {isReading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="px-0.5">
        <h3 className="text-sm font-medium leading-tight line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>
          {comic.number != null ? `#${comic.number}` : comic.title}
        </h3>
      </div>
    </Link>
  );
}
