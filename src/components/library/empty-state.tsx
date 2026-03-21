"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, FolderOpen, CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmptyState() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [comicsPath, setComicsPath] = useState("...");
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setComicsPath(d.config?.comicsPath ?? "..."))
      .catch(() => {});
  }, []);

  async function handleScan() {
    setScanning(true);
    await fetch("/api/library/scan", { method: "POST" });

    // Poll for completion
    const interval = setInterval(async () => {
      const res = await fetch("/api/library/scan/status");
      const data = await res.json();
      if (!data.isScanning) {
        clearInterval(interval);
        setScanning(false);
        setScanDone(true);
        setStep(3);
      }
    }, 2000);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16 text-center animate-fade-in">
      <div className="text-6xl" style={{ fontFamily: "serif" }}>虚</div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Bienvenue sur Kyomu
        </h1>
        <p className="text-muted-foreground max-w-md">
          Votre lecteur de comics, manga et webtoons self-hosted.
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {step > s ? "\u2713" : s}
            </div>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <div className="max-w-md space-y-4">
        {step === 1 && (
          <>
            <div className="rounded-xl bg-card p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FolderOpen className="h-4 w-4 text-primary" />
                <span>Dossier des comics</span>
              </div>
              <code className="block rounded-lg bg-muted px-3 py-2 text-xs font-mono">{comicsPath}</code>
              <p className="text-xs text-muted-foreground">
                Kyomu scannera automatiquement ce dossier pour détecter vos comics.
              </p>
            </div>
            <Button onClick={() => setStep(2)} className="gap-2 rounded-xl">
              Continuer <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-muted-foreground">
              Lancez le scan pour détecter vos comics.
            </p>
            <Button
              onClick={handleScan}
              disabled={scanning}
              className="gap-2 rounded-xl"
              size="lg"
            >
              <RefreshCw className={`h-4 w-4 ${scanning ? "animate-spin" : ""}`} />
              {scanning ? "Scan en cours..." : "Scanner la bibliothèque"}
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex items-center justify-center gap-2 text-green-500">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold">Bibliothèque prête !</span>
            </div>
            <Button
              onClick={() => router.refresh()}
              className="gap-2 rounded-xl"
              size="lg"
            >
              Voir ma bibliothèque <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
