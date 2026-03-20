"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORTS = [
  { value: "title", label: "Nom" },
  { value: "volumes", label: "Volumes" },
  { value: "added", label: "Récent" },
] as const;

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "title";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`);
  }

  return (
    <select
      value={currentSort}
      onChange={(e) => handleChange(e.target.value)}
      className="cursor-pointer rounded-lg bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground border-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      {SORTS.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
