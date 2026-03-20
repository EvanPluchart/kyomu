"use client";

import { Rows3, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadingModeToggleProps {
  mode: "page" | "vertical";
  onModeChange: (mode: "page" | "vertical") => void;
}

export function ReadingModeToggle({ mode, onModeChange }: ReadingModeToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-md bg-white/10 p-1">
      <button
        onClick={() => onModeChange("page")}
        className={cn(
          "rounded p-1.5 transition-colors",
          mode === "page" ? "bg-white/20 text-white" : "text-white/60 hover:text-white",
        )}
        title="Mode page"
      >
        <Square className="h-4 w-4" />
      </button>
      <button
        onClick={() => onModeChange("vertical")}
        className={cn(
          "rounded p-1.5 transition-colors",
          mode === "vertical" ? "bg-white/20 text-white" : "text-white/60 hover:text-white",
        )}
        title="Mode vertical"
      >
        <Rows3 className="h-4 w-4" />
      </button>
    </div>
  );
}
