import { hasLocale, getDictionary, Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import NewsFeed from "@/components/news/NewsFeed";
import { ForumTopicGrid } from "@/components/forums/ForumTopics";
import TwitterWall from "@/components/social/TwitterWall";
import MyFavoritesFeed from "@/components/home/MyFavoritesFeed";
import Link from "next/link";
import { Zap, TrendingUp, Users, MessageSquare } from "lucide-react";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="space-y-10">
      {/* Hero banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sport-card via-sport-card to-sport-darker border border-sport-border p-8 md:p-12">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
              <Zap size={12} fill="currentColor" />
              {dict.home.breaking}
            </span>
            <span className="text-xs text-gray-500">• Actualizado cada 10 min</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display tracking-wide text-white mb-4 leading-tight">
            {dict.home.hero}
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-lg">
            Fútbol, baloncesto y más — con las mejores fuentes del periodismo deportivo
            y el mejor contenido de redes sociales.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link href={`/${lang}/social`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm transition-colors">
              <TrendingUp size={16} /> Ver contenido social
            </Link>
            <Link href={`/${lang}/foros`} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-sport-border bg-sport-card hover:border-gold-500/50 text-white text-sm transition-colors">
              <MessageSquare size={16} /> Ir a los foros
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-6 mt-8 pt-8 border-t border-sport-border">
          {[
            { icon: <TrendingUp size={16} />, label: "Noticias/día", value: "+200" },
            { icon: <Users size={16} />, label: "Creadores", value: "50+" },
            { icon: <MessageSquare size={16} />, label: "Foros activos", value: "11" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-sm">
              <span className="text-gold-400">{s.icon}</span>
              <span className="font-bold text-white">{s.value}</span>
              <span className="text-gray-500 hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Personalised "Para ti" feed */}
      <MyFavoritesFeed lang={lang} />

      {/* Main news feed */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-1 h-5 bg-gold-500 rounded-full inline-block" />
            {dict.home.latest}
          </h2>
        </div>
        <NewsFeed lang={lang} />
      </section>

      {/* Twitter / X live accounts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-1 h-5 bg-sky-500 rounded-full inline-block" />
            <span className="text-sky-400 font-bold">𝕏</span>
            Cuentas para seguir en vivo
          </h2>
          <Link href={`/${lang}/social`} className="text-sm text-sky-400 hover:text-sky-300 transition-colors">
            Ver redes →
          </Link>
        </div>
        <p className="text-xs text-gray-500 mb-4">Estas cuentas publican noticias deportivas en tiempo real — síguelas para no perderte nada.</p>
        <TwitterWall />
      </section>

      {/* Forum topics preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-1 h-5 bg-gold-500 rounded-full inline-block" />
            {dict.forums.title}
          </h2>
          <Link href={`/${lang}/foros`} className="text-sm text-gold-400 hover:text-gold-300 transition-colors">
            Ver todos →
          </Link>
        </div>
        <ForumTopicGrid lang={lang} />
      </section>
    </div>
  );
}
