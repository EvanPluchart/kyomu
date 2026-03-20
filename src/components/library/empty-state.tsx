"use client";

import { Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function EmptyState() {
  const router = useRouter();

  async function handleScan() {
    await fetch("/api/library/scan", { method: "POST" });
    // Attendre un peu puis recharger
    setTimeout(() => router.refresh(), 2000);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <Library className="h-16 w-16 text-muted-foreground" />
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Aucune série trouvée</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Votre bibliothèque est vide. Lancez un scan pour détecter vos comics.
        </p>
      </div>
      <Button onClick={handleScan}>Scanner la bibliothèque</Button>
    </div>
  );
}
