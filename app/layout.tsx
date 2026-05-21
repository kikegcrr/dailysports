import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "dailySports — Noticias deportivas en tiempo real",
  description:
    "Las noticias deportivas más importantes. Fútbol, baloncesto y mucho más. Actualizado cada 10 minutos con las mejores fuentes.",
  keywords: "fútbol, baloncesto, deportes, noticias, LaLiga, NBA, Champions League",
  openGraph: {
    title: "dailySports",
    description: "Noticias deportivas en tiempo real",
    type: "website",
  },
  other: {
    "google-adsense-account": "ca-pub-4263994931469963",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-sport-dark">
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4263994931469963"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
