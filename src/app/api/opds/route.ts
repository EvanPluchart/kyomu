import { NextRequest, NextResponse } from "next/server";
import { generateRootFeed } from "@/lib/services/opds";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const baseUrl = new URL(request.url).origin;
  const xml = generateRootFeed(baseUrl);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
