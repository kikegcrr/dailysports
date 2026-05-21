import type { Metadata } from "next";
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
      <body className="min-h-full flex flex-col bg-sport-dark">{children}</body>
    </html>
  );
}
