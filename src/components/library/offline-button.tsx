"use client";

import { useState, useEffect } from "react";
import { Download, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadComicForOffline, isComicAvailableOffline } from "@/lib/services/offline-storage";

interface OfflineButtonProps {
  comicId: number;
  title: string;
  pageCount: number;
}

export function OfflineButton({ comicId, title, pageCount }: OfflineButtonProps) {
  const [isOffline, setIsOffline] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    isComicAvailableOffline(comicId).then(setIsOffline);
  }, [comicId]);

  async function handleDownload() {
    if (downloading || isOffline) return;
    setDownloading(true);
    setProgress(0);

    try {
      await downloadComicForOffline(comicId, title, pageCount, (downloaded, total) => {
        setProgress(Math.round((downloaded / total) * 100));
      });
      setIsOffline(true);
    } catch {
      // Silently fail
    } finally {
      setDownloading(false);
    }
  }

  if (isOffline) {
    return (
      <Button variant="outline" size="sm" className="gap-2" disabled>
        <Check className="h-4 w-4 text-green-500" />
        Hors ligne
      </Button>
    );
  }

  if (downloading) {
    return (
      <Button variant="outline" size="sm" className="gap-2" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        {progress}%
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
      <Download className="h-4 w-4" />
      Télécharger
    </Button>
  );
}
