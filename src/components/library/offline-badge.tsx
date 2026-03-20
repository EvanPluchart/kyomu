"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import { isComicAvailableOffline } from "@/lib/services/offline-storage";

interface OfflineBadgeProps {
  comicId: number;
}

export function OfflineBadge({ comicId }: OfflineBadgeProps) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    isComicAvailableOffline(comicId).then(setIsOffline);
  }, [comicId]);

  if (!isOffline) return null;

  return (
    <div
      className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500"
      title="Disponible hors ligne"
    >
      <WifiOff className="h-3 w-3 text-white" />
    </div>
  );
}
