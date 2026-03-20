"use client";

import type { ReactNode } from "react";
import { useComicGestures } from "@/hooks/use-comic-gestures";

interface TouchHandlerProps {
  children: ReactNode;
  onNext: () => void;
  onPrev: () => void;
  onToggleControls: () => void;
}

export function TouchHandler({
  children,
  onNext,
  onPrev,
  onToggleControls,
}: TouchHandlerProps) {
  const { containerRef, bind, resetZoom } = useComicGestures({
    onSwipeLeft: onNext,
    onSwipeRight: onPrev,
    onTapCenter: onToggleControls,
  });

  return (
    <div
      ref={containerRef}
      {...bind()}
      className="h-full w-full touch-none"
      style={{ touchAction: "none" }}
    >
      {children}
    </div>
  );
}
