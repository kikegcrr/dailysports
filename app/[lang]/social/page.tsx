"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import YouTubeCard from "@/components/social/YouTubeCard";
import Link from "next/link";
import { Users, ExternalLink, Play } from "lucide-react";
import { YouTubeVideo } from "@/app/api/youtube/route";

// Real top sports accounts — direct profile links, real @handles
const TOP_ACCOUNTS = [
  // Twitter/X
  { platform: "twitter", username: "misterchip", displayName: "Mister Chip", description: "El estadístico más famoso del fútbol español. Datos, resultados y curiosidades en tiempo real.", followers: "2.1M seguidores", profileUrl: "https://twitter.com/misterchip" },
  { platform: "twitter", username: "FabrizioRomano", displayName: "Fabrizio Romano", description: "\"Here we go!\" El periodista de transferencias más seguido del mundo.", followers: "22M seguidores", profileUrl: "https://twitter.com/FabrizioRomano" },
  { platform: "twitter", username: "elchiringuitotv", displayName: "El Chiringuito TV", description: "El debate deportivo más polémico de España, ahora en X.", followers: "3M seguidores", profileUrl: "https://twitter.com/elchiringuitotv" },
  { platform: "twitter", username: "Alfremartinezz", displayName: "Alfredo Martínez", description: "Periodista de Onda Cero especializado en el Real Madrid. Noticias de primera mano.", followers: "890K seguidores", profileUrl: "https://twitter.com/Alfremartinezz" },
  { platform: "twitter", username: "marca", displayName: "MARCA", description: "El periódico deportivo más leído de España.", followers: "5M seguidores", profileUrl: "https://twitter.com/marca" },
  { platform: "twitter", username: "mundodeportivo", displayName: "Mundo Deportivo", description: "Todas las noticias del FC Barcelona y el deporte internacional.", followers: "2.8M seguidores", profileUrl: "https://twitter.com/mundodeportivo" },
  // Instagram
  { platform: "instagram", username: "realmadrid", displayName: "Real Madrid C.F.", description: "Cuenta oficial del club más laureado del mundo. Noticias, goles y momentos únicos.", followers: "150M seguidores", profileUrl: "https://instagram.com/realmadrid" },
  { platform: "instagram", username: "fcbarcelona", displayName: "FC Barcelona", description: "¡Visca el Barça! El club azulgrana en Instagram.", followers: "120M seguidores", profileUrl: "https://instagram.com/fcbarcelona" },
  { platform: "instagram", username: "nba", displayName: "NBA", description: "Los mejores dunks, jugadas y momentos de la mejor liga de baloncesto del mundo.", followers: "90M seguidores", profileUrl: "https://instagram.com/nba" },
  { platform: "instagram", username: "laliga", displayName: "LaLiga", description: "La liga de fútbol más apasionante del mundo.", followers: "45M seguidores", profileUrl: "https://instagram.com/laliga" },
  { platform: "instagram", username: "ibai", displayName: "Ibai Llanos", description: "El mayor streamer de España. Momentos de la Velada del Año, eventos deportivos y más.", followers: "6M seguidores", profileUrl: "https://instagram.com/ibai" },
  { platform: "instagram", username: "jijantesfc", displayName: "Jijantes FC", description: "El equipo de fútbol de streamers más famoso del mundo.", followers: "1.5M seguidores", profileUrl: "https://instagram.com/jijantesfc" },
  // TikTok
  { platform: "tiktok", username: "nba", displayName: "NBA", description: "Highlights, dunks imposibles y los mejores momentos del baloncesto profesional.", followers: "18M seguidores", profileUrl: "https://tiktok.com/@nba" },
  { platform: "tiktok", username: "laliga", displayName: "LaLiga", description: "Goles, jugadas y la mejor selección del fútbol español en formato corto.", followers: "12M seguidores", profileUrl: "https://tiktok.com/@laliga" },
  { platform: "tiktok", username: "ibaillanos9", displayName: "Ibai Llanos", description: "Clips, humor y los mejores momentos del mayor streamer de España.", followers: "8M seguidores", profileUrl: "https://tiktok.com/@ibaillanos9" },
  { platform: "tiktok", username: "chiringuito_tv", displayName: "El Chiringuito TV", description: "Las reacciones, debates y momentazos del programa más polémico del deporte español.", followers: "3M seguidores", profileUrl: "https://tiktok.com/@chiringuito_tv" },
  { platform: "tiktok", username: "realmadrid", displayName: "Real Madrid C.F.", description: "Los mejores momentos del club más ganador del mundo en TikTok.", followers: "22M seguidores", profileUrl: "https://tiktok.com/@realmadrid" },
  { platform: "tiktok", username: "fcbarcelona", displayName: "FC Barcelona", description: "Goles, celebraciones y el Barça en formato vídeo corto.", followers: "15M seguidores", profileUrl: "https://tiktok.com/@fcbarcelona" },
];

