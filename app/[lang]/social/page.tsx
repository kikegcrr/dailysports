"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import YouTubeCard from "@/components/social/YouTubeCard";
import Link from "next/link";
import { Users, ExternalLink, Play } from "lucide-react";
import { YouTubeVideo } from "@/app/api/youtube/route";

// Top Spanish sports Twitter accounts — verified handles
const TWITTER_ACCOUNTS = [
  { username: "2010MisterChip",  displayName: "Mister Chip",       description: "El estadístico más famoso del fútbol español. Datos y resultados en tiempo real.", followers: "2.1M" },
  { username: "FabrizioRomano",  displayName: "Fabrizio Romano",   description: "\"Here we go!\" El periodista de transferencias más seguido del mundo.", followers: "22M" },
  { username: "elchiringuitotv", displayName: "El Chiringuito TV", description: "El debate deportivo más polémico de España, ahora en X.", followers: "3M" },
  { username: "Alfremartinezz",  displayName: "Alfredo Martínez",  description: "Periodista Onda Cero especializado en el Real Madrid. Noticias de primera mano.", followers: "920K" },
  { username: "marca",           displayName: "MARCA",             description: "El periódico deportivo más leído de España.", followers: "5M" },
  { username: "mundodeportivo",  displayName: "Mundo Deportivo",   description: "Todas las noticias del FC Barcelona y el deporte internacional.", followers: "2.8M" },
  { username: "AS_com",          displayName: "Diario AS",         description: "El deporte español y mundial en directo.", followers: "4.8M" },
  { username: "relevo",          displayName: "Relevo",            description: "El nuevo referente del periodismo deportivo digital.", followers: "580K" },
  { username: "LaLiga",          displayName: "LaLiga EA Sports",  description: "Cuenta oficial de LaLiga. Resultados, stats y todo el fútbol español.", followers: "11M" },
  { username: "realmadrid",      displayName: "Real Madrid CF",    description: "Cuenta oficial del club más laureado del mundo.", followers: "43M" },
  { username: "FCBarcelona_es",  displayName: "FC Barcelona",      description: "Canal oficial del FC Barcelona en español.", followers: "12M" },
  { username: "Atleti",          displayName: "Atlético de Madrid",description: "Cuenta oficial del Atlético de Madrid.", followers: "5.2M" },
  { username: "NBASpain",        displayName: "NBA España",        description: "La NBA en español. Noticias, resultados y vídeos.", followers: "1.4M" },
  { username: "JijantesFC",      displayName: "Jijantes FC",       description: "El canal de Gerard Romero y Jan. Opinión sin filtros.", followers: "940K" },
  { username: "ChampionsLeague", displayName: "Champions League",  description: "Cuenta oficial de la UEFA Champions League.", followers: "42M" },
  { username: "carrusel",        displayName: "Carrusel Deportivo",description: "El programa deportivo referente de los fines de semana en la SER.", followers: "850K" },
];

const YOUTUBE_CHANNELS = [
  { name: "El Chiringuito de Jugones", handle: "elchiringuitodejugones", subs: "3.8M", desc: "El debate nocturno más polémico del fútbol español" },
  { name: "Jijantes FC",               handle: "JijantesFC",             subs: "2.1M", desc: "Opinión y debate futbolístico sin filtros" },
  { name: "Relevo",                    handle: "relevo",                 subs: "950K", desc: "El medio deportivo digital de nueva generación" },
  { name: "NBA España",                handle: "NBAEspana",              subs: "1.2M", desc: "Todo el baloncesto de la NBA en español" },
  { name: "Basket Total",              handle: "BasketTotal",            subs: "890K", desc: "Análisis y debate de NBA y ACB" },
  { name: "LaLiga EA Sports",          handle: "LaLiga",                 subs: "2M",   desc: "Canal oficial de LaLiga EA Sports" },
  { name: "FC Barcelona",              handle: "FCBarcelona_es",         subs: "4M",   desc: "Canal oficial del FC Barcelona" },
  { name: "Real Madrid",               handle: "realmadrid",             subs: "3M",   desc: "Canal oficial del Real Madrid CF" },
  { name: "El Larguero SER",           handle: "ElLarguero",             subs: "1.4M", desc: "El histórico programa nocturno de Cadena SER" },
  { name: "Carrusel Deportivo",        handle: "CarruselDeportivo",      subs: "820K", desc: "El programa deportivo de los fines de semana en la SER" },
  { name: "Tiempo de Juego COPE",      handle: "TiempodeJuegoCOPE",      subs: "640K", desc: "La cobertura en vivo del fútbol en COPE" },
  { name: "Diario AS",                 handle: "diarioas",               subs: "1.1M", desc: "El deporte español en vídeo" },
  { name: "MARCA TV",                  handle: "marcatv",                subs: "890K", desc: "El vídeo periodismo de MARCA" },
  { name: "RTVE Deportes",             handle: "rtvedeportes",           subs: "450K", desc: "Los deportes de la televisión pública española" },
  { name: "Movistar F1",               handle: "movistarF1",             subs: "320K", desc: "Fórmula 1 y motor en Movistar Plus+" },
];

type Tab = "youtube" | "twitter";

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
        {(["youtube", "twitter"] as Tab[]).map((tab) => {
          const active = activeTab === tab;
          const styles: Record<Tab, string> = {
            youtube: active ? "text-red-400 border-red-500/40 bg-red-500/10" : "text-gray-500 border-sport-border bg-sport-card hover:text-red-400",
            twitter: active ? "text-sky-400 border-sky-500/40 bg-sky-500/10" : "text-gray-500 border-sport-border bg-sport-card hover:text-sky-400",
          };
          const icons:  Record<Tab, string> = { youtube: "▶", twitter: "𝕏" };
          const labels: Record<Tab, string> = { youtube: "YouTube", twitter: "Twitter / X" };
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-colors ${styles[tab]}`}>
              {icons[tab]} {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* YouTube */}
      {activeTab === "youtube" && (
        <div className="space-y-8">
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

      {/* Twitter / X */}
      {activeTab === "twitter" && (
        <section>
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-sky-500" />
            Cuentas destacadas en Twitter / X
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TWITTER_ACCOUNTS.map((acc) => (
              <a key={acc.username} href={`https://twitter.com/${acc.username}`} target="_blank" rel="noopener noreferrer"
                className="group flex items-start gap-3 p-4 rounded-2xl border bg-sky-500/5 border-sky-500/20 hover:border-sky-500/50 hover:bg-sky-500/10 transition-all">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://unavatar.io/twitter/${acc.username}`} alt={acc.displayName}
                  className="w-11 h-11 rounded-full border border-white/10 object-cover shrink-0 bg-sport-border"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.displayName)}&background=0f172a&color=ffffff&size=44`;
                  }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-semibold text-white text-sm truncate group-hover:text-sky-300 transition-colors">{acc.displayName}</p>
                    <ExternalLink size={12} className="text-gray-600 group-hover:text-sky-400 shrink-0 transition-colors" />
                  </div>
                  <p className="text-xs text-sky-400/80">@{acc.username} · {acc.followers}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{acc.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
