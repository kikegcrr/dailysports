"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StreamChannel } from "@/app/api/streams/route";
import LiveStreamCard from "@/components/streams/LiveStreamCard";
import { Radio, Tv2, Filter } from "lucide-react";

type PlatformFilter = "all" | "twitch" | "youtube" | "radio";
type CategoryFilter = "all" | "futbol" | "baloncesto" | "debate" | "podcast" | "multideporte";

const PLATFORM_TABS: { key: PlatformFilter; label: string; icon: string }[] = [
  { key: "all", label: "Todo", icon: "📺" },
  { key: "twitch", label: "Twitch", icon: "◉" },
  { key: "youtube", label: "YouTube", icon: "▶" },
  { key: "radio", label: "Radio & Podcast", icon: "🎙️" },
];

const CATEGORY_FILTERS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "futbol", label: "⚽ Fútbol" },
  { key: "baloncesto", label: "🏀 Baloncesto" },
  { key: "debate", label: "💬 Debate" },
  { key: "podcast", label: "🎙️ Podcast" },
  { key: "multideporte", label: "🏆 Multideporte" },
];

export default function DirectoPage() {
  const { lang } = useParams() as { lang: string };
  const [channels, setChannels] = useState<StreamChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (platform !== "all") params.set("platform", platform);
    if (category !== "all") params.set("category", category);

    fetch(`/api/streams?${params}`)
      .then((r) => r.json())
      .then((data: StreamChannel[]) => {
        setChannels(data);
        setLiveCount(data.filter((c) => c.isLive).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [platform, category]);

  // Auto-refresh every minute
  useEffect(() => {
    const id = setInterval(() => {
      const params = new URLSearchParams();
      if (platform !== "all") params.set("platform", platform);
      if (category !== "all") params.set("category", category);
      fetch(`/api/streams?${params}`)
        .then((r) => r.json())
        .then((data: StreamChannel[]) => {
          setChannels(data);
          setLiveCount(data.filter((c) => c.isLive).length);
        })
        .catch(() => {});
    }, 60000);
    return () => clearInterval(id);
  }, [platform, category]);

  const liveChannels = channels.filter((c) => c.isLive);
  const offlineChannels = channels.filter((c) => !c.isLive);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display tracking-wide text-white flex items-center gap-3">
          <Tv2 className="text-purple-400" size={28} />
          Directos & Contenido en Vivo
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Las 200 cuentas más influyentes del deporte en español · Twitch, YouTube, Radio y Podcast
        </p>
      </div>

      {/* Live indicator */}
      {liveCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold text-red-400">
            {liveCount} {liveCount === 1 ? "streamer" : "streamers"} en vivo ahora mismo
          </span>
        </div>
      )}

      {/* Platform tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {PLATFORM_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPlatform(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              platform === tab.key
                ? tab.key === "twitch"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/40"
                  : tab.key === "youtube"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : tab.key === "radio"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                  : "bg-gold-500/20 text-gold-400 border border-gold-500/40"
                : "bg-sport-card border border-sport-border text-gray-400 hover:text-white"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none items-center">
        <Filter size={14} className="text-gray-600 shrink-0" />
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setCategory(f.key)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              category === f.key ? "bg-white/15 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Channels grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-32 bg-sport-card border border-sport-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Live section */}
          {liveChannels.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                En vivo ahora ({liveChannels.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveChannels.map((ch) => (
                  <LiveStreamCard key={ch.id} channel={ch} />
                ))}
              </div>
            </section>
          )}

          {/* All channels */}
          <section>
            {liveChannels.length > 0 && (
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Todos los canales ({offlineChannels.length})
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offlineChannels.map((ch) => (
                <LiveStreamCard key={ch.id} channel={ch} />
              ))}
            </div>
          </section>

          {channels.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Radio size={40} className="mx-auto mb-3 opacity-30" />
              <p>No hay canales disponibles con este filtro</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
