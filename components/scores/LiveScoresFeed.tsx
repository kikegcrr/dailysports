"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { LiveMatch } from "@/app/api/scores/route";
import MatchCard from "./MatchCard";
import { Radio, Wifi, WifiOff, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useFavorites } from "@/lib/favorites-context";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import Link from "next/link";
import { useParams } from "next/navigation";

type SportTab = "all" | "football" | "basketball" | "tennis" | "myfeed";
type LeagueFilter = "all" | "laliga" | "champions" | "premier" | "seriea" | "bundesliga" | "ligue1" | "ligaportugal" | "europa" | "nba" | "euroleague" | "acb" | "atp" | "wta";

const SPORT_TABS: { key: SportTab; label: string; icon: string }[] = [
  { key: "all",        label: "Todo",       icon: "🏆" },
  { key: "football",   label: "Fútbol",     icon: "⚽" },
  { key: "basketball", label: "Baloncesto", icon: "🏀" },
  { key: "tennis",     label: "Tenis",      icon: "🎾" },
  { key: "myfeed",     label: "Para mí",    icon: "⭐" },
];

const LEAGUE_FILTERS: { key: LeagueFilter; label: string; sport: SportTab }[] = [
  { key: "all",          label: "Todas",      sport: "all" },
  { key: "laliga",       label: "LaLiga",     sport: "football" },
  { key: "champions",    label: "Champions",  sport: "football" },
  { key: "premier",      label: "Premier",    sport: "football" },
  { key: "seriea",       label: "Serie A",    sport: "football" },
  { key: "bundesliga",   label: "Bundesliga", sport: "football" },
  { key: "ligue1",       label: "Ligue 1",    sport: "football" },
  { key: "ligaportugal", label: "Portugal",   sport: "football" },
  { key: "europa",       label: "Europa Lg",  sport: "football" },
  { key: "nba",          label: "NBA",        sport: "basketball" },
  { key: "euroleague",   label: "EuroLeague", sport: "basketball" },
  { key: "acb",          label: "ACB",        sport: "basketball" },
  { key: "atp",          label: "ATP",        sport: "tennis" },
  { key: "wta",          label: "WTA",        sport: "tennis" },
];

