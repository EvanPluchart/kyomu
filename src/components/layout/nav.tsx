"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavProps {
  className?: string;
}

const links = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/series", label: "Séries", icon: Library },
];

// Desktop nav (in header)
export function Nav({ className }: NavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-6", className)}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground",
            pathname === link.href
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

// Mobile bottom navigation
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="flex items-center justify-around h-16">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
              pathname === link.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
