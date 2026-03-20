import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReaderControlsProps {
  visible: boolean;
  title: string;
  seriesTitle: string;
  seriesId: number;
  currentPage: number;
  totalPages: number;
  children?: ReactNode;
}

export function ReaderControls({
  visible,
  title,
  seriesTitle,
  seriesId,
  currentPage,
  totalPages,
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
          className="shrink-0 p-1 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{title}</p>
          <p className="text-xs text-white/60 truncate">{seriesTitle}</p>
        </div>
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
        <span className="shrink-0 text-sm text-white/60">
          {currentPage + 1} / {totalPages}
        </span>
      </div>
    </div>
  );
}
