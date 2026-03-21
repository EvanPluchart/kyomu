"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ProfileData {
  id: number;
  name: string;
  color: string;
}

export function ProfileIndicator() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/kyomu-profile=(\d+)/);

    fetch("/api/profiles")
      .then((r) => r.json())
      .then((d) => {
        const profiles = d.profiles ?? [];
        if (profiles.length === 0) return; // Pas de profils, ne rien afficher

        if (match) {
          const found = profiles.find(
            (p: ProfileData) => p.id === parseInt(match[1], 10),
          );
          if (found) { setProfile(found); return; }
        }

        // Des profils existent mais aucun sélectionné — afficher un fallback
        setProfile({ id: 0, name: "Profil", color: "#666" });
      })
      .catch(() => {});
  }, []);

  if (!profile) return null;

  return (
    <Link
      href="/profiles"
      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted/50"
      title="Changer de profil"
    >
      <div
        className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold text-white"
        style={{ backgroundColor: profile.color }}
      >
        {profile.name.charAt(0).toUpperCase()}
      </div>
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {profile.name}
      </span>
    </Link>
  );
}
