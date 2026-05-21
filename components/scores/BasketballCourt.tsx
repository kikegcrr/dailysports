"use client";
import { LiveMatch } from "@/app/api/scores/route";
import { useState } from "react";

type View = "court" | "stats" | "leaders";

function StatBar({ label, home, away, format = "n" }: { label: string; home: number; away: number; format?: "n" | "%" }) {
  const total = home + away || 1;
  const fmt = (v: number) => format === "%" ? `${v.toFixed(1)}%` : String(Math.round(v));
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-bold text-white w-12">{fmt(home)}</span>
        <span className="text-gray-400 text-center flex-1">{label}</span>
        <span className="font-bold text-white w-12 text-right">{fmt(away)}</span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-sport-border">
        <div className="bg-emerald-500 transition-all" style={{ width: `${(home / total) * 100}%` }} />
        <div className="bg-blue-500 transition-all" style={{ width: `${(away / total) * 100}%` }} />
      </div>
    </div>
  );
}

export default function BasketballCourt({ match }: { match: LiveMatch }) {
  const [view, setView] = useState<View>("court");

  const homeScore = parseInt(match.home.score) || 0;
  const awayScore = parseInt(match.away.score) || 0;
  const bs = match.basketStats;
  const leaders = match.leaders ?? [];
  const broadcasts = match.broadcasts ?? [];
  const quarterScores = bs?.quarterScores;

  const tabs: { key: View; label: string }[] = [
    { key: "court", label: "🏀 Cancha" },
    { key: "stats", label: "📊 Stats" },
    ...(leaders.length > 0 ? [{ key: "leaders" as View, label: "⭐ Líderes" }] : []),
  ];

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl overflow-hidden">
      {/* Score header */}
      <div className="p-4 border-b border-sport-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 flex-1">
            {match.home.logo && <img src={match.home.logo} alt={match.home.name} className="w-10 h-10 object-contain" />}
            <span className="font-bold text-white text-sm">{match.home.shortName}</span>
          </div>

          <div className="text-center px-4">
            <div className="text-3xl font-display tracking-widest text-white">
              {match.home.score} — {match.away.score}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              {match.status === "live" && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {match.period ? `Q${match.period}` : ""} {match.minute}
                </span>
              )}
              {match.status === "halftime" && <span className="text-xs font-bold text-yellow-400">MEDIO TIEMPO</span>}
              {match.status === "finished" && <span className="text-xs font-bold text-gray-500">FINAL</span>}
              {match.status === "scheduled" && match.startTime && (
                <span className="text-xs text-blue-400">
                  {new Date(match.startTime).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <span className="font-bold text-white text-sm">{match.away.shortName}</span>
            {match.away.logo && <img src={match.away.logo} alt={match.away.name} className="w-10 h-10 object-contain" />}
          </div>
        </div>

        {/* Quarter scores */}
        {quarterScores && quarterScores[0].length > 0 && (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-xs text-center">
              <thead>
                <tr className="text-gray-600">
                  <th className="text-left pb-1 pr-2">Equipo</th>
                  {quarterScores[0].map((_, i) => <th key={i} className="w-8 pb-1">Q{i + 1}</th>)}
                  <th className="pl-2 pb-1 font-bold text-gray-400">T</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-white">
                  <td className="text-left pr-2 font-medium text-emerald-400">{match.home.shortName}</td>
                  {quarterScores[0].map((v, i) => <td key={i} className="font-mono">{v}</td>)}
                  <td className="pl-2 font-bold">{homeScore}</td>
                </tr>
                <tr className="text-white">
                  <td className="text-left pr-2 font-medium text-blue-400">{match.away.shortName}</td>
                  {quarterScores[1].map((v, i) => <td key={i} className="font-mono">{v}</td>)}
                  <td className="pl-2 font-bold">{awayScore}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Where to watch */}
        {broadcasts.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs text-gray-500">📺 Ver en:</span>
            {broadcasts.map((b) => (
              <span key={b} className="text-xs px-2 py-0.5 rounded bg-sport-border text-gray-300">{b}</span>
            ))}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-1 mt-3">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setView(tab.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                view === tab.key ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-gray-500 hover:text-white"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Court view */}
      {view === "court" && (
        <div className="p-4">
          <svg viewBox="0 0 200 110" className="w-full rounded-xl">
            <rect width="200" height="110" fill="#92400e" rx="4" />
            <rect x="3" y="3" width="194" height="104" fill="#b45309" rx="3" />
            <rect x="5" y="5" width="190" height="100" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <line x1="100" y1="5" x2="100" y2="105" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <circle cx="100" cy="55" r="15" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <circle cx="100" cy="55" r="1.5" fill="rgba(255,255,255,0.7)" />
            <path d="M 5 18 L 35 18 A 45 45 0 0 1 35 92 L 5 92" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <path d="M 195 18 L 165 18 A 45 45 0 0 0 165 92 L 195 92" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <rect x="5" y="36" width="40" height="38" fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <rect x="155" y="36" width="40" height="38" fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <circle cx="45" cy="55" r="10" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="155" cy="55" r="10" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="11" cy="55" r="3.5" fill="none" stroke="#f97316" strokeWidth="1.5" />
            <line x1="11" y1="55" x2="5" y2="55" stroke="#f97316" strokeWidth="1.5" />
            <circle cx="189" cy="55" r="3.5" fill="none" stroke="#f97316" strokeWidth="1.5" />
            <line x1="189" y1="55" x2="195" y2="55" stroke="#f97316" strokeWidth="1.5" />
            <rect x="5" y="108" width={`${(homeScore / (homeScore + awayScore || 1)) * 190}`} height="3" fill="#22c55e" opacity="0.8" />
            <text x="30" y="14" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="5" fontWeight="bold">{match.home.shortName}</text>
            <text x="170" y="14" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="5" fontWeight="bold">{match.away.shortName}</text>
          </svg>
          {match.events.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {match.events.map((event, i) => (
                <span key={i} className={`text-xs px-2 py-1 rounded-lg border ${
                  event.teamSide === "home" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                }`}>
                  {event.minute} {event.player}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats view */}
      {view === "stats" && (
        <div className="p-4">
          {/* Team name headers */}
          <div className="flex items-center justify-between text-xs mb-3 px-1">
            <span className="font-bold text-emerald-400 w-12">{match.home.shortName}</span>
            <span className="text-gray-500 text-center flex-1">Estadísticas</span>
            <span className="font-bold text-blue-400 w-12 text-right">{match.away.shortName}</span>
          </div>
          <div className="space-y-3">
            <StatBar label="Puntos" home={homeScore} away={awayScore} />
            {bs?.rebounds    && <StatBar label="Rebotes"       home={bs.rebounds[0]}  away={bs.rebounds[1]}  />}
            {bs?.assists     && <StatBar label="Asistencias"   home={bs.assists[0]}   away={bs.assists[1]}   />}
            {bs?.fgPct       && <StatBar label="% Tiro Campo"  home={bs.fgPct[0]}     away={bs.fgPct[1]}     format="%" />}
            {bs?.threePct    && <StatBar label="% Triples"     home={bs.threePct[0]}  away={bs.threePct[1]}  format="%" />}
            {bs?.ftPct       && <StatBar label="% Tiros Libres" home={bs.ftPct[0]}   away={bs.ftPct[1]}     format="%" />}
            {bs?.turnovers   && <StatBar label="Pérdidas"      home={bs.turnovers[0]} away={bs.turnovers[1]} />}
            {/* Football stats */}
            {match.stats?.possession    && <StatBar label="Posesión"      home={match.stats.possession[0]}    away={match.stats.possession[1]}    format="%" />}
            {match.stats?.shots         && <StatBar label="Tiros"         home={match.stats.shots[0]}         away={match.stats.shots[1]}         />}
            {match.stats?.shotsOnTarget && <StatBar label="A Puerta"      home={match.stats.shotsOnTarget[0]} away={match.stats.shotsOnTarget[1]} />}
            {match.stats?.corners       && <StatBar label="Córners"       home={match.stats.corners[0]}       away={match.stats.corners[1]}       />}
            {match.stats?.fouls         && <StatBar label="Faltas"        home={match.stats.fouls[0]}         away={match.stats.fouls[1]}         />}
          </div>
          {!bs && !match.stats && (
            <p className="text-center text-gray-600 text-sm py-4">Estadísticas disponibles en directo</p>
          )}
        </div>
      )}

      {/* Leaders view */}
      {view === "leaders" && (
        <div className="p-4 space-y-2">
          {leaders.map((l, i) => (
            <div key={i} className="flex items-center justify-between bg-sport-border/40 rounded-xl px-3 py-2">
              <span className="text-xs text-gray-400 w-24">{l.stat}</span>
              <span className="text-sm font-bold text-white text-center flex-1">{l.name}</span>
              <span className="text-sm font-bold text-orange-400 w-16 text-right">{l.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
