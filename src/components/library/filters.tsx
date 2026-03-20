"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const STATUSES = [
  { value: "", label: "Tous" },
  { value: "unread", label: "Non lus" },
  { value: "reading", label: "En cours" },
  { value: "read", label: "Lus" },
] as const;

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") ?? "";

  function handleStatusChange(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      {STATUSES.map((s) => (
        <button
          key={s.value}
          onClick={() => handleStatusChange(s.value)}
          className={cn(
            "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            currentStatus === s.value
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
