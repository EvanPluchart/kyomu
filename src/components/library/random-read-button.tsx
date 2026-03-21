"use client";

import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";

export function RandomReadButton() {
  const router = useRouter();

  async function handleClick() {
    const res = await fetch("/api/random");
    if (res.ok) {
      const data = await res.json();
      router.push(`/read/${data.comicId}`);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex cursor-pointer items-center gap-2 rounded-xl bg-muted/50 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      title="Lecture aléatoire"
    >
      <Shuffle className="h-4 w-4" />
      <span className="hidden sm:inline">Au hasard</span>
    </button>
  );
}
