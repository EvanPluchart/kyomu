import { config } from "@/lib/config";
import { scanLibrary, getScanStatus } from "@/lib/services/scanner";

let intervalId: ReturnType<typeof setInterval> | null = null;
let initialized = false;

export function startScheduler(): void {
  if (initialized) return;
  initialized = true;

  const intervalMs = config.scanIntervalMinutes * 60 * 1000;

  // Scan initial au premier démarrage (après un court délai pour laisser l'app démarrer)
  setTimeout(async () => {
    const status = getScanStatus();
    if (!status.lastScanAt) {
      console.warn("[scheduler] Premier démarrage détecté, lancement du scan initial...");
      try {
        await scanLibrary();
      } catch (error) {
        console.warn("[scheduler] Erreur lors du scan initial :", error);
      }
    }
  }, 5000);

  // Scan périodique
  intervalId = setInterval(async () => {
    const status = getScanStatus();
    if (status.isScanning) {
      console.warn("[scheduler] Scan déjà en cours, skip du scan périodique");
      return;
    }

    try {
      await scanLibrary();
      console.warn("[scheduler] Scan périodique terminé");
    } catch (error) {
      console.warn("[scheduler] Erreur lors du scan périodique :", error);
    }
  }, intervalMs);
}

export function stopScheduler(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  initialized = false;
}
