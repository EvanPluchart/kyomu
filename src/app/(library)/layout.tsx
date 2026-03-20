import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/nav";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8 pb-24 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
