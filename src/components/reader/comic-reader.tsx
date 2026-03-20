"use client";

import { useState, useEffect, useCallback } from "react";
import { PageViewer } from "@/components/reader/page-viewer";
import { ReaderControls } from "@/components/reader/reader-controls";
import { ProgressBar } from "@/components/reader/progress-bar";

interface ComicReaderProps {
  comicId: number;
  title: string;
  seriesTitle: string;
  seriesId: number;
}

export function ComicReader({ comicId, title, seriesTitle, seriesId }: ComicReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showControls, setShowControls] = useState(false);

  // Fetch page count on mount
  useEffect(() => {
    fetch(`/api/comics/${comicId}/pages`)
      .then((res) => res.json())
      .then((data: { pageCount: number }) => setTotalPages(data.pageCount))
      .catch(() => {});
  }, [comicId]);

  // Preload next pages
  useEffect(() => {
    for (let i = 1; i <= 2; i++) {
      const nextPage = currentPage + i;
      if (nextPage < totalPages) {
        const img = new Image();
        img.src = `/api/comics/${comicId}/pages/${nextPage}`;
      }
    }
  }, [currentPage, totalPages, comicId]);

  const goNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
    }
  }, [currentPage, totalPages]);

  const goPrev = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    }
  }, [currentPage]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "d") {
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        goPrev();
      } else if (e.key === "Escape") {
        setShowControls((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  function handleTap(zone: "left" | "center" | "right") {
    if (zone === "left") goPrev();
    else if (zone === "right") goNext();
    else setShowControls((prev) => !prev);
  }

  if (totalPages === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none">
      <PageViewer
        comicId={comicId}
        pageIndex={currentPage}
        onTap={handleTap}
      />

      <ReaderControls
        visible={showControls}
        title={title}
        seriesTitle={seriesTitle}
        seriesId={seriesId}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <ProgressBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        visible={showControls}
      />
    </div>
  );
}
