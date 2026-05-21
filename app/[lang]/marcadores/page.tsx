import { hasLocale, Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import LiveScoresFeed from "@/components/scores/LiveScoresFeed";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marcadores en Vivo — dailySports",
  description: "Resultados en tiempo real de fútbol y baloncesto mundial. LaLiga, Champions, NBA, ACB y más.",
};

export default async function MarcadoresPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display tracking-wide text-white flex items-center gap-3">
            <span className="relative flex items-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse absolute -left-5" />
            </span>
            Marcadores en Vivo
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            LaLiga · Champions · Premier · Serie A · Bundesliga · NBA · ACB
            <span className="ml-2 text-emerald-500">· Actualización cada 30 segundos</span>
          </p>
        </div>
      </div>

      {/* Scores grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main feed */}
        <div className="lg:col-span-2">
          <LiveScoresFeed />
        </div>

        {/* Sidebar — info */}
        <div className="space-y-4">
          <div className="bg-sport-card border border-sport-border rounded-2xl p-4">
            <h3 className="font-semibold text-white mb-3 text-sm">Ligas disponibles</h3>
            <div className="space-y-1.5">
              {[
                { name: "⚽ LaLiga", live: true },
                { name: "⭐ Champions League", live: true },
                { name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League", live: true },
                { name: "🇮🇹 Serie A", live: true },
                { name: "🇩🇪 Bundesliga", live: true },
                { name: "🇫🇷 Ligue 1", live: true },
                { name: "🏀 NBA", live: true },
                { name: "🇪🇺 EuroLeague", live: false },
                { name: "🇪🇸 ACB", live: false },
              ].map((l) => (
                <div key={l.name} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">{l.name}</span>
                  {l.live ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Activa
                    </span>
                  ) : (
                    <span className="text-gray-600">Próximamente</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pitch legend */}
          <div className="bg-sport-card border border-sport-border rounded-2xl p-4">
            <h3 className="font-semibold text-white mb-3 text-sm">Cómo usar la pista interactiva</h3>
            <div className="space-y-2 text-xs text-gray-400">
              <p>1. Haz clic en cualquier partido para expandirlo</p>
              <p>2. Activa la pestaña <strong className="text-white">🏟 Pista</strong> para ver el campo</p>
              <p>3. Pasa el ratón por los marcadores de eventos</p>
              <p>4. Cambia a <strong className="text-white">📊 Stats</strong> para estadísticas</p>
              <p>5. O a <strong className="text-white">⏱ Timeline</strong> para los eventos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
