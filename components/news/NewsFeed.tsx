"use client";
import { useEffect, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { NewsItem } from "@/lib/rss";
import NewsCard from "./NewsCard";
import MyTeamFeed from "./MyTeamFeed";
import NewspaperFeed from "./NewspaperFeed";

type Category = "all" | "football" | "basketball" | "other" | "myteam" | "newspapers";

const TABS: { key: Category; label: string; icon: string }[] = [
  { key: "all",        label: "Todo",        icon: "📰" },
  { key: "football",   label: "Fútbol",      icon: "⚽" },
  { key: "basketball", label: "Baloncesto",  icon: "🏀" },
  { key: "other",      label: "Otros",       icon: "🏆" },
  { key: "myteam",     label: "Mi Equipo",   icon: "❤️" },
  { key: "newspapers", label: "Periódicos",  icon: "🗞️" },
];

export default function NewsFeed({ lang, defaultCategory = "all" }: { lang: string; defaultCategory?: Category }) {
  const [items,      setItems]      = useState<NewsItem[]>([]);
  const [allItems,   setAllItems]   = useState<NewsItem[]>([]);   // unfiltered, for Mi Equipo
  const [category,   setCategory]   = useState<Category>(defaultCategory);
  const [loading,    setLoading]    = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchCategory = useCallback(async (cat: Category) => {
    setLoading(true);
    try {
      // myteam and newspapers both need the unfiltered pool; fetch without category filter
      const needsAll = cat === "myteam" || cat === "newspapers";
      const apiCat = needsAll ? "all" : cat;
      const url = apiCat === "all" ? "/api/news" : `/api/news?category=${apiCat}`;
      const res  = await fetch(url);
      const data: NewsItem[] = await res.json();
      if (needsAll || cat === "all") setAllItems(data);
      setItems(data);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategory(category);
    const id = setInterval(() => fetchCategory(category), 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [category, fetchCategory]);

  const featured = items.slice(0, 1);
  const grid     = items.slice(1, 7);
  const compact  = items.slice(7, 55);

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCategory(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              category === tab.key
                ? tab.key === "myteam"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : "bg-gold-500/20 text-gold-400 border border-gold-500/40"
                : tab.key === "myteam"
                ? "bg-sport-card border border-rose-500/20 text-gray-400 hover:text-rose-400 hover:border-rose-500/40"
                : "bg-sport-card border border-sport-border text-gray-400 hover:text-white hover:border-white/20"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}

        <button
          onClick={() => fetchCategory(category)}
          disabled={loading}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-white border border-sport-border hover:border-white/20 bg-sport-card transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {lastUpdate && (
            <span className="hidden sm:inline">
              {lastUpdate.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </button>
      </div>

      {/* Mi Equipo tab */}
      {category === "myteam" && (
        <MyTeamFeed allItems={allItems} lang={lang} loading={loading} />
      )}

      {/* Periódicos tab */}
      {category === "newspapers" && (
        <NewspaperFeed allItems={allItems} lang={lang} loading={loading} />
      )}

      {/* Regular tabs */}
      {category !== "myteam" && category !== "newspapers" && (
        <>
          {loading && !items.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-sport-card border border-sport-border rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Featured + sidebar */}
              {featured.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <NewsCard item={featured[0]} lang={lang} featured />
                  </div>
                  <div className="space-y-4">
                    {items.slice(1, 4).map((item) => (
                      <NewsCard key={item.id} item={item} lang={lang} compact />
                    ))}
                  </div>
                </div>
              )}

              {/* Main grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grid.map((item) => (
                  <NewsCard key={item.id} item={item} lang={lang} />
                ))}
              </div>

              {/* Compact list */}
              {compact.length > 0 && (
                <div className="bg-sport-card border border-sport-border rounded-2xl divide-y divide-sport-border">
                  <div className="px-4 py-3">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Más noticias
                    </h3>
                  </div>
                  {compact.map((item) => (
                    <NewsCard key={item.id} item={item} lang={lang} compact />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
