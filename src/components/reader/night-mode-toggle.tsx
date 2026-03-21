"use client";

import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NightModeToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function NightModeToggle({ enabled, onToggle }: NightModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "cursor-pointer rounded-md p-1.5 transition-colors",
        enabled ? "bg-amber-500/20 text-amber-400" : "text-white/60 hover:text-white",
      )}
      title="Mode nuit"
    >
      <Moon className="h-4 w-4" />
    </button>
  );
}
