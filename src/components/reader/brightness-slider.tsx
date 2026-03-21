"use client";

import { Sun } from "lucide-react";

interface BrightnessSliderProps {
  value: number; // 0.5 to 1.5
  onChange: (value: number) => void;
}

export function BrightnessSlider({ value, onChange }: BrightnessSliderProps) {
  return (
    <div className="flex items-center gap-2">
      <Sun className="h-3.5 w-3.5 text-white/60" />
      <input
        type="range"
        min="50"
        max="150"
        value={value * 100}
        onChange={(e) => onChange(parseInt(e.target.value, 10) / 100)}
        className="w-20 h-1 cursor-pointer accent-primary bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
      />
    </div>
  );
}
