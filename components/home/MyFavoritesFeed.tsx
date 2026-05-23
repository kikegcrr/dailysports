"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Star, ExternalLink, LogIn } from "lucide-react";
import { useFavorites } from "@/lib/favorites-context";
import { useAuth } from "@/components/auth/AuthProvider";
import { NewsItem } from "@/lib/rss";
import NewsCard from "@/components/news/NewsCard";
import { TEAMS } from "@/components/news/MyTeamFeed";
import { CREATORS } from "@/lib/creators-data";

// ─── League → keywords ────────────────────────────────────────────────────────
const LEAGUE_KEYWORDS: Record<string, string[]> = {
  laliga:      ["LaLiga", "La Liga"],
  champions:   ["Champions League", "UCL"],
  premier:     ["Premier League"],
  seriea:      ["Serie A"],
  bundesliga:  ["Bundesliga"],
  ligue1:      ["Ligue 1"],
  ligaportugal:["Liga Portugal", "Primeira Liga"],
  europa:      ["Europa League", "Conference League"],
  nba:         ["NBA"],
  euroleague:  ["EuroLeague", "Euroleague"],
  acb:         ["ACB", "Liga ACB", "Liga Endesa"],
  atp:         ["ATP", "Roland Garros", "Wimbledon", "US Open"],
  wta:         ["WTA"],
};

const SPORT_TO_CATEGORY: Record<string, string> = {
  football:   "football",
  basketball: "basketball",
  tennis:     "other",
};

const PLATFORM_ICON: Record<string, string> = {
  youtube: "▶", twitch: "◉", twitter: "𝕏", instagram: "◈", tiktok: "♫",
};
const PLATFORM_COLOR: Record<string, string> = {
  youtube: "text-red-400", twitch: "text-purple-400", twitter: "text-sky-400",
  instagram: "text-pink-400", tiktok: "text-white",
};

function matchesAny(title: string, keywords: string[]): boolean {
  const t = title.toLowerCase();
  return keywords.some((kw) => t.includes(kw.toLowerCase()));
}

