"use client";

import { useState, useEffect, useCallback } from "react";
import { PageViewer } from "@/components/reader/page-viewer";
import { ReaderControls } from "@/components/reader/reader-controls";
import { ProgressBar } from "@/components/reader/progress-bar";
import { TouchHandler } from "@/components/reader/touch-handler";
import { VolumeEndOverlay } from "@/components/reader/volume-end-overlay";
import { VerticalReader } from "@/components/reader/vertical-reader";
import { ReadingModeToggle } from "@/components/reader/reading-mode-toggle";
import { ReadingDirectionToggle } from "@/components/reader/reading-direction-toggle";
import { NightModeToggle } from "@/components/reader/night-mode-toggle";
import { BookmarkButton } from "@/components/reader/bookmark-button";

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
  const [showEndOverlay, setShowEndOverlay] = useState(false);
  const [readingMode, setReadingMode] = useState<"page" | "vertical">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(`reading-mode-${seriesId}`) as "page" | "vertical") ?? "page";
    }
    return "page";
  });
  const [rtl, setRtl] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`reading-direction-${seriesId}`) === "rtl";
    }
    return false;
  });
  const [nightMode, setNightMode] = useState(false);
  const [bookmark, setBookmark] = useState<number | null>(null);

  // Fetch page count on mount
  useEffect(() => {
    fetch(`/api/comics/${comicId}/pages`)
      .then((res) => res.json())
      .then((data: { pageCount: number }) => {
        setTotalPages(data.pageCount);
      })
      .catch((err) => {
        console.error("[reader] Failed to fetch pages:", err);
      });
  }, [comicId]);

  // Load saved progress on mount
  useEffect(() => {
    fetch(`/api/comics/${comicId}/progress`)
      .then((res) => res.json())
      .then((data) => {
        if (data.progress?.currentPage > 0) {
          setCurrentPage(data.progress.currentPage);
        }
      })
      .catch(() => {});
  }, [comicId]);

  // Save progress with debounce
  useEffect(() => {
    if (totalPages === 0) return;
    const timer = setTimeout(() => {
      fetch(`/api/comics/${comicId}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPage, totalPages }),
      }).catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [currentPage, totalPages, comicId]);

  // Preload next 4 pages
  useEffect(() => {
    for (let i = 1; i <= 4; i++) {
      const nextPage = currentPage + i;
      if (nextPage < totalPages) {
        const img = new Image();
        img.src = `/api/comics/${comicId}/pages/${nextPage}`;
      }
    }
  }, [currentPage, totalPages, comicId]);

  // Load bookmark on mount
  useEffect(() => {
    try {
      const bm = JSON.parse(localStorage.getItem("kyomu-bookmarks") ?? "{}");
      if (bm[String(comicId)] !== undefined) {
        setBookmark(bm[String(comicId)]);
      }
    } catch {}
  }, [comicId]);

  function handleBookmarkToggle() {
    const bm = JSON.parse(localStorage.getItem("kyomu-bookmarks") ?? "{}");
    if (bookmark === currentPage) {
      delete bm[String(comicId)];
      setBookmark(null);
    } else {
      bm[String(comicId)] = currentPage;
      setBookmark(currentPage);
    }
    localStorage.setItem("kyomu-bookmarks", JSON.stringify(bm));
  }

  function handleModeChange(mode: "page" | "vertical") {
    setReadingMode(mode);
    localStorage.setItem(`reading-mode-${seriesId}`, mode);
  }

  function handleDirectionToggle() {
    const newRtl = !rtl;
    setRtl(newRtl);
    localStorage.setItem(`reading-direction-${seriesId}`, newRtl ? "rtl" : "ltr");
  }

  function handleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  const goNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
    } else if (currentPage >= totalPages - 1) {
      setShowEndOverlay(true);
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
      if (e.key === "ArrowRight" || e.key === "d" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        goPrev();
      } else if (e.key === "Escape") {
        setShowControls((prev) => !prev);
      } else if (e.key === "f" || e.key === "F") {
        handleFullscreen();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (totalPages === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-primary" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none">
      <div style={{ filter: nightMode ? "sepia(0.3) brightness(0.85)" : "none" }}>
        {readingMode === "vertical" ? (
          <div className="h-full overflow-y-auto">
            <VerticalReader
              comicId={comicId}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          <TouchHandler
            onNext={goNext}
            onPrev={goPrev}
            onToggleControls={() => setShowControls((prev) => !prev)}
          >
            <PageViewer comicId={comicId} pageIndex={currentPage} />
          </TouchHandler>
        )}
      </div>

      <ReaderControls
        visible={showControls}
        title={title}
        seriesTitle={seriesTitle}
        seriesId={seriesId}
        currentPage={currentPage}
        totalPages={totalPages}
        onFullscreen={handleFullscreen}
      >
        <ReadingModeToggle mode={readingMode} onModeChange={handleModeChange} />
        <ReadingDirectionToggle rtl={rtl} onToggle={handleDirectionToggle} />
        <NightModeToggle enabled={nightMode} onToggle={() => setNightMode(!nightMode)} />
        <BookmarkButton isBookmarked={bookmark === currentPage} onToggle={handleBookmarkToggle} />
      </ReaderControls>

      <ProgressBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        visible={showControls}
      />

      <VolumeEndOverlay
        visible={showEndOverlay}
        comicId={comicId}
        seriesId={seriesId}
        onClose={() => setShowEndOverlay(false)}
      />
    </div>
  );
}
