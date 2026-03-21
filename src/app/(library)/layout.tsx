import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/nav";
import { CommandSearch } from "@/components/layout/command-search";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <CommandSearch />
      <main className="mx-auto max-w-7xl px-6 py-8 pb-24 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
