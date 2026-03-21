"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, BookOpen, Settings, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavProps {
  className?: string;
}

const mainLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/series", label: "Séries", icon: Library },
  { href: "/discover", label: "Découvrir", icon: Compass },
  { href: "/reading", label: "En cours", icon: BookOpen },
];

const mobileLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/series", label: "Séries", icon: Library },
  { href: "/discover", label: "Découvrir", icon: Compass },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

export function Nav({ className }: NavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {mainLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer transition-all duration-200",
            pathname === link.href
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl md:hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="flex items-center justify-around h-16">
        {mobileLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 px-6 min-h-[44px] text-xs font-medium cursor-pointer transition-all duration-200",
              pathname === link.href
                ? "text-primary"
                : "text-muted-foreground",
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
            {pathname === link.href && (
              <span className="absolute -top-px left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
