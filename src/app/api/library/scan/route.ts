import { NextResponse } from "next/server";
import { scanLibrary, getScanStatus } from "@/lib/services/scanner";

export const dynamic = "force-dynamic";

export async function POST(): Promise<NextResponse> {
  const status = getScanStatus();

  if (status.isScanning) {
    return NextResponse.json(
      { status: "already_running" },
      { status: 409 },
    );
  }

  // Déclencher le scan de manière découplée (pas de timeout HTTP)
  setTimeout(async () => {
    try {
      await scanLibrary();
    } catch (error) {
      console.warn("[scan] Erreur lors du scan :", error);
    }
  }, 0);

  return NextResponse.json({ status: "started" });
}
