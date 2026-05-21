"use client";
import { useEffect, useState, useCallback } from "react";
import { LiveMatch } from "@/app/api/scores/route";
import MatchCard from "./MatchCard";
import { RefreshCw, Radio } from "lucide-react";

type SportTab = "all" | "football" | "basketball";
type LeagueFilter = "all" | "laliga" | "champions" | "premier" | "seriea" | "bundesliga" | "nba";

const SPORT_TABS: { key: SportTab; label: string; icon: string }[] = [
  { key: "all", label: "Todo", icon: "🏆" },
  { key: "football", label: "Fútbol", icon: "⚽" },
  { key: "basketball", label: "Baloncesto", icon: "🏀" },
];

const LEAGUE_FILTERS: { key: LeagueFilter; label: string; sport: SportTab }[] = [
  { key: "all", label: "Todas", sport: "all" },
  { key: "laliga", label: "LaLiga", sport: "football" },
  { key: "champions", label: "Champions", sport: "football" },
  { key: "premier", label: "Premier", sport: "football" },
  { key: "seriea", label: "Serie A", sport: "football" },
  { key: "bundesliga", label: "Bundesliga", sport: "football" },
  { key: "nba", label: "NBA", sport: "basketball" },
];

export default function LiveScoresFeed() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState<SportTab>("all");
  const [league, setLeague] = useState<LeagueFilter>("all");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [liveCount, setLiveCount] = useState(0);

  const fetchMatches = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (sport !== "all") params.set("sport", sport);
      if (league !== "all") params.set("league", league);

      const res = await fetch(`/api/scores?${params}`);
      const data: LiveMatch[] = await res.json();
      setMatches(data);
      setLiveCount(data.filter((m) => m.status === "live").length);
      setLastUpdate(new Date());
    } catch {
      // silently fail — stale data is fine
    } finally {
      setLoading(false);
    }
  }, [sport, league]);

  useEffect(() => {
    fetchMatches();
    const id = setInterval(fetchMatches, 30000); // refresh every 30s
    return () => clearInterval(id);
  }, [fetchMatches]);

  const availableLeagues = LEAGUE_FILTERS.filter(
    (f) => f.sport === "all" || f.sport === sport || sport === "all"
  );

  return (
    <div className="space-y-4">
      {/* Live indicator */}
      {liveCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <Radio size={16} className="text-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-emerald-400">
            {liveCount} {liveCount === 1 ? "partido en vivo" : "partidos en vivo"}
          </span>
        </div>
      )}

      {/* Sport tabs */}
      <div className="flex items-center gap-2">
        {SPORT_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setSport(tab.key); setLeague("all"); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              sport === tab.key
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/40"
                : "bg-sport-card border border-sport-border text-gray-400 hover:text-white"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}

        <button
          onClick={() => { setLoading(true); fetchMatches(); }}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-500 border border-sport-border bg-sport-card hover:text-white transition-colors"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {lastUpdate && (
            <span className="hidden sm:inline">
              {lastUpdate.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
        </button>
      </div>

      {/* League filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {availableLeagues.map((f) => (
          <button
            key={f.key}
            onClick={() => setLeague(f.key)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              league === f.key
                ? "bg-white/15 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Matches */}
      {loading && !matches.length ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-sport-card border border-sport-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <span className="text-4xl block mb-3">📭</span>
          <p>No hay partidos en este momento</p>
          <p className="text-xs mt-1 text-gray-600">Se actualizará automáticamente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Live matches first */}
          {matches.filter((m) => m.status === "live" || m.status === "halftime").length > 0 && (
            <>
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En vivo ahora
              </h3>
              {matches
                .filter((m) => m.status === "live" || m.status === "halftime")
                .map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    sport={match.league === "nba" ? "basketball" : "football"}
                  />
                ))}
            </>
          )}

          {/* Scheduled */}
          {matches.filter((m) => m.status === "scheduled").length > 0 && (
            <>
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mt-2">
                Próximos partidos
              </h3>
              {matches
                .filter((m) => m.status === "scheduled")
                .map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    sport={match.league === "nba" ? "basketball" : "football"}
                  />
                ))}
            </>
          )}

          {/* Finished */}
          {matches.filter((m) => m.status === "finished").length > 0 && (
            <>
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-widest mt-2">
                Resultados de hoy
              </h3>
              {matches
                .filter((m) => m.status === "finished")
                .map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    sport={match.league === "nba" ? "basketball" : "football"}
                  />
                ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
