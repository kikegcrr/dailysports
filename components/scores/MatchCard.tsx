"use client";
import { useState } from "react";
import { LiveMatch } from "@/app/api/scores/route";
import InteractivePitch from "./InteractivePitch";
import BasketballCourt from "./BasketballCourt";
import { ChevronDown, ChevronUp } from "lucide-react";

const LEAGUE_LABELS: Record<string, string> = {
  laliga: "LaLiga", champions: "Champions", premier: "Premier League",
  seriea: "Serie A", bundesliga: "Bundesliga", ligue1: "Ligue 1",
  ligaportugal: "Liga Portugal", europa: "Europa League",
  libertadores: "Libertadores", nba: "NBA", acb: "ACB",
  atp: "ATP", wta: "WTA",
};

const LEAGUE_COLORS: Record<string, string> = {
  laliga: "text-red-400", champions: "text-blue-400", premier: "text-purple-400",
  seriea: "text-blue-300", bundesliga: "text-red-300", ligue1: "text-blue-200",
  nba: "text-orange-400", acb: "text-red-400",
  atp: "text-yellow-400", wta: "text-pink-400",
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  live: { label: "EN VIVO", className: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
  halftime: { label: "DESCANSO", className: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30" },
  finished: { label: "FINAL", className: "text-gray-500 bg-gray-500/15 border-gray-500/30" },
  scheduled: { label: "PRÓXIMO", className: "text-blue-400 bg-blue-500/15 border-blue-500/30" },
};

interface MatchCardProps {
  match: LiveMatch;
  sport?: "football" | "basketball" | "tennis";
  featured?: boolean;
}

export default function MatchCard({ match, sport = "football", featured }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = STATUS_LABELS[match.status];

  return (
    <div className={`bg-sport-card border rounded-2xl overflow-hidden transition-all duration-300 ${
      match.status === "live" ? "border-emerald-500/40 shadow-lg shadow-emerald-500/10" : "border-sport-border hover:border-gold-500/30"
    }`}>
      {/* Compact header */}
      <button
        className="w-full p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${LEAGUE_COLORS[match.league] || "text-gray-400"}`}>
              {LEAGUE_LABELS[match.league] || match.league.toUpperCase()}
            </span>
            {match.venue && (
              <span className="text-xs text-gray-600 hidden sm:inline">· {match.venue}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusInfo.className}`}>
              {match.status === "live" && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
              )}
              {statusInfo.label}
            </span>
            {expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
          </div>
        </div>

        {/* Teams and score */}
        <div className="flex items-center justify-between">
          {/* Home team */}
          <div className="flex items-center gap-2 flex-1">
            {match.home.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.home.logo} alt={match.home.name} className="w-7 h-7 object-contain" />
            )}
            <span className="font-semibold text-white text-sm truncate">{match.home.name}</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-3 px-4 shrink-0">
            <span className="text-xl font-display text-white">{match.home.score}</span>
            <span className="text-gray-600 text-sm">
              {match.status === "scheduled"
                ? match.startTime
                  ? new Date(match.startTime).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })
                  : "vs"
                : "-"}
            </span>
            <span className="text-xl font-display text-white">{match.away.score}</span>
          </div>

          {/* Away team */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="font-semibold text-white text-sm truncate text-right">{match.away.name}</span>
            {match.away.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.away.logo} alt={match.away.name} className="w-7 h-7 object-contain" />
            )}
          </div>
        </div>

        {/* Events summary (football/basketball) or set scores (tennis) */}
        {sport === "tennis" && match.minute && (
          <div className="mt-2 text-xs text-gray-400 font-mono tracking-wider">
            🎾 {match.minute}
          </div>
        )}
        {sport !== "tennis" && match.events.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {match.events.slice(0, 5).map((event, i) => (
              <span key={i} className="text-xs text-gray-500">
                {event.type === "goal" ? "⚽" : event.type === "yellowcard" ? "🟨" : event.type === "redcard" ? "🟥" : "🔄"}
                {event.minute}
              </span>
            ))}
            {match.events.length > 5 && (
              <span className="text-xs text-gray-600">+{match.events.length - 5} más</span>
            )}
          </div>
        )}
      </button>

      {/* Expanded interactive view */}
      {expanded && (
        <div className="border-t border-sport-border animate-slide-up">
          {sport === "tennis" ? (
            <div className="p-4 space-y-3">
              <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                🎾 {match.leagueName}
              </p>
              {match.minute && (
                <div className="bg-sport-border/40 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Resultado por sets</p>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">{match.home.name}</p>
                    <div className="flex gap-2 text-center">
                      {match.minute.split(" ").map((set, i) => {
                        const [s1, s2] = set.split("-").map(Number);
                        return (
                          <div key={i} className="flex flex-col items-center">
                            <span className={`text-sm font-bold ${s1 > s2 ? "text-white" : "text-gray-500"}`}>{s1}</span>
                            <span className="text-xs text-gray-700">S{i + 1}</span>
                            <span className={`text-sm font-bold ${s2 > s1 ? "text-white" : "text-gray-500"}`}>{s2}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-sm font-semibold text-white truncate text-right">{match.away.name}</p>
                  </div>
                </div>
              )}
              {match.venue && (
                <p className="text-xs text-gray-600">📍 {match.venue}</p>
              )}
            </div>
          ) : sport === "football" ? (
            <div className="p-4">
              <InteractivePitch match={match} />
            </div>
          ) : (
            <div className="p-4">
              <BasketballCourt match={match} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
