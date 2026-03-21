import { NextRequest, NextResponse } from "next/server";
import { getProgress, saveProgress, markAs } from "@/lib/services/progress";
import { getActiveProfileId } from "@/lib/profile";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const comicId = parseInt(id, 10);

  if (isNaN(comicId)) {
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 },
    );
  }

  const profileId = await getActiveProfileId();
  const progress = await getProgress(comicId, profileId);
  return NextResponse.json({ progress });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const comicId = parseInt(id, 10);

  if (isNaN(comicId)) {
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 },
    );
  }

  const body = await request.json();
  const { currentPage, totalPages } = body;

  if (typeof currentPage !== "number" || typeof totalPages !== "number") {
    return NextResponse.json(
      { error: "currentPage et totalPages sont requis" },
      { status: 400 },
    );
  }

  const profileId = await getActiveProfileId();
  await saveProgress(comicId, currentPage, totalPages, profileId);
  return NextResponse.json({ status: "ok" });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const comicId = parseInt(id, 10);

  if (isNaN(comicId)) {
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 },
    );
  }

  const body = await request.json();
  const { status } = body;

  if (status !== "read" && status !== "unread") {
    return NextResponse.json(
      { error: "Le statut doit être 'read' ou 'unread'" },
      { status: 400 },
    );
  }

  const profileId = await getActiveProfileId();
  await markAs(comicId, status, profileId);
  return NextResponse.json({ status: "ok" });
}
