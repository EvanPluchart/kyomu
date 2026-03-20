"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="cursor-pointer rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
      title={theme === "dark" ? "Mode clair" : "Mode sombre"}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
