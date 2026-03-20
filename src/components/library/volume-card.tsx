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

  return (
    <Link
      href={`/read/${comic.id}`}
      className="group block space-y-2"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
        <img
          src={`/api/comics/${comic.id}/thumbnail`}
          alt={comic.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />

        {/* Badge de progression */}
        {isRead && (
          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
        {isReading && comic.currentPage != null && comic.totalPages != null && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 text-xs text-white text-center">
            {comic.currentPage}/{comic.totalPages}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-tight line-clamp-2">
          {comic.number != null ? `#${comic.number} — ` : ""}{comic.title}
        </h3>
      </div>
    </Link>
  );
}
