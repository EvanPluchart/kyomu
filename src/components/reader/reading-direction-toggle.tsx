"use client";

import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadingDirectionToggleProps {
  rtl: boolean;
  onToggle: () => void;
}

export function ReadingDirectionToggle({ rtl, onToggle }: ReadingDirectionToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
        "bg-white/10 hover:bg-white/20",
        rtl ? "text-amber-400" : "text-white/60",
      )}
      title={rtl ? "Lecture droite à gauche (manga)" : "Lecture gauche à droite"}
    >
      <ArrowLeftRight className="h-4 w-4" />
      {rtl ? "RTL" : "LTR"}
    </button>
  );
}
