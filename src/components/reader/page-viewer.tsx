"use client";

import { useState, useEffect, useRef } from "react";

interface PageViewerProps {
  comicId: number;
  pageIndex: number;
}

export function PageViewer({ comicId, pageIndex }: PageViewerProps) {
  const [opacity, setOpacity] = useState(1);
  const prevPage = useRef(pageIndex);

  useEffect(() => {
    if (prevPage.current !== pageIndex) {
      setOpacity(0);
      const timer = setTimeout(() => setOpacity(1), 50);
      prevPage.current = pageIndex;
      return () => clearTimeout(timer);
    }
  }, [pageIndex]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <img
        src={`/api/comics/${comicId}/pages/${pageIndex}`}
        alt={`Page ${pageIndex + 1}`}
        className="max-h-full max-w-full object-contain"
        style={{ opacity, transition: "opacity 0.15s ease-in-out" }}
        draggable={false}
      />
    </div>
  );
}
