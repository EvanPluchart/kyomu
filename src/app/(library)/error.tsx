"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function LibraryError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center animate-fade-in">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <div className="space-y-2">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Une erreur est survenue
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message || "Impossible de charger cette page."}
        </p>
      </div>
      <Button onClick={reset} variant="outline" className="rounded-xl cursor-pointer hover:text-foreground">
        Réessayer
      </Button>
    </div>
  );
}
