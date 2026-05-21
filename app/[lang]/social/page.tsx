import { hasLocale, getDictionary, Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import YouTubeCard from "@/components/social/YouTubeCard";
import { SocialPostCard } from "@/components/social/SocialEmbed";
import Link from "next/link";
import { Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social — dailySports",
  description: "Los mejores clips, debates y podcasts deportivos de YouTube, Twitch, Twitter e Instagram.",
};

// Featured YouTube sports channels (Spanish-focused)
const YOUTUBE_VIDEOS = [
  { videoId: "dQw4w9WgXcQ", title: "El mejor debate de la semana — ¿Quién ganará LaLiga?", channelName: "El Chiringuito de Jugones", views: "1.2M vistas" },
  { videoId: "ScMzIvxBSi4", title: "Análisis NBA: Los mejores jugadores de la temporada", channelName: "Basket Total", views: "340K vistas" },
  { videoId: "9bZkp7q19f0", title: "Champions League — Previa de cuartos de final", channelName: "Jijantes FC", views: "890K vistas" },
  { videoId: "e-ORhEE9VVg", title: "Podcast: La actualidad del Real Madrid con los expertos", channelName: "El Larguero - SER", views: "220K vistas" },
  { videoId: "oHg5SJYRHA0", title: "ACB: Lo mejor de la jornada en el baloncesto español", channelName: "ACB TV", views: "180K vistas" },
  { videoId: "ZZ5LpwO-An4", title: "Premier League — El gol de la semana", channelName: "Sky Sports", views: "4.5M vistas" },
];

const SOCIAL_POSTS = [
  {
    platform: "twitter" as const,
    username: "misterchip",
    displayName: "Mister Chip",
    content: "⚽ Estadísticas del fin de semana en LaLiga: Real Madrid, Barça y Atlético siguen de cerca en lo alto de la clasificación. La jornada más emocionante de la temporada.",
    postUrl: "https://twitter.com/misterchip",
    likes: 12400,
    timestamp: "hace 2h",
    followers: "2.1M seguidores",
  },
  {
    platform: "twitter" as const,
    username: "FabrizioRomano",
    displayName: "Fabrizio Romano",
    content: "🚨 BREAKING: New deal signed and here we go! The biggest transfer of the January window is confirmed. Full details incoming...",
    postUrl: "https://twitter.com/FabrizioRomano",
    likes: 89200,
    timestamp: "hace 1h",
    followers: "22M followers",
  },
  {
    platform: "instagram" as const,
    username: "realmadrid",
    displayName: "Real Madrid C.F.",
    content: "✨ Así entrenamos para el próximo partido. El Bernabéu nos espera. Hala Madrid! 🤍",
    postUrl: "https://instagram.com/realmadrid",
    likes: 234000,
    timestamp: "hace 3h",
    followers: "150M seguidores",
  },
  {
    platform: "tiktok" as const,
    username: "nba",
    displayName: "NBA",
    content: "The most INSANE dunk of the season 🔥 Who else dropped their jaw watching this?! #NBA #Basketball #Dunk",
    postUrl: "https://tiktok.com/@nba",
    likes: 890000,
    timestamp: "hace 5h",
    followers: "18M followers",
  },
  {
    platform: "twitter" as const,
    username: "Alfremartinezz",
    displayName: "Alfredo Martínez",
    content: "💬 El Barça está convencido de que puede fichar a este jugador en el mercado de invierno. Más detalles en el próximo programa.",
    postUrl: "https://twitter.com/Alfremartinezz",
    likes: 8700,
    timestamp: "hace 4h",
    followers: "890K seguidores",
  },
  {
    platform: "instagram" as const,
    username: "fcbarcelona",
    displayName: "FC Barcelona",
    content: "🔵❤️ Visca el Barça! Training session ahead of our next fixture. The team is ready! 💪",
    postUrl: "https://instagram.com/fcbarcelona",
    likes: 198000,
    timestamp: "hace 6h",
    followers: "120M seguidores",
  },
];

export default async function SocialPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display tracking-wide text-white">
            {dict.social.title}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{dict.social.subtitle}</p>
        </div>
        <Link
          href={`/${lang}/social/creadores`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sport-card border border-sport-border hover:border-gold-500/50 text-sm text-white transition-colors"
        >
          <Users size={16} /> {dict.social.creators}
        </Link>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { icon: "▶", label: "YouTube", color: "text-red-400 border-red-500/40 bg-red-500/10" },
          { icon: "◉", label: "Twitch", color: "text-purple-400 border-purple-500/40 bg-purple-500/10" },
          { icon: "𝕏", label: "Twitter / X", color: "text-sky-400 border-sky-500/40 bg-sky-500/10" },
          { icon: "◈", label: "Instagram", color: "text-pink-400 border-pink-500/40 bg-pink-500/10" },
          { icon: "♫", label: "TikTok", color: "text-white border-white/20 bg-white/5" },
        ].map((p) => (
          <span
            key={p.label}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap ${p.color}`}
          >
            {p.icon} {p.label}
          </span>
        ))}
      </div>

      {/* YouTube section */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-red-500 rounded-full" />
          YouTube — Debates & Podcasts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {YOUTUBE_VIDEOS.map((v) => (
            <YouTubeCard key={v.videoId} {...v} />
          ))}
        </div>
      </section>

      {/* Social posts */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gold-500 rounded-full" />
          Redes Sociales — Últimas Publicaciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOCIAL_POSTS.map((post, i) => (
            <SocialPostCard key={i} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
}
