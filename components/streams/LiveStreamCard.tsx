"use client";
import { ExternalLink, Users, Radio, Tv2 } from "lucide-react";
import { StreamChannel } from "@/app/api/streams/route";
import { useState } from "react";

const PLATFORM_STYLE: Record<string, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
  twitch: { bg: "bg-purple-500/10 border-purple-500/30", color: "text-purple-400", icon: <span className="text-purple-400">◉</span>, label: "Twitch" },
  youtube: { bg: "bg-red-500/10 border-red-500/30", color: "text-red-400", icon: <span className="text-red-400 font-bold text-xs">▶</span>, label: "YouTube" },
  radio: { bg: "bg-blue-500/10 border-blue-500/30", color: "text-blue-400", icon: <Radio size={14} className="text-blue-400" />, label: "Radio" },
};

const CATEGORY_ICONS: Record<string, string> = {
  futbol: "⚽",
  baloncesto: "🏀",
  debate: "💬",
  podcast: "🎙️",
  multideporte: "🏆",
};

function Avatar({ channel, p }: { channel: StreamChannel; p: (typeof PLATFORM_STYLE)[string] }) {
  const [failed, setFailed] = useState(false);

  if (channel.avatarUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={channel.avatarUrl}
        alt={channel.name}
        className={`w-10 h-10 rounded-full border object-cover shrink-0 ${p.bg}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 font-bold text-sm ${p.bg} ${p.color}`}>
      {channel.name[0].toUpperCase()}
    </div>
  );
}

export default function LiveStreamCard({ channel }: { channel: StreamChannel }) {
  const p = PLATFORM_STYLE[channel.platform];
  const categoryIcon = CATEGORY_ICONS[channel.category] || "📺";

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${
      channel.isLive
        ? "border-purple-500/40 shadow-lg shadow-purple-500/10"
        : "border-sport-border hover:border-gold-500/30"
    } bg-sport-card`}>
      {/* Live thumbnail */}
      {channel.isLive && channel.thumbnailUrl && (
        <div className="relative aspect-video bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={channel.thumbnailUrl} alt={channel.name} className="w-full h-full object-cover opacity-80" />
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            EN VIVO
          </div>
          {channel.viewerCount !== undefined && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
              <Users size={11} />
              {channel.viewerCount.toLocaleString("es")}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar channel={channel} p={p} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-white text-sm truncate">{channel.name}</span>
                {channel.isLive && (
                  <span className="flex items-center gap-0.5 text-xs font-bold text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className={`flex items-center gap-1 text-xs ${p.color}`}>{p.icon} {p.label}</span>
                <span className="text-gray-700">·</span>
                <span className="text-xs text-gray-600">{categoryIcon} {channel.category}</span>
                <span className="text-gray-700">·</span>
                <span className="text-xs text-gray-600">{channel.followers}</span>
              </div>
            </div>
          </div>

          <a
            href={channel.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              channel.isLive
                ? "bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30"
                : `${p.bg} ${p.color} hover:opacity-80`
            }`}
          >
            {channel.isLive ? <Tv2 size={13} /> : <ExternalLink size={13} />}
            {channel.isLive ? "Ver en vivo" : "Ver canal"}
          </a>
        </div>

        {channel.currentTitle && (
          <p className="text-xs text-gray-400 mt-2 line-clamp-1 italic">🎬 {channel.currentTitle}</p>
        )}

        {!channel.isLive && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{channel.description}</p>
        )}

        {channel.streamUrl && (
          <a
            href={channel.streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 mt-2 text-xs text-blue-400 hover:text-blue-300"
          >
            <Radio size={11} /> Escuchar en directo
          </a>
        )}
      </div>
    </div>
  );
}
