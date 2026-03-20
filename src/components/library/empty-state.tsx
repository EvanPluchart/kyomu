"use client";

import { BookOpen } from "lucide-react";
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
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="relative">
        <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full" />
        <div className="relative rounded-2xl bg-card border border-border p-6">
          <BookOpen className="h-12 w-12 text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Bienvenue sur Kyomu</h2>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          Votre bibliothèque attend ses premiers comics.
          Lancez un scan pour importer votre collection.
        </p>
      </div>
      <Button onClick={handleScan} size="lg" className="mt-2">
        Scanner la bibliothèque
      </Button>
    </div>
  );
}
