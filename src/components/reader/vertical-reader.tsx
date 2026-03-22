"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface VerticalReaderProps {
  comicId: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function VerticalReader({
  comicId,
  totalPages,
  onPageChange,
}: VerticalReaderProps) {
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([0, 1, 2, 3, 4]));
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up IntersectionObserver for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-page-index"));
            if (!isNaN(index)) {
              // Load this page and 5 pages ahead, 2 behind
              setLoadedPages((prev) => {
                const next = new Set(prev);
                for (let i = Math.max(0, index - 2); i <= Math.min(totalPages - 1, index + 5); i++) {
                  next.add(i);
                }
                return next;
              });

              // Update current page (the most visible one)
              if (entry.intersectionRatio > 0.5) {
                onPageChange(index);
              }
            }
          }
        });
      },
      { rootMargin: "500px 0px", threshold: [0, 0.5, 1] },
    );

    pageRefs.current.forEach((ref) => {
      if (ref) observerRef.current?.observe(ref);
    });

    return () => observerRef.current?.disconnect();
  }, [totalPages, onPageChange]);

  const setPageRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      pageRefs.current[index] = el;
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    },
    [],
  );

  return (
    <div className="flex flex-col items-center gap-0.5 py-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <div
          key={index}
          ref={setPageRef(index)}
          data-page-index={index}
          className="w-full max-w-2xl mx-auto px-2"
        >
          {loadedPages.has(index) ? (
            <img
              src={`/api/comics/${comicId}/pages/${index}`}
              alt={`Page ${index + 1}`}
              className="w-full h-auto"
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div className="aspect-[2/3] w-full animate-pulse bg-muted rounded-lg" />
          )}
        </div>
      ))}
    </div>
  );
}
