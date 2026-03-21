"use client";

import { useRef, useCallback } from "react";

interface PageViewerProps {
  comicId: number;
  pageIndex: number;
}

export function PageViewer({ comicId, pageIndex }: PageViewerProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const prevPage = useRef(pageIndex);

  const handleRef = useCallback(
    (node: HTMLImageElement | null) => {
      imgRef.current = node;
      if (node && prevPage.current !== pageIndex) {
        node.style.opacity = "0";
        setTimeout(() => {
          node.style.opacity = "1";
        }, 50);
        prevPage.current = pageIndex;
      }
    },
    [pageIndex]
  );

  return (
    <div className="flex h-full w-full items-center justify-center">
      <img
        ref={handleRef}
        src={`/api/comics/${comicId}/pages/${pageIndex}`}
        alt={`Page ${pageIndex + 1}`}
        className="max-h-full max-w-full object-contain"
        style={{ transition: "opacity 0.15s ease-in-out" }}
        draggable={false}
      />
    </div>
  );
}