function CreatorPill({ creatorId }: { creatorId: string }) {
  const creator = CREATORS.find((c) => c.id === creatorId);
  if (!creator) return null;
  return (
    <a
      href={creator.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sport-card border border-sport-border hover:border-gold-500/40 text-sm text-white transition-all group shrink-0"
    >
      <span className={PLATFORM_COLOR[creator.platform] ?? "text-gray-400"}>
        {PLATFORM_ICON[creator.platform] ?? "◎"}
      </span>
      <span className="font-medium truncate max-w-[140px]">{creator.name}</span>
      <ExternalLink size={11} className="text-gray-600 group-hover:text-gold-400 transition-colors shrink-0" />
    </a>
  );
}

// ─── Section wrapper — always rendered ────────────────────────────────────────
function SectionShell({
  children,
  lang,
  showManage,
}: {
  children: React.ReactNode;
  lang: string;
  showManage?: boolean;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Star size={17} className="text-gold-400" fill="currentColor" />
          Para ti
        </h2>
        {showManage && (
          <Link
            href={`/${lang}/perfil`}
            className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
          >
            Gestionar →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MyFavoritesFeed({ lang }: { lang: string }) {
  const { favorites, loading: favLoading } = useFavorites();
  const { user, loading: authLoading } = useAuth();
  const [newsItems,   setNewsItems]   = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const hasFavorites =
    favorites.sports.size   > 0 || favorites.leagues.size  > 0 ||
    favorites.teams.size    > 0 || favorites.creators.size > 0 ||
    favorites.players.size  > 0;

  const keywords = useMemo(() => {
    const kws: string[] = [];
    favorites.players.forEach((p) => kws.push(p));
    favorites.teams.forEach((id) => {
      TEAMS.find((t) => t.id === id)?.keywords.forEach((k) => kws.push(k));
    });
    favorites.leagues.forEach((lg) => {
      LEAGUE_KEYWORDS[lg]?.forEach((k) => kws.push(k));
    });
    return kws;
  }, [favorites.teams, favorites.leagues, favorites.players]);

  const favCategories = useMemo(
    () => [...favorites.sports].map((s) => SPORT_TO_CATEGORY[s]).filter(Boolean),
    [favorites.sports],
  );

  useEffect(() => {
    if (favLoading || !hasFavorites) return;
    if (keywords.length === 0 && favCategories.length === 0) return;

    setNewsLoading(true);
    fetch("/api/news")
      .then((r) => r.json())
      .then((data: NewsItem[]) => {
        const filtered = data.filter(
          (item) =>
            favCategories.includes(item.category) ||
            matchesAny(item.title, keywords),
        );
        setNewsItems(filtered.slice(0, 9));
      })
      .finally(() => setNewsLoading(false));
  }, [hasFavorites, favLoading, keywords, favCategories]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (favLoading || authLoading) {
    return (
      <SectionShell lang={lang}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-44 bg-sport-card border border-sport-border rounded-2xl animate-pulse" />
          ))}
        </div>
      </SectionShell>
    );
  }

  // ── Guest with no favorites → sign-up CTA ────────────────────────────────
  if (!user && !hasFavorites) {
    return (
      <SectionShell lang={lang}>
        <div className="bg-sport-card border border-sport-border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
            <Star size={22} className="text-gold-400" fill="currentColor" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white font-semibold">Contenido personalizado para ti</p>
            <p className="text-gray-400 text-sm mt-1">
              Crea una cuenta gratuita, guarda tus equipos, jugadores y creadores favoritos y verás aquí solo lo que te interesa.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href={`/${lang}/registro`}
              className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm transition-colors"
            >
              Crear cuenta
            </Link>
            <Link
              href={`/${lang}/login`}
              className="px-4 py-2 rounded-xl border border-sport-border text-gray-300 hover:text-white hover:border-white/30 text-sm transition-colors flex items-center gap-1.5"
            >
              <LogIn size={14} /> Entrar
            </Link>
          </div>
        </div>
      </SectionShell>
    );
  }

  // ── Logged in but no favorites yet ───────────────────────────────────────
  if (!hasFavorites) {
    return (
      <SectionShell lang={lang} showManage>
        <div className="bg-sport-card border border-sport-border rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
              <Star size={16} className="text-gold-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Personaliza tu feed</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Guarda deportes, equipos, jugadores y creadores para ver aquí tu contenido.
              </p>
            </div>
          </div>
          <Link
            href={`/${lang}/perfil`}
            className="shrink-0 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm font-medium hover:bg-gold-500/20 transition-colors whitespace-nowrap"
          >
            Configurar →
          </Link>
        </div>
      </SectionShell>
    );
  }

  // ── Feed with content ─────────────────────────────────────────────────────
  const favCreatorIds = [...favorites.creators];

  return (
    <SectionShell lang={lang} showManage>
      {/* Favorite creator pills */}
      {favCreatorIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {favCreatorIds.map((id) => (
            <CreatorPill key={id} creatorId={id} />
          ))}
        </div>
      )}

      {/* Filtered news */}
      {newsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-48 bg-sport-card border border-sport-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : newsItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsItems.slice(0, 6).map((item) => (
              <NewsCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
          {newsItems.length > 6 && (
            <div className="bg-sport-card border border-sport-border rounded-2xl divide-y divide-sport-border">
              {newsItems.slice(6).map((item) => (
                <NewsCard key={item.id} item={item} lang={lang} compact />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-sport-card border border-sport-border rounded-2xl p-6 text-center">
          <p className="text-gray-500 text-sm">No hay noticias recientes sobre tus favoritos.</p>
          <p className="text-gray-700 text-xs mt-1">
            Añade más equipos o ligas en tu perfil para ver más contenido.
          </p>
        </div>
      )}
    </SectionShell>
  );
}
