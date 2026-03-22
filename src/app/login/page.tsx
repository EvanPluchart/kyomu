"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"loading" | "register" | "login">("loading");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          router.push("/");
        } else if (data.configured) {
          setMode("login");
        } else {
          setMode("register");
        }
      })
      .catch(() => setMode("register"));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      window.location.href = "/profiles";
      return;
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur de connexion");
    }
    setSubmitting(false);
  }

  if (mode === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8 text-center animate-fade-in">
        <div className="space-y-2">
          <p className="text-5xl" style={{ fontFamily: "serif" }}>
            虚
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {mode === "register" ? "Créer votre compte" : "Connexion"}
          </h1>
          {mode === "register" && (
            <p className="text-sm text-muted-foreground">
              Bienvenue sur Kyomu. Créez votre compte administrateur.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            className="h-12 w-full rounded-xl bg-muted text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
            className="h-12 w-full rounded-xl bg-muted text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full gap-2 rounded-xl"
            size="lg"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : mode === "register" ? (
              <UserPlus className="h-5 w-5" />
            ) : (
              <LogIn className="h-5 w-5" />
            )}
            {mode === "register" ? "Créer le compte" : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
