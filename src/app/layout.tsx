import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kyomu",
  description: "Lecteur de comics self-hosted",
  manifest: "/manifest.json",
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

// Le contenu est une chaîne statique hardcodée — aucun risque XSS
const SW_REGISTER_SCRIPT = `
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
`;

function ServiceWorkerRegister() {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: contenu statique hardcodé, pas de données utilisateur
    // eslint-disable-next-line react/no-danger
    <script dangerouslySetInnerHTML={{ __html: SW_REGISTER_SCRIPT }} />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} antialiased min-h-screen bg-background`}>
        <ServiceWorkerRegister />
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
