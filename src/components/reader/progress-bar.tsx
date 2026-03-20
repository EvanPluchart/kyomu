"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visible: boolean;
}

export function ProgressBar({
  currentPage,
  totalPages,
  onPageChange,
  visible,
}: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [previewPage, setPreviewPage] = useState<number | null>(null);
  const progress = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0;
  const displayPage = previewPage ?? currentPage;
  const displayProgress = totalPages > 0 ? ((displayPage + 1) / totalPages) * 100 : 0;

  function getPageFromEvent(clientX: number): number {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    return Math.floor(percentage * totalPages);
  }

  function handlePointerDown(e: React.PointerEvent) {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const page = getPageFromEvent(e.clientX);
    setPreviewPage(page);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const page = getPageFromEvent(e.clientX);
    setPreviewPage(page);
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!dragging) return;
    setDragging(false);
    const page = getPageFromEvent(e.clientX);
    onPageChange(Math.max(0, Math.min(page, totalPages - 1)));
    setPreviewPage(null);
  }

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 z-50 transition-opacity duration-300",
        visible || dragging ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div className="px-4 pb-3">
        {/* Page indicator while dragging */}
        {dragging && previewPage != null && (
          <div className="text-center text-xs text-white/80 mb-1 tabular-nums">
            Page {previewPage + 1} / {totalPages}
          </div>
        )}

        <div
          ref={barRef}
          className="group relative h-8 cursor-pointer flex items-center touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Track */}
          <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden transition-all group-hover:h-2">
            <div
              className="h-full bg-primary rounded-full transition-all duration-100"
              style={{ width: `${dragging ? displayProgress : progress}%` }}
            />
          </div>

          {/* Thumb (visible on hover/drag) */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary shadow-lg transition-opacity",
              dragging ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100",
            )}
            style={{ left: `${dragging ? displayProgress : progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
