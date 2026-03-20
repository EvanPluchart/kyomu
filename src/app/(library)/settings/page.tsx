"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, FolderOpen, Clock, Info, ExternalLink, BookOpen, Library, CheckCircle } from "lucide-react";

interface SettingsData {
  config: {
    comicsPath: string;
    scanIntervalMinutes: number;
    kapowarrUrl: string;
  };
  stats: {
    series: number;
    comics: number;
    read: number;
  };
  version: string;
}

interface ScanStatus {
  isScanning: boolean;
  lastScanAt: string | null;
  lastResult: {
    seriesAdded: number;
    seriesRemoved: number;
    comicsAdded: number;
    comicsRemoved: number;
  } | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [scanStatus, setScanStatus] = useState<ScanStatus | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings).catch(() => {});
    fetch("/api/library/scan/status").then((r) => r.json()).then(setScanStatus).catch(() => {});
  }, []);

  // Poll scan status while scanning
  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      fetch("/api/library/scan/status")
        .then((r) => r.json())
        .then((status: ScanStatus) => {
          setScanStatus(status);
          if (!status.isScanning) {
            setScanning(false);
            fetch("/api/settings").then((r) => r.json()).then(setSettings).catch(() => {});
          }
        })
        .catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, [scanning]);

  const handleScan = useCallback(async () => {
    setScanning(true);
    await fetch("/api/library/scan", { method: "POST" }).catch(() => {});
  }, []);

  function formatDate(iso: string | null): string {
    if (!iso) return "Jamais";
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH}h`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Paramètres
      </h1>

      {/* Section Scan */}
      <section className="space-y-4">
        <h2
          className="text-lg font-semibold tracking-tight flex items-center gap-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <RefreshCw className="h-5 w-5 text-primary" />
          Scan de la bibliothèque
        </h2>

        <div className="rounded-xl bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Dernier scan</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(scanStatus?.lastScanAt ?? null)}
              </p>
            </div>
            <Button
              onClick={handleScan}
              disabled={scanning}
              className="gap-2 rounded-xl"
            >
              <RefreshCw className={`h-4 w-4 ${scanning ? "animate-spin" : ""}`} />
              {scanning ? "Scan en cours..." : "Scanner"}
            </Button>
          </div>

          {scanStatus?.lastResult && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <div className="text-sm">
                <span className="text-muted-foreground">Séries ajoutées : </span>
                <span className="font-medium">{scanStatus.lastResult.seriesAdded}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Séries supprimées : </span>
                <span className="font-medium">{scanStatus.lastResult.seriesRemoved}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Comics ajoutés : </span>
                <span className="font-medium">{scanStatus.lastResult.comicsAdded}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Comics supprimés : </span>
                <span className="font-medium">{scanStatus.lastResult.comicsRemoved}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section Bibliothèque */}
      <section className="space-y-4">
        <h2
          className="text-lg font-semibold tracking-tight flex items-center gap-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <FolderOpen className="h-5 w-5 text-primary" />
          Bibliothèque
        </h2>

        <div className="rounded-xl bg-card p-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Dossier comics</span>
            <code className="rounded-md bg-muted px-2 py-1 text-xs font-mono">
              {settings?.config.comicsPath ?? "..."}
            </code>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Intervalle de scan
            </span>
            <span className="font-medium">
              {settings?.config.scanIntervalMinutes ?? "..."} min
            </span>
          </div>

          <div className="border-t border-border pt-3 grid grid-cols-3 gap-4">
            <div className="text-center">
              <Library className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {settings?.stats.series ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">Séries</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {settings?.stats.comics ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">Volumes</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {settings?.stats.read ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">Lus</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section className="space-y-4">
        <h2
          className="text-lg font-semibold tracking-tight flex items-center gap-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <Info className="h-5 w-5 text-primary" />
          À propos
        </h2>

        <div className="rounded-xl bg-card p-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Version</span>
            <span className="font-mono text-xs">{settings?.version ?? "..."}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Code source</span>
            <a
              href="https://github.com/EvanPluchart/kyomu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Mode kiosque</span>
            <a
              href="/kiosk"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Ouvrir
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Licence</span>
            <span>MIT</span>
          </div>

          {settings?.config.kapowarrUrl && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Kapowarr</span>
              <a
                href={settings.config.kapowarrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Ouvrir Kapowarr
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
