"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Check, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface VolumeDetail {
  id: number;
  name: string;
  description: string | null;
  publisher: { name: string } | null;
  start_year: string | null;
  image: { medium_url: string; super_url: string } | null;
  count_of_issues: number;
  first_issue: {
    id: number;
    name: string;
    issue_number: string;
  } | null;
  last_issue: {
    id: number;
    name: string;
    issue_number: string;
  } | null;
  characters: { id: number; name: string }[] | null;
  inLibrary: boolean;
}

export default function DiscoverDetailPage() {
  const params = useParams();
  const [volume, setVolume] = useState<VolumeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    fetch(`/api/discover/${params.id}`)
      .then((r) => r.json())
      .then((data) => setVolume(data.volume ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleRequest() {
    if (!volume) return;
    setRequesting(true);
    const res = await fetch("/api/discover/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comicVineId: volume.id }),
    });
    setRequesting(false);
    if (res.ok) setRequested(true);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!volume) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Volume non trouvé.
      </div>
    );
  }

  const isInLibrary = volume.inLibrary || requested;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <Link
        href="/discover"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Découvrir
      </Link>

      {/* Hero section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {volume.image && (
          <div className="shrink-0">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={volume.image.super_url || volume.image.medium_url}
                alt={volume.name}
                className="w-48 sm:w-56 aspect-[2/3] object-cover"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>
          </div>
        )}

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {volume.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {volume.publisher && (
                <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-medium">
                  {volume.publisher.name}
                </span>
              )}
              {volume.start_year && <span>{volume.start_year}</span>}
              <span>{volume.count_of_issues} numéros</span>
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-3">
            {isInLibrary ? (
              <div className="flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-500">
                <Check className="h-5 w-5" />
                {requested
                  ? "Ajouté à Kapowarr"
                  : "Déjà en bibliothèque"}
              </div>
            ) : (
              <Button
                onClick={handleRequest}
                disabled={requesting}
                size="lg"
                className="gap-2 rounded-xl text-base"
              >
                {requesting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                Ajouter à la bibliothèque
              </Button>
            )}
          </div>

          {/* First/Last issue info */}
          {(volume.first_issue || volume.last_issue) && (
            <div className="flex gap-6 text-sm">
              {volume.first_issue && (
                <div>
                  <span className="text-muted-foreground">
                    Premier numéro :{" "}
                  </span>
                  <span className="font-medium">
                    #{volume.first_issue.issue_number}
                  </span>
                </div>
              )}
              {volume.last_issue && (
                <div>
                  <span className="text-muted-foreground">
                    Dernier numéro :{" "}
                  </span>
                  <span className="font-medium">
                    #{volume.last_issue.issue_number}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {volume.description && (
        <div className="space-y-2">
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Synopsis
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {volume.description}
          </p>
        </div>
      )}

      {/* Characters */}
      {volume.characters && volume.characters.length > 0 && (
        <div className="space-y-2">
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Personnages
          </h2>
          <div className="flex flex-wrap gap-2">
            {volume.characters.slice(0, 20).map((c) => (
              <span
                key={c.id}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
