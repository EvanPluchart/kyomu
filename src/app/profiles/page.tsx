"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Profile {
  id: number;
  name: string;
  color: string;
  pin: string | null;
}

const COLORS = [
  "#e8a030",
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#a855f7",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export default function ProfilesPage() {
  const router = useRouter();
  const [profilesList, setProfiles] = useState<Profile[]>([]);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [pin, setPin] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [askingPin, setAskingPin] = useState<Profile | null>(null);

  function loadProfiles() {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((d) => setProfiles(d.profiles ?? []))
      .catch(() => {});
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  async function handleSelect(profile: Profile) {
    if (profile.pin) {
      setAskingPin(profile);
      setPinInput("");
      return;
    }
    await doSelect(profile.id);
  }

  async function handlePinSubmit() {
    if (!askingPin) return;
    const res = await fetch(`/api/profiles/${askingPin.id}/select`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: pinInput }),
    });
    if (res.ok) {
      router.push("/");
    } else {
      setPinInput("");
    }
    setAskingPin(null);
  }

  async function doSelect(id: number) {
    await fetch(`/api/profiles/${id}/select`, { method: "POST" });
    router.push("/");
  }

  async function handleCreate() {
    await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color, pin: pin || null }),
    });
    setCreating(false);
    setName("");
    setPin("");
    loadProfiles();
  }

  async function handleUpdate() {
    if (!editing) return;
    await fetch(`/api/profiles/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color, pin: pin || null }),
    });
    setEditing(null);
    setName("");
    setPin("");
    loadProfiles();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/profiles/${id}`, { method: "DELETE" });
    loadProfiles();
  }

  function startEdit(profile: Profile) {
    setEditing(profile);
    setName(profile.name);
    setColor(profile.color);
    setPin(profile.pin ?? "");
    setCreating(false);
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setName("");
    setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setPin("");
  }

  const showForm = creating || editing;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-8 text-center animate-fade-in">
        <div className="space-y-2">
          <p className="text-4xl" style={{ fontFamily: "serif" }}>
            虚
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Qui regarde ?
          </h1>
        </div>

        {/* PIN dialog */}
        {askingPin && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Entrez le PIN pour {askingPin.name}
            </p>
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) =>
                setPinInput(e.target.value.replace(/\D/g, ""))
              }
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              className="mx-auto block h-12 w-32 rounded-xl bg-muted text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setAskingPin(null)}
                className="rounded-xl"
              >
                Annuler
              </Button>
              <Button onClick={handlePinSubmit} className="rounded-xl">
                Valider
              </Button>
            </div>
          </div>
        )}

        {/* Profiles grid */}
        {!askingPin && !showForm && (
          <div className="flex flex-wrap justify-center gap-6">
            {profilesList.map((p) => (
              <div key={p.id} className="group relative">
                <button
                  onClick={() => handleSelect(p)}
                  className="flex cursor-pointer flex-col items-center gap-2 transition-transform hover:scale-105"
                >
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium">
                    {p.name}
                    {p.pin && (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                  </span>
                </button>
                <div className="absolute -top-2 -right-2 hidden gap-1 group-hover:flex">
                  <button
                    onClick={() => startEdit(p)}
                    className="cursor-pointer rounded-full bg-muted p-1 hover:bg-muted-foreground/20"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="cursor-pointer rounded-full bg-muted p-1 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}

            {profilesList.length < 6 && (
              <button
                onClick={startCreate}
                className="flex cursor-pointer flex-col items-center gap-2 transition-transform hover:scale-105"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground">
                  <Plus className="h-8 w-8" />
                </div>
                <span className="text-sm text-muted-foreground">Ajouter</span>
              </button>
            )}
          </div>
        )}

        {/* Create/Edit form */}
        {showForm && (
          <div className="mx-auto max-w-xs space-y-4">
            <input
              type="text"
              placeholder="Nom du profil"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 w-full rounded-xl bg-muted text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
            <div className="flex justify-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 cursor-pointer rounded-full transition-all ${color === c ? "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <input
              type="text"
              placeholder="PIN (optionnel, 4 chiffres)"
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              className="h-10 w-full rounded-xl bg-muted text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
                className="rounded-xl"
              >
                Annuler
              </Button>
              <Button
                onClick={editing ? handleUpdate : handleCreate}
                disabled={!name.trim()}
                className="rounded-xl"
              >
                {editing ? "Modifier" : "Créer"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
