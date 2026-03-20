export async function register() {
  // Le scheduler ne doit tourner que côté serveur, pas pendant le build
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startScheduler } = await import("@/lib/services/scan-scheduler");
    startScheduler();
  }
}
