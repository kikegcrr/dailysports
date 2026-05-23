"use client";
import { ExternalLink, Users, Calendar, Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites-context";

export interface Creator {
  id: string;
  name: string;
  username: string;
  platform: "youtube" | "twitch" | "twitter" | "instagram" | "tiktok";
  sport: string;
  followers: string;
  description: string;
  profileUrl: string;
  latestPost?: { title: string; url: string; publishedAt: string };
  schedule?: { day: string; time: string; topic: string }[];
  verified?: boolean;
}

const PLATFORM_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  youtube: { icon: "▶", color: "text-red-400", bg: "bg-red-500/20 border-red-500/30" },
  twitch: { icon: "◉", color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/30" },
  twitter: { icon: "𝕏", color: "text-sky-400", bg: "bg-sky-500/20 border-sky-500/30" },
  instagram: { icon: "◈", color: "text-pink-400", bg: "bg-pink-500/20 border-pink-500/30" },
  tiktok: { icon: "♫", color: "text-white", bg: "bg-white/10 border-white/20" },
};

export default function CreatorCard({ creator }: { creator: Creator }) {
  const { has, toggle } = useFavorites();
  const saved = has("creator", creator.id);
  const p = PLATFORM_ICONS[creator.platform];

  return (
    <div className="group bg-sport-card border border-sport-border rounded-2xl p-5 hover:border-gold-500/40 transition-all hover:shadow-lg hover:shadow-gold-500/10">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-amber-700 flex items-center justify-center text-lg font-bold text-black shrink-0">
            {creator.name[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-white">{creator.name}</p>
              {creator.verified && <span className="text-gold-400 text-xs">✓</span>}
            </div>
            <p className={`text-xs ${p.color}`}>@{creator.username}</p>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
              <Users size={10} /> {creator.followers}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`border rounded-lg px-2 py-1 text-xs font-semibold ${p.bg} ${p.color}`}>
            {p.icon} {creator.platform}
          </span>
          <button
            onClick={() => toggle("creator", creator.id)}
            title={saved ? "Quitar de favoritos" : "Añadir a favoritos"}
            className={`p-1.5 rounded-lg transition-colors ${
              saved ? "text-red-400 bg-red-500/10" : "text-gray-600 hover:text-red-400 hover:bg-red-500/10"
            }`}
          >
            <Heart size={14} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{creator.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs bg-sport-border px-2 py-0.5 rounded-full text-gray-400">
          🏅 {creator.sport}
        </span>
      </div>

      {/* Schedule */}
      {creator.schedule && creator.schedule.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Calendar size={10} /> Próximos directos
          </p>
          <div className="space-y-1">
            {creator.schedule.slice(0, 2).map((s, i) => (
              <div key={i} className="flex items-center justify-between bg-sport-border/50 rounded-lg px-2.5 py-1.5">
                <span className="text-xs font-medium text-gold-400">{s.day}</span>
                <span className="text-xs text-gray-400">{s.time}</span>
                <span className="text-xs text-gray-500 truncate max-w-[120px]">{s.topic}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest post */}
      {creator.latestPost && (
        <div className="mb-3 p-2.5 bg-sport-border/40 rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Última publicación</p>
          <a
            href={creator.latestPost.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-medium ${p.color} hover:opacity-80 transition-opacity line-clamp-1`}
          >
            {creator.latestPost.title}
          </a>
          <p className="text-xs text-gray-600 mt-0.5">{creator.latestPost.publishedAt}</p>
        </div>
      )}

      <a
        href={creator.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-400 text-sm font-medium transition-colors"
      >
        Ver perfil <ExternalLink size={13} />
      </a>
    </div>
  );
}
