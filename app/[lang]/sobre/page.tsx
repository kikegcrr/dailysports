import { hasLocale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Zap, Globe, TrendingUp, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Acerca de dailySports — Tu portal deportivo en tiempo real",
  description: "Conoce dailySports, el portal de noticias y resultados deportivos en tiempo real con fuentes de todo el mundo.",
};

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-4">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">⚡</span>
          <h1 className="text-3xl font-display tracking-wide text-white">Acerca de dailySports</h1>
        </div>
        <p className="text-gray-400 text-base leading-relaxed">
          Tu portal deportivo en tiempo real: noticias, marcadores, directos y análisis de los mejores creadores del mundo del deporte.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: <Zap size={20} className="text-gold-400" />, title: "Tiempo real", desc: "Marcadores actualizados al segundo vía API oficial de ESPN. Sin retrasos." },
          { icon: <Globe size={20} className="text-emerald-400" />, title: "Fuentes globales", desc: "Más de 15 fuentes de noticias: Marca, AS, BBC Sport, ESPN, Sky Sports, UEFA y más." },
          { icon: <TrendingUp size={20} className="text-blue-400" />, title: "Todos los deportes", desc: "LaLiga, Champions, NBA, ATP, WTA, Bundesliga, Premier, Serie A y más competiciones." },
          { icon: <Users size={20} className="text-purple-400" />, title: "Creadores top", desc: "Directos de Twitch e YouTube de los streamers y periodistas más influyentes del deporte español." },
        ].map((item) => (
          <div key={item.title} className="bg-sport-card border border-sport-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              {item.icon}
              <span className="font-semibold text-white">{item.title}</span>
            </div>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-semibold text-white">Nuestra misión</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          dailySports nació para reunir en un solo lugar todo lo que necesita un aficionado al deporte: noticias de las mejores fuentes, resultados en vivo, directos de los creadores más influyentes y debates en foros con otros aficionados.
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          Creemos que el deporte es mejor cuando se vive en comunidad. Por eso combinamos la velocidad de las APIs oficiales con el análisis humano de periodistas y creadores de contenido de referencia.
        </p>
      </div>

      <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Tecnología</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Construido con Next.js, Supabase y APIs públicas de ESPN, Twitch y YouTube. Los marcadores se actualizan vía Server-Sent Events cada 5 segundos. Las noticias se agregan desde más de 15 RSS feeds internacionales y se ordenan por influencia y actualidad.
        </p>
      </div>

      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">
          ¿Preguntas o sugerencias?{" "}
          <a href={`/${lang}/contacto`} className="text-gold-400 hover:text-gold-300 underline">
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
}
