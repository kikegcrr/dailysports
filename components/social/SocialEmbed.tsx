"use client";
import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";

export function TwitterEmbed({ tweetUrl, username }: { tweetUrl: string; username: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load Twitter widgets script
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-4">
      <div ref={ref}>
        <blockquote className="twitter-tweet" data-theme="dark">
          <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
            Ver tweet de @{username}
          </a>
        </blockquote>
      </div>
    </div>
  );
}

export function TwitchEmbed({ channel, height = 300 }: { channel: string; height?: number }) {
  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl overflow-hidden">
      <iframe
        src={`https://player.twitch.tv/?channel=${channel}&parent=${typeof window !== "undefined" ? window.location.hostname : "localhost"}&autoplay=false`}
        height={height}
        width="100%"
        allowFullScreen
        title={`Twitch: ${channel}`}
        className="block"
      />
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-sm text-white font-medium">{channel}</span>
          <span className="text-xs text-purple-400">Twitch</span>
        </div>
        <a
          href={`https://twitch.tv/${channel}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-purple-400 transition-colors"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

interface SocialPostCardProps {
  platform: "twitter" | "instagram" | "tiktok";
  username: string;
  displayName: string;
  content: string;
  postUrl: string;
  imageUrl?: string;
  likes?: number;
  timestamp?: string;
  followers?: string;
}

const PLATFORM_STYLES: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  twitter: { color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/30", label: "X / Twitter", icon: "𝕏" },
  instagram: { color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/30", label: "Instagram", icon: "📸" },
  tiktok: { color: "text-white", bg: "bg-black/40 border-white/10", label: "TikTok", icon: "🎵" },
};

export function SocialPostCard({
  platform,
  username,
  displayName,
  content,
  postUrl,
  likes,
  timestamp,
  followers,
}: SocialPostCardProps) {
  const style = PLATFORM_STYLES[platform];

  return (
    <div className={`rounded-2xl border p-4 ${style.bg} transition-all hover:scale-[1.01]`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-sm font-bold text-black">
            {displayName[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{displayName}</p>
            <p className={`text-xs ${style.color}`}>@{username}</p>
            {followers && <p className="text-xs text-gray-600">{followers}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${style.color}`}>
            {style.icon} {style.label}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-200 leading-relaxed mb-3">{content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {likes !== undefined && <span>❤️ {likes.toLocaleString()}</span>}
          {timestamp && <span>{timestamp}</span>}
        </div>
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 text-xs font-medium ${style.color} hover:opacity-80 transition-opacity`}
        >
          Ver publicación <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
