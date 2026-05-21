"use client";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, ExternalLink, Clock } from "lucide-react";
import { NewsItem } from "@/lib/rss";
import { timeAgo, cn } from "@/lib/utils";
import CategoryBadge from "@/components/ui/Badge";

interface NewsCardProps {
  item: NewsItem;
  lang?: string;
  featured?: boolean;
  compact?: boolean;
}

export default function NewsCard({ item, lang = "es", featured, compact }: NewsCardProps) {
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem("savedArticles") || "[]");
    const exists = saved.find((s: NewsItem) => s.id === item.id);
    if (!exists) {
      localStorage.setItem("savedArticles", JSON.stringify([...saved, item]));
    }
  };

  if (compact) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
      >
        {item.imageUrl && (
          <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="64px" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white group-hover:text-gold-400 transition-colors line-clamp-2">
            {item.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gold-500 font-medium">{item.source}</span>
            <span className="text-xs text-gray-600">·</span>
            <span className="text-xs text-gray-500 flex items-center gap-0.5">
              <Clock size={10} /> {timeAgo(item.pubDate, lang)}
            </span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <article
      className={cn(
        "group relative bg-sport-card border border-sport-border rounded-2xl overflow-hidden hover:border-gold-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/10 animate-fade-in",
        featured && "md:col-span-2 md:row-span-2"
      )}
    >
      {/* Image */}
      <a href={item.link} target="_blank" rel="noopener noreferrer">
        <div className={cn("relative overflow-hidden bg-sport-border", featured ? "h-64" : "h-44")}>
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              priority={!!featured}
              loading={featured ? "eager" : "lazy"}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl bg-gradient-to-br from-sport-border to-sport-darker">
              {item.category === "football" ? "⚽" : item.category === "basketball" ? "🏀" : "🏆"}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-sport-card via-transparent to-transparent" />
        </div>
      </a>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <CategoryBadge category={item.category} />
          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg text-gray-600 hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
            title="Guardar"
          >
            <Bookmark size={14} />
          </button>
        </div>

        <a href={item.link} target="_blank" rel="noopener noreferrer">
          <h3
            className={cn(
              "font-semibold text-white group-hover:text-gold-300 transition-colors line-clamp-3 leading-snug",
              featured ? "text-xl" : "text-sm"
            )}
          >
            {item.title}
          </h3>
        </a>

        {featured && item.summary && (
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">{item.summary}</p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-sport-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gold-500">{item.source}</span>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={11} />
              {timeAgo(item.pubDate, lang)}
            </span>
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gold-400 transition-colors"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </article>
  );
}
