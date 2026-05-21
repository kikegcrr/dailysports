import { hasLocale, getDictionary, Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import CreatorCard, { Creator } from "@/components/creators/CreatorCard";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creadores — dailySports",
  description: "Sigue a los mejores creadores de contenido deportivo. Horarios, publicaciones y más.",
};

const CREATORS: Creator[] = [
  {
    id: "1",
    name: "El Chiringuito de Jugones",
    username: "elchiringuitotv",
    platform: "youtube",
    sport: "Fútbol",
    followers: "3.8M",
    description: "El programa deportivo más polémico y entretenido de la televisión española. Debates nocturnos sobre fútbol con los mejores periodistas.",
    profileUrl: "https://youtube.com/@ElChiringuitodejugones",
    latestPost: {
      title: "¡El debate más tenso del año! ¿Quién ganará LaLiga?",
      url: "https://youtube.com",
      publishedAt: "hace 2h",
    },
    schedule: [
      { day: "Lunes-Viernes", time: "23:30", topic: "Tertulia deportiva en directo" },
      { day: "Sábado", time: "00:00", topic: "Post-partido LaLiga" },
    ],
    verified: true,
  },
  {
    id: "2",
    name: "Jijantes FC",
    username: "JijantesFC",
    platform: "youtube",
    sport: "Fútbol",
    followers: "2.1M",
    description: "Canal de opinión futbolística con debates frescos y análisis profundos de la actualidad del fútbol español e internacional.",
    profileUrl: "https://youtube.com/@JijantesFC",
    latestPost: {
      title: "Análisis: El mejor XI de la temporada en Champions",
      url: "https://youtube.com",
      publishedAt: "hace 5h",
    },
    schedule: [
      { day: "Martes y Jueves", time: "20:00", topic: "Análisis semanal" },
      { day: "Domingo", time: "19:00", topic: "Resumen de la jornada" },
    ],
    verified: true,
  },
  {
    id: "3",
    name: "Mister Chip",
    username: "misterchip",
    platform: "twitter",
    sport: "Fútbol & Estadísticas",
    followers: "2.1M",
    description: "El rey de las estadísticas deportivas. Datos, cifras y análisis en tiempo real de todos los partidos del mundo.",
    profileUrl: "https://twitter.com/misterchip",
    latestPost: {
      title: "Los datos del fin de semana en LaLiga: récords y curiosidades",
      url: "https://twitter.com/misterchip",
      publishedAt: "hace 1h",
    },
    verified: true,
  },
  {
    id: "4",
    name: "Basket Total",
    username: "BasketTotal",
    platform: "youtube",
    sport: "Baloncesto",
    followers: "890K",
    description: "El mejor canal de baloncesto en español. Análisis NBA, ACB, EuroLeague y selecciones nacionales con los mejores expertos.",
    profileUrl: "https://youtube.com/@BasketTotal",
    latestPost: {
      title: "NBA Highlights: Los mejores momentos de la noche",
      url: "https://youtube.com",
      publishedAt: "hace 3h",
    },
    schedule: [
      { day: "Lunes", time: "19:00", topic: "Resumen NBA del fin de semana" },
      { day: "Miércoles", time: "20:30", topic: "Análisis ACB" },
    ],
  },
  {
    id: "5",
    name: "Fabrizio Romano",
    username: "FabrizioRomano",
    platform: "twitter",
    sport: "Mercado de fichajes",
    followers: "22M",
    description: "El periodista de fichajes más famoso del mundo. Primicia y exclusivas del mercado de transferencias internacionales.",
    profileUrl: "https://twitter.com/FabrizioRomano",
    latestPost: {
      title: "Here we go! Confirmed transfer breaking news",
      url: "https://twitter.com/FabrizioRomano",
      publishedAt: "hace 30min",
    },
    verified: true,
  },
  {
    id: "6",
    name: "El Larguero",
    username: "ellarguero",
    platform: "youtube",
    sport: "Fútbol & Deportes",
    followers: "1.4M",
    description: "El histórico programa deportivo de la Cadena SER. Análisis, entrevistas exclusivas y la mejor tertulia deportiva nocturna.",
    profileUrl: "https://youtube.com/@ElLarguero",
    schedule: [
      { day: "Lunes-Viernes", time: "00:00", topic: "Tertulia deportiva" },
      { day: "Fin de semana", time: "00:30", topic: "Post-partido" },
    ],
    verified: true,
  },
  {
    id: "7",
    name: "NBA España",
    username: "NBASpain",
    platform: "instagram",
    sport: "Baloncesto - NBA",
    followers: "1.2M",
    description: "La cuenta oficial de la NBA en España. Highlights, entrevistas, estadísticas y toda la actualidad de la mejor liga de baloncesto.",
    profileUrl: "https://instagram.com/nbaespana",
    latestPost: {
      title: "🔥 Los mejores dunks de la noche NBA",
      url: "https://instagram.com/nbaespana",
      publishedAt: "hace 4h",
    },
    verified: true,
  },
  {
    id: "8",
    name: "Mister Chip TV",
    username: "misterchip_tv",
    platform: "twitch",
    sport: "Fútbol & Estadísticas",
    followers: "450K",
    description: "Directos con estadísticas en tiempo real, debates y análisis de las jornadas deportivas. El dato más curioso de cada partido.",
    profileUrl: "https://twitch.tv/misterchip_tv",
    schedule: [
      { day: "Fin de semana", time: "21:00", topic: "Directo de jornada con estadísticas" },
    ],
  },
];

export default async function CreatorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display tracking-wide text-white">
            {dict.creators.title}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{dict.creators.subtitle}</p>
        </div>
        <Link
          href={`/${lang}/registro`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm transition-colors"
        >
          <Plus size={16} /> {dict.creators.promote}
        </Link>
      </div>

      {/* Platform filter */}
      <div className="flex flex-wrap gap-2">
        {[
          { icon: "📺", label: "Todos", active: true },
          { icon: "▶", label: "YouTube" },
          { icon: "◉", label: "Twitch" },
          { icon: "𝕏", label: "Twitter" },
          { icon: "◈", label: "Instagram" },
          { icon: "⚽", label: "Fútbol" },
          { icon: "🏀", label: "Baloncesto" },
        ].map((f) => (
          <span
            key={f.label}
            className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
              f.active
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/40"
                : "bg-sport-card border border-sport-border text-gray-400 hover:text-white hover:border-white/20"
            }`}
          >
            {f.icon} {f.label}
          </span>
        ))}
      </div>

      {/* Creator grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {CREATORS.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>

      {/* CTA to register as creator */}
      <div className="rounded-2xl border border-gold-500/30 bg-gold-500/5 p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">¿Eres creador de contenido deportivo?</h3>
        <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">
          Registra tu perfil en dailySports para ganar visibilidad, publicar tu horario de directos
          y conectar con miles de fans deportivos.
        </p>
        <Link
          href={`/${lang}/registro`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold transition-colors"
        >
          <Plus size={18} /> Registrarme como creador
        </Link>
      </div>
    </div>
  );
}
