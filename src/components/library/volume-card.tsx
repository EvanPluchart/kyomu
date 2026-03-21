"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, BookOpen } from "lucide-react";
import { calculateProgress } from "@/lib/utils";

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
  const router = useRouter();
  const isRead = comic.status === "read";
  const isReading = comic.status === "reading";
  const progress =
    isReading && comic.currentPage != null && comic.totalPages != null
      ? calculateProgress(comic.currentPage, comic.totalPages)
      : 0;

  async function handleToggleRead(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = isRead ? "unread" : "read";
    await fetch(`/api/comics/${comic.id}/progress`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

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

        {/* Toggle read/unread */}
        <button
          onClick={handleToggleRead}
          className={`absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
            isRead
              ? "bg-green-500 hover:bg-red-500/80"
              : "bg-black/50 opacity-0 group-hover:opacity-100 hover:bg-green-500"
          }`}
          title={isRead ? "Marquer comme non lu" : "Marquer comme lu"}
        >
          {isRead ? (
            <Check className="h-4 w-4 text-white" />
          ) : (
            <BookOpen className="h-3.5 w-3.5 text-white" />
          )}
        </button>

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
