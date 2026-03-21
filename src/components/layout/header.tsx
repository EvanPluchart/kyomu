import Link from "next/link";
import { Nav } from "@/components/layout/nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ProfileIndicator } from "@/components/layout/profile-indicator";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="text-2xl text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)]">
            虚
          </span>
          <span className="text-lg font-semibold tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
            Kyomu
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Nav className="hidden md:flex" />
          <ProfileIndicator />
          <ThemeToggle />
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  );
}
