"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface VolumeEndOverlayProps {
  visible: boolean;
  comicId: number;
  seriesId: number;
  onClose: () => void;
}

interface NextVolume {
  id: number;
  title: string;
  number: number | null;
}

export function VolumeEndOverlay({
  visible,
  comicId,
  seriesId,
  onClose,
}: VolumeEndOverlayProps) {
  const [nextVolume, setNextVolume] = useState<NextVolume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    // Fetch the next volume from the API
    fetch(`/api/library/series/${seriesId}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const comics = data.comics || [];
        const currentIndex = comics.findIndex((c: { id: number }) => c.id === comicId);
        if (currentIndex >= 0 && currentIndex < comics.length - 1) {
          const next = comics[currentIndex + 1];
          setNextVolume({ id: next.id, title: next.title, number: next.number });
        } else {
          setNextVolume(null);
        }
      })
      .catch(() => { if (!cancelled) setNextVolume(null); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [visible, comicId, seriesId]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="mx-4 max-w-sm space-y-6 text-center">
        <h2 className="text-2xl font-bold">Volume terminé</h2>

        {loading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : nextVolume ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg">
              <img
                src={`/api/comics/${nextVolume.id}/thumbnail`}
                alt={nextVolume.title}
                className="mx-auto w-32 aspect-[2/3] object-cover rounded-lg"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Volume suivant
            </p>
            <p className="font-medium">
              {nextVolume.number != null ? `#${nextVolume.number} — ` : ""}
              {nextVolume.title}
            </p>
            <Link href={`/read/${nextVolume.id}`}>
              <Button className="gap-2">
                <ChevronRight className="h-4 w-4" />
                Volume suivant
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg">Série terminée !</p>
            <p className="text-sm text-muted-foreground">
              Vous avez lu tous les volumes de cette série.
            </p>
          </div>
        )}

        <Link href={`/series/${seriesId}`}>
          <Button variant="outline" className="gap-2" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
            Retour à la série
          </Button>
        </Link>
      </div>
    </div>
  );
}
