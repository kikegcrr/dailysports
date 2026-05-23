import { hasLocale, getDictionary, Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import CreatorCard from "@/components/creators/CreatorCard";
import { CREATORS } from "@/lib/creators-data";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creadores — dailySports",
  description: "Sigue a los mejores creadores de contenido deportivo. Horarios, publicaciones y más.",
};

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
