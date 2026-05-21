import Link from "next/link";
import { MessageSquare, TrendingUp } from "lucide-react";
import { FORUM_TOPICS } from "@/lib/utils";

interface ForumTopicsProps {
  lang: string;
  activeSlug?: string;
}

export default function ForumTopics({ lang, activeSlug }: ForumTopicsProps) {
  return (
    <div className="space-y-2">
      {FORUM_TOPICS.map((topic) => (
        <Link
          key={topic.slug}
          href={`/${lang}/foros/${topic.slug}`}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
            activeSlug === topic.slug
              ? "bg-gold-500/15 border border-gold-500/40 text-gold-400"
              : "hover:bg-white/5 text-gray-300 hover:text-white"
          }`}
        >
          <span className="text-lg">{topic.icon}</span>
          <span className="text-sm font-medium flex-1">{topic.label}</span>
          <MessageSquare size={13} className="text-gray-600" />
        </Link>
      ))}
    </div>
  );
}

export function ForumTopicGrid({ lang }: { lang: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {FORUM_TOPICS.map((topic) => (
        <Link
          key={topic.slug}
          href={`/${lang}/foros/${topic.slug}`}
          className="group relative bg-sport-card border border-sport-border rounded-2xl p-5 hover:border-gold-500/40 transition-all overflow-hidden hover:shadow-lg"
        >
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${topic.color}`}
          />
          <div className="relative">
            <span className="text-3xl mb-3 block">{topic.icon}</span>
            <h3 className="font-semibold text-white group-hover:text-gold-400 transition-colors">
              {topic.label}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  topic.sport === "football"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : topic.sport === "basketball"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-purple-500/20 text-purple-400"
                }`}
              >
                {topic.sport === "football" ? "⚽ Fútbol" : topic.sport === "basketball" ? "🏀 Baloncesto" : "🏆 Otros"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
              <TrendingUp size={12} />
              <span>Debates activos</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
