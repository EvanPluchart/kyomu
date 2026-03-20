import { NextResponse } from "next/server";
import { getScanStatus } from "@/lib/services/scanner";

export async function GET(): Promise<NextResponse> {
  const status = getScanStatus();
  return NextResponse.json(status);
}