// ─── Date helpers ─────────────────────────────────────────────────────────────
function toESPN(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

function dayLabel(d: Date, today: Date): { short: string; sub: string } {
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const tgt  = new Date(d.getFullYear(),     d.getMonth(),     d.getDate()).getTime();
  const diff = Math.round((tgt - base) / 86400000);
  const sub  = `${d.getDate()} ${d.toLocaleDateString("es", { month: "short" })}`;
  if (diff ===  0) return { short: "Hoy",    sub };
  if (diff === -1) return { short: "Ayer",   sub };
  if (diff ===  1) return { short: "Mañana", sub };
  const dow = d.toLocaleDateString("es", { weekday: "short" });
  return { short: dow.charAt(0).toUpperCase() + dow.slice(1), sub };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LiveScoresFeed() {
  const today = new Date();
  const { favorites } = useFavorites();
  const params = useParams();
  const lang = (params?.lang as string) || "es";

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(today));
  const [matches,      setMatches]      = useState<LiveMatch[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [sport,        setSport]        = useState<SportTab>("all");
  const [league,       setLeague]       = useState<LeagueFilter>("all");
  const [lastUpdate,   setLastUpdate]   = useState<Date | null>(null);
  const [connected,    setConnected]    = useState(false);
  const [liveCount,    setLiveCount]    = useState(0);
  const [showFinished, setShowFinished] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  const isToday = isSameDay(selectedDate, today);

  // 7-day range: -3 … +3
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));

  const connect = useCallback(() => {
    esRef.current?.close();
    esRef.current = null;
    setLoading(true);
    setMatches([]);

    const qp = new URLSearchParams();
    // "Para mí" fetches everything and filters client-side
    if (sport !== "all" && sport !== "myfeed") qp.set("sport", sport);
    if (league !== "all") qp.set("league", league);
    qp.set("date", toESPN(selectedDate));
    if (isSameDay(selectedDate, today)) qp.set("today", "1");

    const es = new EventSource(`/api/scores/stream?${qp}`);
    esRef.current = es;

    es.onopen    = () => setConnected(true);
    es.onerror   = () => setConnected(false);
    es.onmessage = (e) => {
      try {
        const data: LiveMatch[] = JSON.parse(e.data);
        setMatches(data);
        const live = data.filter((m) => m.status === "live").length;
        setLiveCount(live);
        setLastUpdate(new Date());
        setLoading(false);
        // Auto-expand finished section when there are no live games
        if (live === 0) setShowFinished(true);
      } catch { /* malformed — ignore */ }
    };
  }, [selectedDate, sport, league]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      esRef.current = null;
      setConnected(false);
    };
  }, [connect]);

  const availableLeagues = LEAGUE_FILTERS.filter(
    (f) => f.sport === "all" || f.sport === sport || sport === "all"
  );

  // "Para mí": filter by user's favourite leagues (client-side)
  const displayMatches = sport === "myfeed" && favorites.leagues.size > 0
    ? matches.filter((m) => favorites.leagues.has(m.league))
    : matches;

  const live      = displayMatches.filter((m) => m.status === "live" || m.status === "halftime");
  const scheduled = displayMatches.filter((m) => m.status === "scheduled");
  const finished  = displayMatches.filter((m) => m.status === "finished");

  const sportOf = (m: LiveMatch): "basketball" | "tennis" | "football" =>
    (m.league === "nba" || m.league === "euroleague" || m.league === "acb")
      ? "basketball"
      : (m.league === "atp" || m.league === "wta")
      ? "tennis"
      : "football";

  return (
    <div className="space-y-4">

      {/* ── Date navigator ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => { const nd = addDays(selectedDate, -1); setSelectedDate(nd); setShowFinished(!isSameDay(nd, today)); }}
          disabled={isSameDay(selectedDate, addDays(today, -3))}
          className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-sport-card disabled:opacity-30 transition-colors shrink-0"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex gap-1 overflow-x-auto scrollbar-none flex-1">
          {days.map((d) => {
            const sel  = isSameDay(d, selectedDate);
            const isT  = isSameDay(d, today);
            const { short, sub } = dayLabel(d, today);
            return (
              <button
                key={toESPN(d)}
                onClick={() => { setSelectedDate(new Date(d)); setShowFinished(!isSameDay(d, today)); }}
                className={`flex flex-col items-center px-2.5 py-2 rounded-xl min-w-[60px] text-center transition-all ${
                  sel
                    ? "bg-gold-500/20 border border-gold-500/40 text-gold-400"
                    : isT
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-sport-card border border-sport-border text-gray-400 hover:border-gold-500/20 hover:text-gray-200"
                }`}
              >
                <span className="text-xs font-bold leading-none">{short}</span>
                <span className="text-[9px] opacity-60 mt-0.5">{sub}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => { const nd = addDays(selectedDate, 1); setSelectedDate(nd); setShowFinished(!isSameDay(nd, today)); }}
          disabled={isSameDay(selectedDate, addDays(today, 3))}
          className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-sport-card disabled:opacity-30 transition-colors shrink-0"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Status bar: live count + connection ──────────────────────────── */}
      <div className="flex items-center justify-between min-h-[28px]">
        {isToday && liveCount > 0 ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <Radio size={13} className="text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">
              {liveCount} {liveCount === 1 ? "partido en vivo" : "partidos en vivo"}
            </span>
          </div>
        ) : <div />}

        <div className="text-xs flex items-center gap-1.5">
          {connected ? (
            <span className="flex items-center gap-1 text-emerald-500">
              <Wifi size={11} />
              <span className="hidden sm:inline">{isToday ? "En directo" : "Actualizado"}</span>
              {lastUpdate && (
                <span className="text-gray-600">
                  · {lastUpdate.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-600">
              <WifiOff size={11} />
              <span className="hidden sm:inline">Reconectando…</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Sport tabs ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {SPORT_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setSport(tab.key as SportTab); setLeague("all"); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              sport === tab.key
                ? tab.key === "myfeed"
                  ? "bg-gold-500/30 text-gold-300 border border-gold-500/60"
                  : "bg-gold-500/20 text-gold-400 border border-gold-500/40"
                : tab.key === "myfeed"
                  ? "bg-gold-500/10 border border-gold-500/20 text-gold-500 hover:bg-gold-500/20"
                  : "bg-sport-card border border-sport-border text-gray-400 hover:text-white"
            }`}
          >
            {tab.key === "myfeed"
              ? <Star size={13} fill="currentColor" />
              : tab.icon}{" "}
            {tab.label}
            {tab.key === "myfeed" && favorites.leagues.size > 0 && (
              <span className="ml-1 text-[10px] bg-gold-500/30 text-gold-300 px-1.5 py-0.5 rounded-full font-bold">
                {favorites.leagues.size}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── League chips (hidden in Para mí mode) ────────────────────────── */}
      {sport !== "myfeed" && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {availableLeagues.map((f) => (
            <div key={f.key} className="flex items-center shrink-0 group/chip">
              <button
                onClick={() => setLeague(f.key)}
                className={`px-3 py-1 rounded-l-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  league === f.key ? "bg-white/15 text-white" : "text-gray-500 hover:text-gray-300"
                } ${f.key === "all" ? "rounded-lg" : ""}`}
              >
                {f.label}
              </button>
              {f.key !== "all" && (
                <div className="opacity-0 group-hover/chip:opacity-100 transition-opacity">
                  <FavoriteButton
                    type="league"
                    value={f.key}
                    label={f.label}
                    size="xs"
                    className="px-1.5 py-1 rounded-r-lg border-l border-white/10"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Para mí: no favorites set ────────────────────────────────────── */}
      {sport === "myfeed" && favorites.leagues.size === 0 && (
        <div className="text-center py-14 text-gray-500">
          <Star size={40} className="mx-auto mb-3 text-gold-500/40" />
          <p className="font-medium text-gray-300">No tienes ligas favoritas guardadas</p>
          <p className="text-xs mt-1 text-gray-600 mb-5">
            Añade tus ligas preferidas en tu perfil y aparecerán aquí.
          </p>
          <Link
            href={`/${lang}/perfil`}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm transition-colors"
          >
            <Star size={14} fill="currentColor" /> Ir a favoritos
          </Link>
        </div>
      )}

      {/* ── Match list ───────────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-sport-card border border-sport-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sport === "myfeed" && favorites.leagues.size === 0 ? null
        : displayMatches.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <span className="text-4xl block mb-3">📭</span>
          <p className="font-medium">
            {sport === "myfeed" ? "Sin partidos en tus ligas favoritas" : "Sin partidos para este día"}
          </p>
          <p className="text-xs mt-1 text-gray-600">
            {sport === "myfeed" ? "Prueba con otra fecha" : "Prueba con otra fecha o liga"}
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {/* Live / Halftime */}
          {live.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En vivo ahora
              </h3>
              <div className="space-y-3">
                {live.map((m) => <MatchCard key={m.id} match={m} sport={sportOf(m)} />)}
              </div>
            </section>
          )}

          {/* Scheduled */}
          {scheduled.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
                {isToday ? "Próximos partidos" : "Programados"}
              </h3>
              <div className="space-y-3">
                {scheduled.map((m) => <MatchCard key={m.id} match={m} sport={sportOf(m)} />)}
              </div>
            </section>
          )}

          {/* Finished */}
          {finished.length > 0 && (
            <section>
              <button
                onClick={() => setShowFinished((v) => !v)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest hover:text-gray-200 transition-colors mb-3 w-full text-left"
              >
                {showFinished ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {isToday ? "Resultados de hoy" : "Resultados"} ({finished.length})
              </button>
              {showFinished && (
                <div className="space-y-3">
                  {finished.map((m) => <MatchCard key={m.id} match={m} sport={sportOf(m)} />)}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
