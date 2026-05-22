"use client";
import { useState, useEffect, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";
import { NewsItem } from "@/lib/rss";
import NewsCard from "./NewsCard";

// ─── Team definitions ─────────────────────────────────────────────────────────
export interface Team {
  id: string;
  name: string;
  abbr: string;        // 2-3 chars shown in the badge
  bg: string;          // Tailwind bg class
  text: string;        // Tailwind text class
  border: string;      // Tailwind border class
  keywords: string[];  // case-insensitive match against news title
}

export const TEAMS: Team[] = [
  // ── LaLiga – Top clubs ──────────────────────────────────────────────────────
  {
    id: "real-madrid",
    name: "Real Madrid",
    abbr: "RMA",
    bg: "bg-white/10",
    text: "text-white",
    border: "border-white/30",
    keywords: ["Real Madrid", "Merengue", "Blancos", "Bernabéu", "Ancelotti", "Mbappé", "Vinicius", "Bellingham", "Kroos", "Modric"],
  },
  {
    id: "barcelona",
    name: "FC Barcelona",
    abbr: "FCB",
    bg: "bg-blue-700/30",
    text: "text-blue-300",
    border: "border-blue-600/40",
    keywords: ["Barcelona", "Barça", "Blaugrana", "Culé", "Camp Nou", "Spotify Camp Nou", "Flick", "Lamine Yamal", "Lewandowski", "Gavi", "Pedri", "De Jong"],
  },
  {
    id: "atletico",
    name: "Atlético de Madrid",
    abbr: "ATM",
    bg: "bg-red-700/30",
    text: "text-red-400",
    border: "border-red-600/40",
    keywords: ["Atlético", "Atleti", "Colchoneros", "Simeone", "Griezmann", "Metropolitano", "Atlético de Madrid"],
  },
  {
    id: "sevilla",
    name: "Sevilla FC",
    abbr: "SEV",
    bg: "bg-red-900/30",
    text: "text-red-300",
    border: "border-red-800/40",
    keywords: ["Sevilla FC", "Sevillista", "Nervionense", "Sánchez-Pizjuán", "Nervión"],
  },
  {
    id: "valencia",
    name: "Valencia CF",
    abbr: "VCF",
    bg: "bg-orange-500/20",
    text: "text-orange-300",
    border: "border-orange-500/30",
    keywords: ["Valencia CF", "Che", "Mestalla", " Valencia "],
  },
  {
    id: "athletic",
    name: "Athletic Club",
    abbr: "ATH",
    bg: "bg-red-800/30",
    text: "text-red-300",
    border: "border-red-700/40",
    keywords: ["Athletic Club", "Athletic de Bilbao", "Bilbao", "San Mamés", "Athletic Bilbao"],
  },
  {
    id: "betis",
    name: "Real Betis",
    abbr: "BET",
    bg: "bg-green-700/30",
    text: "text-green-400",
    border: "border-green-600/40",
    keywords: ["Real Betis", "Betis", "Béticos", "Pellegrini", "Villamarín"],
  },
  {
    id: "villarreal",
    name: "Villarreal CF",
    abbr: "VIL",
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    keywords: ["Villarreal", "Submarino Amarillo", "Cerámica"],
  },
  {
    id: "real-sociedad",
    name: "Real Sociedad",
    abbr: "RSO",
    bg: "bg-sky-700/30",
    text: "text-sky-300",
    border: "border-sky-600/40",
    keywords: ["Real Sociedad", "Txuri-urdin", "Anoeta", "Alguacil"],
  },
  {
    id: "osasuna",
    name: "CA Osasuna",
    abbr: "OSA",
    bg: "bg-red-700/20",
    text: "text-red-400",
    border: "border-red-600/30",
    keywords: ["Osasuna", "El Sadar", "rojillos", "Pamplona"],
  },
  {
    id: "girona",
    name: "Girona FC",
    abbr: "GIR",
    bg: "bg-red-600/20",
    text: "text-red-300",
    border: "border-red-500/30",
    keywords: ["Girona", "Montilivi"],
  },
  {
    id: "rayo",
    name: "Rayo Vallecano",
    abbr: "RAY",
    bg: "bg-red-600/20",
    text: "text-yellow-300",
    border: "border-yellow-600/30",
    keywords: ["Rayo Vallecano", "Rayo Vallecano"],
  },
  {
    id: "getafe",
    name: "Getafe CF",
    abbr: "GET",
    bg: "bg-blue-600/20",
    text: "text-blue-300",
    border: "border-blue-600/30",
    keywords: ["Getafe", "Azulón", "Coliseum"],
  },
  {
    id: "celta",
    name: "Celta de Vigo",
    abbr: "CEL",
    bg: "bg-sky-500/20",
    text: "text-sky-300",
    border: "border-sky-500/30",
    keywords: ["Celta", "Celta de Vigo", "Celta Vigo", "Balaídos"],
  },
  {
    id: "alaves",
    name: "Deportivo Alavés",
    abbr: "ALA",
    bg: "bg-blue-700/20",
    text: "text-blue-300",
    border: "border-blue-700/30",
    keywords: ["Alavés", "Deportivo Alavés", "Mendizorrotza"],
  },
  {
    id: "mallorca",
    name: "RCD Mallorca",
    abbr: "MAL",
    bg: "bg-red-600/20",
    text: "text-red-300",
    border: "border-red-600/30",
    keywords: ["Mallorca", "RCD Mallorca", "Son Moix"],
  },
  {
    id: "espanyol",
    name: "RCD Espanyol",
    abbr: "ESP",
    bg: "bg-blue-500/20",
    text: "text-blue-300",
    border: "border-blue-500/30",
    keywords: ["Espanyol", "RCD Espanyol", "Pericos", "Cornellà"],
  },
  {
    id: "las-palmas",
    name: "UD Las Palmas",
    abbr: "LPA",
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    keywords: ["Las Palmas", "UD Las Palmas", "Gran Canaria"],
  },
  {
    id: "leganes",
    name: "CD Leganés",
    abbr: "LEG",
    bg: "bg-blue-800/20",
    text: "text-blue-300",
    border: "border-blue-800/30",
    keywords: ["Leganés", "Pepineros", "Butarque"],
  },
  {
    id: "valladolid",
    name: "Real Valladolid",
    abbr: "VLL",
    bg: "bg-purple-700/20",
    text: "text-purple-300",
    border: "border-purple-700/30",
    keywords: ["Valladolid", "Real Valladolid", "Pucela", "Zorrilla"],
  },
];

const STORAGE_KEY = "mi_equipo";

// ─── Team badge ───────────────────────────────────────────────────────────────
function TeamBadge({ team, size = "md" }: { team: Team; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-10 h-10 text-xs", md: "w-14 h-14 text-sm", lg: "w-20 h-20 text-base" };
  return (
    <div className={`${sizes[size]} rounded-2xl flex items-center justify-center font-bold border ${team.bg} ${team.text} ${team.border}`}>
      {team.abbr}
    </div>
  );
}

// ─── Team selector modal ───────────────────────────────────────────────────────
function TeamSelectorModal({ onSelect, onClose }: { onSelect: (t: Team) => void; onClose?: () => void }) {
  return (
    <div className="relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      )}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-white">Elige tu equipo</h3>
        <p className="text-sm text-gray-400 mt-1">Verás todas las noticias relacionadas con tu club</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {TEAMS.map((team) => (
          <button
            key={team.id}
            onClick={() => onSelect(team)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${team.bg} ${team.border} hover:brightness-125`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border ${team.bg} ${team.text} ${team.border}`}>
              {team.abbr}
            </div>
            <span className={`text-xs font-medium text-center leading-tight ${team.text}`}>
              {team.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface MyTeamFeedProps {
  allItems: NewsItem[];
  lang: string;
  loading: boolean;
}

export default function MyTeamFeed({ allItems, lang, loading }: MyTeamFeedProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage once mounted
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const found = TEAMS.find((t) => t.id === stored);
        if (found) setTeam(found);
      }
    } catch { /* ignore */ }
  }, []);

  const saveTeam = (t: Team) => {
    setTeam(t);
    setShowPicker(false);
    try { localStorage.setItem(STORAGE_KEY, t.id); } catch { /* ignore */ }
  };

  // Filter news by team keywords (case-insensitive)
  const teamItems = useMemo(() => {
    if (!team) return [];
    const kws = team.keywords.map((k) => k.toLowerCase());
    return allItems.filter((item) => {
      const haystack = (item.title + " " + (item.summary ?? "")).toLowerCase();
      return kws.some((kw) => haystack.includes(kw.toLowerCase()));
    });
  }, [allItems, team]);

  if (!mounted) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-sport-card border border-sport-border rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  // No team selected yet — show selector
  if (!team && !showPicker) {
    return (
      <div className="py-8">
        <TeamSelectorModal onSelect={saveTeam} />
      </div>
    );
  }

  // Show inline picker (for changing team)
  if (showPicker) {
    return (
      <div className="py-4">
        <TeamSelectorModal onSelect={saveTeam} onClose={() => setShowPicker(false)} />
      </div>
    );
  }

  // Team selected — show filtered news (team is non-null here)
  if (!team) return null;
  const featured = teamItems.slice(0, 1);
  const grid = teamItems.slice(1, 7);
  const compact = teamItems.slice(7, 40);

  return (
    <div className="space-y-5">
      {/* Team header */}
      <div className={`flex items-center justify-between p-4 rounded-2xl border ${team.bg} ${team.border}`}>
        <div className="flex items-center gap-3">
          <TeamBadge team={team} size="md" />
          <div>
            <p className="text-xs text-gray-400">Tu equipo</p>
            <p className={`font-bold text-lg ${team.text}`}>{team.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {loading ? "Cargando…" : `${teamItems.length} noticias`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs transition-colors"
        >
          Cambiar <ChevronDown size={12} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-sport-card border border-sport-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : teamItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl block mb-3">📭</span>
          <p className="font-medium">Sin noticias recientes de {team.name}</p>
          <p className="text-xs mt-1 text-gray-600">Vuelve más tarde o prueba con otra categoría</p>
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <NewsCard item={featured[0]} lang={lang} featured />
              </div>
              <div className="space-y-4">
                {teamItems.slice(1, 4).map((item) => (
                  <NewsCard key={item.id} item={item} lang={lang} compact />
                ))}
              </div>
            </div>
          )}

          {/* Grid */}
          {grid.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grid.map((item) => (
                <NewsCard key={item.id} item={item} lang={lang} />
              ))}
            </div>
          )}

          {/* Compact list */}
          {compact.length > 0 && (
            <div className="bg-sport-card border border-sport-border rounded-2xl divide-y divide-sport-border">
              <div className="px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Más noticias de {team.name}
                </h3>
              </div>
              {compact.map((item) => (
                <NewsCard key={item.id} item={item} lang={lang} compact />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
