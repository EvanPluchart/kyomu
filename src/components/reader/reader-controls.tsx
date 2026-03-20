import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReaderControlsProps {
  visible: boolean;
  title: string;
  seriesTitle: string;
  seriesId: number;
  currentPage: number;
  totalPages: number;
  onFullscreen?: () => void;
  children?: ReactNode;
}

export function ReaderControls({
  visible,
  title,
  seriesTitle,
  seriesId,
  currentPage,
  totalPages,
  onFullscreen,
  children,
}: ReaderControlsProps) {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent px-4 py-3 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div className="flex items-center gap-3">
        <Link
          href={`/series/${seriesId}`}
          className="shrink-0 p-2 -m-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{title}</p>
          <p className="text-xs text-white/60 truncate">{seriesTitle}</p>
        </div>
        {children && (
          <div className="flex items-center gap-1.5">
            {children}
          </div>
        )}
        {onFullscreen && (
          <button
            onClick={onFullscreen}
            className="cursor-pointer shrink-0 p-2 -m-1 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            title="Plein écran (F)"
          >
            <Maximize className="h-4 w-4" />
          </button>
        )}
        <span className="shrink-0 text-sm text-white/60 tabular-nums">
          {currentPage + 1} / {totalPages}
        </span>
      </div>
    </div>
  );
}
