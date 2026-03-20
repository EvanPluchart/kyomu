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
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