const PLATFORM_META: Record<string, { icon: string; label: string; color: string; bg: string; border: string }> = {
  twitter:   { icon: "𝕏", label: "Twitter / X",  color: "text-sky-400",  bg: "bg-sky-500/10",  border: "border-sky-500/30" },
  instagram: { icon: "◈", label: "Instagram",     color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
  tiktok:    { icon: "♫", label: "TikTok",        color: "text-white",    bg: "bg-white/5",     border: "border-white/15" },
};

const YOUTUBE_CHANNELS = [
  { name: "El Chiringuito de Jugones", handle: "ElChiringuitodejugones", subs: "3.8M", desc: "El debate nocturno más polémico del fútbol español" },
  { name: "Jijantes FC",               handle: "JijantesFC",             subs: "2.1M", desc: "Opinión y debate futbolístico sin filtros" },
  { name: "Relevo",                    handle: "RelevoMedia",            subs: "950K", desc: "El medio deportivo digital de nueva generación" },
  { name: "NBA España",                handle: "NBAEspana",              subs: "1.2M", desc: "Todo el baloncesto de la NBA en español" },
  { name: "Basket Total",             handle: "BasketTotal",            subs: "890K", desc: "Análisis y debate de NBA y ACB" },
  { name: "LaLiga",                    handle: "LaLiga",                 subs: "2M",   desc: "Canal oficial de LaLiga Santander" },
  { name: "FC Barcelona",             handle: "FCBarcelona_es",         subs: "4M",   desc: "Canal oficial del FC Barcelona" },
  { name: "Real Madrid TV",           handle: "realmadridtv",           subs: "3M",   desc: "Canal oficial del Real Madrid CF" },
  { name: "El Larguero SER",          handle: "ElLarguero",             subs: "1.4M", desc: "El histórico programa nocturno de Cadena SER" },
];

type Tab = "youtube" | "twitter" | "instagram" | "tiktok";

export default function SocialPage() {
  const { lang } = useParams() as { lang: string };
  const [activeTab, setActiveTab] = useState<Tab>("youtube");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  useEffect(() => {
    fetch("/api/youtube")
      .then((r) => r.json())
      .then((data: YouTubeVideo[]) => setVideos(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingVideos(false));
  }, []);

  const filteredAccounts = TOP_ACCOUNTS.filter((a) => a.platform === activeTab);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display tracking-wide text-white">Redes Sociales</h1>
          <p className="text-gray-400 text-sm mt-1">Los mejores creadores y cuentas del deporte en español</p>
        </div>
        <Link
          href={`/${lang}/social/creadores`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sport-card border border-sport-border hover:border-gold-500/50 text-sm text-white transition-colors"
        >
          <Users size={16} /> Creadores
        </Link>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(["youtube", "twitter", "instagram", "tiktok"] as Tab[]).map((tab) => {
          const active = activeTab === tab;
          const styles: Record<Tab, string> = {
            youtube:   active ? "text-red-400 border-red-500/40 bg-red-500/10" : "text-gray-500 border-sport-border bg-sport-card hover:text-red-400",
            twitter:   active ? "text-sky-400 border-sky-500/40 bg-sky-500/10" : "text-gray-500 border-sport-border bg-sport-card hover:text-sky-400",
            instagram: active ? "text-pink-400 border-pink-500/40 bg-pink-500/10" : "text-gray-500 border-sport-border bg-sport-card hover:text-pink-400",
            tiktok:    active ? "text-white border-white/25 bg-white/8" : "text-gray-500 border-sport-border bg-sport-card hover:text-white",
          };
          const icons:  Record<Tab, string> = { youtube: "▶", twitter: "𝕏", instagram: "◈", tiktok: "♫" };
          const labels: Record<Tab, string> = { youtube: "YouTube", twitter: "Twitter / X", instagram: "Instagram", tiktok: "TikTok" };
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-colors ${styles[tab]}`}>
              {icons[tab]} {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* YouTube section */}
      {activeTab === "youtube" && (
        <div className="space-y-8">
          {/* Latest real videos via RSS */}
          <section>
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-500 rounded-full" />
              Últimos vídeos
            </h2>
            {loadingVideos ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-video bg-sport-card border border-sport-border rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((v) => (
                  <YouTubeCard key={v.videoId} videoId={v.videoId} title={v.title} channelName={v.channelName}
                    thumbnail={v.thumbnail} channelAvatar={v.channelAvatar} channelUrl={v.channelUrl} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-4">No se pudieron cargar los vídeos. Prueba de nuevo más tarde.</p>
            )}
          </section>

          {/* Channel directory */}
          <section>
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-500/50 rounded-full" />
              Canales recomendados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {YOUTUBE_CHANNELS.map((ch) => (
                <a key={ch.handle} href={`https://youtube.com/@${ch.handle}`} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-3 bg-sport-card border border-sport-border rounded-xl hover:border-red-500/40 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://unavatar.io/youtube/@${ch.handle}`} alt={ch.name}
                    className="w-10 h-10 rounded-full border border-red-500/30 object-cover shrink-0 bg-sport-border"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-red-400 transition-colors">{ch.name}</p>
                    <p className="text-xs text-gray-500">{ch.subs} suscriptores · {ch.desc}</p>
                  </div>
                  <Play size={14} className="text-gray-600 group-hover:text-red-400 shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Twitter / Instagram / TikTok */}
      {activeTab !== "youtube" && (
        <section>
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <span className={`w-1 h-5 rounded-full ${activeTab === "twitter" ? "bg-sky-500" : activeTab === "instagram" ? "bg-pink-500" : "bg-white/40"}`} />
            Cuentas destacadas en {PLATFORM_META[activeTab].label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredAccounts.map((acc) => {
              const meta = PLATFORM_META[acc.platform];
              const avatarSrc = `https://unavatar.io/${acc.platform}/${acc.username}`;
              return (
                <a key={acc.username} href={acc.profileUrl} target="_blank" rel="noopener noreferrer"
                  className={`group rounded-2xl border p-4 transition-all hover:scale-[1.01] ${meta.bg} ${meta.border}`}>
                  <div className="flex items-start gap-3 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarSrc} alt={acc.displayName}
                      className="w-12 h-12 rounded-full border border-white/10 object-cover shrink-0 bg-sport-card"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.displayName)}&background=1a1a2e&color=ffffff&size=48`;
                      }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-semibold text-white text-sm">{acc.displayName}</p>
                        <span className={`text-xs font-semibold ${meta.color}`}>{meta.icon}</span>
                      </div>
                      <p className={`text-xs ${meta.color}`}>@{acc.username}</p>
                      <p className="text-xs text-gray-600">{acc.followers}</p>
                    </div>
                    <ExternalLink size={14} className={`${meta.color} shrink-0 opacity-60 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">{acc.description}</p>
                  <div className={`text-xs font-medium ${meta.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                    Ver en {meta.label} →
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
