import { NextRequest, NextResponse } from "next/server";
import { getProgress, saveProgress, markAs } from "@/lib/services/progress";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const comicId = parseInt(id, 10);

  if (isNaN(comicId)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const progress = await getProgress(comicId);
  return NextResponse.json({ progress });
}


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const comicId = parseInt(id, 10);

  if (isNaN(comicId)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const body = await request.json();
  const { currentPage, totalPages } = body;

  if (typeof currentPage !== "number" || typeof totalPages !== "number") {
    return NextResponse.json(
      { error: "currentPage et totalPages sont requis" },
      { status: 400 },
    );
  }

  await saveProgress(comicId, currentPage, totalPages);
  return NextResponse.json({ status: "ok" });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const comicId = parseInt(id, 10);

  if (isNaN(comicId)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const body = await request.json();
  const { status } = body;

  if (status !== "read" && status !== "unread") {
    return NextResponse.json(
      { error: "Le statut doit être 'read' ou 'unread'" },
      { status: 400 },
    );
  }

  await markAs(comicId, status);
  return NextResponse.json({ status: "ok" });
}
