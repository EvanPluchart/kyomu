import type { Metadata, Viewport } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Kyomu — 虚無",
  description: "Lecteur de comics self-hosted",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kyomu",
  },
};

export const viewport: Viewport = {
  themeColor: "#080b14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const ACCENT_RESTORE_SCRIPT = `
  (function(){
    try {
      var n = localStorage.getItem("kyomu-accent");
      var m = {Ambre:"30 100% 55%",Rouge:"0 72% 51%",Bleu:"217 91% 60%",Vert:"142 71% 45%",Violet:"262 83% 58%",Rose:"330 81% 60%"};
      if(n && m[n]){
        document.documentElement.style.setProperty("--primary",m[n]);
        document.documentElement.style.setProperty("--accent",m[n]);
        document.documentElement.style.setProperty("--ring",m[n]);
      }
    }catch(e){}
  })()
`;

const SW_REGISTER_SCRIPT = `
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
`;

function ServiceWorkerRegister() {
  return (
    <script dangerouslySetInnerHTML={{ __html: SW_REGISTER_SCRIPT }} />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${outfit.variable} ${dmSans.variable} antialiased min-h-screen bg-background noise`}>
        <script dangerouslySetInnerHTML={{ __html: ACCENT_RESTORE_SCRIPT }} />
        <ThemeProvider>
          <ServiceWorkerRegister />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
