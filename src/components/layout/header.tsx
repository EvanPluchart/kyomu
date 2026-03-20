import Link from "next/link";
import { Nav } from "@/components/layout/nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-3xl text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.4)]">虚</span>
          <span className="tracking-wide text-xl">Kyomu</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Nav className="hidden md:flex" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
