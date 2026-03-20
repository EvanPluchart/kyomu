"use client";

import { useState, useEffect } from "react";
import { isComicAvailableOffline, getOfflinePage } from "@/lib/services/offline-storage";

export function useOfflineComic(comicId: number) {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    isComicAvailableOffline(comicId).then(setIsAvailable);
  }, [comicId]);

  async function getPage(pageIndex: number): Promise<string | null> {
    const blob = await getOfflinePage(comicId, pageIndex);
    if (!blob) return null;
    return URL.createObjectURL(blob);
  }

  return { isAvailable, getPage };
}
