import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kyomu",
  description: "Lecteur de comics self-hosted",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kyomu",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} antialiased min-h-screen bg-background`}>
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
