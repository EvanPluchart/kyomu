"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2, KeyRound } from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.ok) {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-card p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <KeyRound className="h-4 w-4 text-primary" />
        Changer le mot de passe
      </div>
      <input
        type="password"
        placeholder="Mot de passe actuel"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
        className="h-10 w-full rounded-lg bg-muted px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        minLength={4}
        className="h-10 w-full rounded-lg bg-muted px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {success && (
        <p className="text-xs text-green-500 flex items-center gap-1">
          <Check className="h-3 w-3" /> Mot de passe modifié
        </p>
      )}
      <Button
        type="submit"
        disabled={submitting}
        variant="outline"
        size="sm"
        className="gap-2 rounded-lg cursor-pointer hover:text-foreground"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Modifier"}
      </Button>
    </form>
  );
}
