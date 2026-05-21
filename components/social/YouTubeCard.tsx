"use client";
import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import Image from "next/image";

interface YouTubeCardProps {
  videoId: string;
  title: string;
  channelName: string;
  thumbnail?: string;
  channelAvatar?: string;
  channelUrl?: string;
  duration?: string;
  views?: string;
}

export default function YouTubeCard({
  videoId,
  title,
  channelName,
  thumbnail,
  channelAvatar,
  channelUrl,
  duration,
  views,
}: YouTubeCardProps) {
  const [playing, setPlaying] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const thumbUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className="group bg-sport-card border border-sport-border rounded-2xl overflow-hidden hover:border-red-500/40 transition-all hover:shadow-lg hover:shadow-red-500/10">
      {/* Thumbnail / player */}
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <>
            <Image
              src={thumbUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label={`Reproducir ${title}`}
            >
              <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-xl shadow-red-600/50 transition-all hover:scale-110">
                <Play size={24} className="text-white ml-1" fill="white" />
              </div>
            </button>
            {duration && (
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                {duration}
              </span>
            )}
          </>
        )}
      </div>

      {/* Info row */}
      <div className="p-3">
        <div className="flex items-start gap-2">
          {/* Channel avatar */}
          <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-red-600 flex items-center justify-center">
            {channelAvatar && !avatarFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={channelAvatar}
                alt={channelName}
                className="w-full h-full object-cover"
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <span className="text-white font-bold text-xs">▶</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white line-clamp-2 group-hover:text-red-400 transition-colors">
              {title}
            </p>
            <div className="flex items-center justify-between mt-1">
              <a
                href={channelUrl || `https://youtube.com/results?search_query=${encodeURIComponent(channelName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {channelName}
              </a>
              <div className="flex items-center gap-2">
                {views && <span className="text-xs text-gray-600">{views}</span>}
                <a
                  href={`https://youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
