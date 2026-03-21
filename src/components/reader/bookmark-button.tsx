"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
}

export function BookmarkButton({ isBookmarked, onToggle }: BookmarkButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`cursor-pointer rounded-md p-1.5 transition-colors ${
        isBookmarked
          ? "bg-primary/20 text-primary"
          : "text-white/60 hover:text-white"
      }`}
      title={isBookmarked ? "Retirer le signet" : "Marquer cette page"}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </button>
  );
}
