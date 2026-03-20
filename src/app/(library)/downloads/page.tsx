"use client";

import { useState, useEffect } from "react";
import { getOfflineComics, removeOfflineComic } from "@/lib/services/offline-storage";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";

interface OfflineComic {
  comicId: number;
  title: string;
  pageCount: number;
  downloadedAt: string;
  sizeBytes: number;
}

export default function DownloadsPage() {
  const [comics, setComics] = useState<OfflineComic[]>([]);

  useEffect(() => {
    getOfflineComics().then(setComics);
  }, []);

  async function handleRemove(comicId: number) {
    await removeOfflineComic(comicId);
    const updated = await getOfflineComics();
    setComics(updated);
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }

  const totalSize = comics.reduce((sum, c) => sum + c.sizeBytes, 0);
  const WARNING_THRESHOLD = 40 * 1024 * 1024;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Mes téléchargements</h1>

      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Espace utilisé</span>
          <span className="font-medium">{formatSize(totalSize)}</span>
        </div>
        {totalSize > WARNING_THRESHOLD && (
          <p className="text-xs text-amber-500">
            Attention : sur iOS Safari, le stockage peut être purgé au-delà de 50 Mo.
          </p>
        )}
      </div>

      {comics.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Download className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">
            Aucun comic téléchargé pour la lecture hors ligne.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {comics.map((comic) => (
            <div
              key={comic.comicId}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`/api/comics/${comic.comicId}/thumbnail`}
                  alt={comic.title}
                  className="h-16 w-11 rounded object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{comic.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {comic.pageCount} pages · {formatSize(comic.sizeBytes)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(comic.comicId)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
