"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

interface MarkAllReadButtonProps {
  seriesId: number;
}

export function MarkAllReadButton({ seriesId }: MarkAllReadButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    setLoading(true);
    await fetch(`/api/library/series/${seriesId}/mark-read`, { method: "POST" });
    setLoading(false);
    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-green-500">
        <CheckCircle className="h-4 w-4" />
        Marquée comme lue
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={loading}
      className="gap-2 rounded-xl cursor-pointer hover:text-foreground"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
      Tout marquer comme lu
    </Button>
  );
}
