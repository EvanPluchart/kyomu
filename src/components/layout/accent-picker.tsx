"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ACCENTS = [
  { name: "Ambre", hsl: "30 100% 55%", class: "bg-amber-500" },
  { name: "Rouge", hsl: "0 72% 51%", class: "bg-red-500" },
  { name: "Bleu", hsl: "217 91% 60%", class: "bg-blue-500" },
  { name: "Vert", hsl: "142 71% 45%", class: "bg-green-500" },
  { name: "Violet", hsl: "262 83% 58%", class: "bg-purple-500" },
  { name: "Rose", hsl: "330 81% 60%", class: "bg-pink-500" },
] as const;

export function AccentPicker() {
  const [selected, setSelected] = useState("Ambre");

  useEffect(() => {
    const saved = localStorage.getItem("kyomu-accent");
    if (saved) {
      setSelected(saved);
      applyAccent(saved);
    }
  }, []);

  function applyAccent(name: string) {
    const accent = ACCENTS.find((a) => a.name === name);
    if (!accent) return;
    document.documentElement.style.setProperty("--primary", accent.hsl);
    document.documentElement.style.setProperty("--accent", accent.hsl);
    document.documentElement.style.setProperty("--ring", accent.hsl);
  }

  function handleSelect(name: string) {
    setSelected(name);
    localStorage.setItem("kyomu-accent", name);
    applyAccent(name);
  }

  return (
    <div className="flex items-center gap-2">
      {ACCENTS.map((a) => (
        <button
          key={a.name}
          onClick={() => handleSelect(a.name)}
          className={cn(
            "h-7 w-7 rounded-full cursor-pointer transition-all duration-200 ring-2 ring-offset-2 ring-offset-background",
            a.class,
            selected === a.name ? "ring-foreground scale-110" : "ring-transparent hover:ring-muted-foreground",
          )}
          title={a.name}
        />
      ))}
    </div>
  );
}
