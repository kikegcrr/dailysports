"use client";
import { LiveMatch } from "@/app/api/scores/route";
import { useState } from "react";

export default function BasketballCourt({ match }: { match: LiveMatch }) {
  const [view, setView] = useState<"court" | "stats">("court");

  const homeScore = parseInt(match.home.score) || 0;
  const awayScore = parseInt(match.away.score) || 0;
  const isLeading = homeScore >= awayScore;

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-sport-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 flex-1 justify-start">
            {match.home.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.home.logo} alt={match.home.name} className="w-10 h-10 object-contain" />
            )}
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
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <span className="font-bold text-white text-sm">{match.away.shortName}</span>
            {match.away.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.away.logo} alt={match.away.name} className="w-10 h-10 object-contain" />
            )}
          </div>
        </div>

        <div className="flex gap-1 mt-3">
          {(["court", "stats"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                view === tab ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-gray-500 hover:text-white"
              }`}
            >
              {tab === "court" ? "🏀 Cancha" : "📊 Stats"}
            </button>
          ))}
        </div>
      </div>

      {view === "court" && (
        <div className="p-4">
          <svg viewBox="0 0 200 110" className="w-full rounded-xl">
            {/* Court background */}
            <rect width="200" height="110" fill="#92400e" rx="4" />
            <rect x="3" y="3" width="194" height="104" fill="#b45309" rx="3" />

            {/* Court lines */}
            <rect x="5" y="5" width="190" height="100" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />

            {/* Center line */}
            <line x1="100" y1="5" x2="100" y2="105" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />

            {/* Center circle */}
            <circle cx="100" cy="55" r="15" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <circle cx="100" cy="55" r="1.5" fill="rgba(255,255,255,0.7)" />

            {/* Left 3-point arc */}
            <path d="M 5 18 L 35 18 A 45 45 0 0 1 35 92 L 5 92" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />

            {/* Right 3-point arc */}
            <path d="M 195 18 L 165 18 A 45 45 0 0 0 165 92 L 195 92" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />

            {/* Left paint */}
            <rect x="5" y="36" width="40" height="38" fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />

            {/* Right paint */}
            <rect x="155" y="36" width="40" height="38" fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />

            {/* Left free throw circle */}
            <circle cx="45" cy="55" r="10" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeDasharray="3,3" />

            {/* Right free throw circle */}
            <circle cx="155" cy="55" r="10" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeDasharray="3,3" />

            {/* Left basket */}
            <circle cx="11" cy="55" r="3.5" fill="none" stroke="#f97316" strokeWidth="1.5" />
            <line x1="11" y1="55" x2="5" y2="55" stroke="#f97316" strokeWidth="1.5" />

            {/* Right basket */}
            <circle cx="189" cy="55" r="3.5" fill="none" stroke="#f97316" strokeWidth="1.5" />
            <line x1="189" y1="55" x2="195" y2="55" stroke="#f97316" strokeWidth="1.5" />

            {/* Score indicators */}
            <rect x="5" y="108" width={`${(homeScore / (homeScore + awayScore || 1)) * 190}`} height="3"
              fill={isLeading ? "#22c55e" : "#3b82f6"} opacity="0.8" />

            {/* Quarter/period indicators */}
            {match.period && match.period > 1 && Array.from({ length: match.period }).map((_, i) => (
              <circle key={i} cx={95 + i * 4 - (match.period! * 2)} cy="106" r="1.2"
                fill={i < match.period! ? "#f59e0b" : "rgba(255,255,255,0.2)"} />
            ))}

            {/* Team labels */}
            <text x="30" y="14" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="5" fontWeight="bold">
              {match.home.shortName}
            </text>
            <text x="170" y="14" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="5" fontWeight="bold">
              {match.away.shortName}
            </text>
          </svg>

          {/* Events */}
          <div className="mt-3 flex flex-wrap gap-2">
            {match.events.map((event, i) => (
              <span key={i} className={`text-xs px-2 py-1 rounded-lg border ${
                event.teamSide === "home"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-400"
              }`}>
                {event.minute} {event.player}
              </span>
            ))}
          </div>
        </div>
      )}

      {view === "stats" && (
        <div className="p-4 space-y-3">
          {[["Puntos", match.home.score, match.away.score],
            ...(match.stats
              ? [
                  ["Rebotes", match.stats.corners?.[0], match.stats.corners?.[1]],
                  ["Asistencias", match.stats.shots?.[0], match.stats.shots?.[1]],
                  ["Pérdidas", match.stats.fouls?.[0], match.stats.fouls?.[1]],
                ]
              : [])
          ].map(([label, home, away]) => {
            if (home === undefined || away === undefined) return null;
            const h = parseFloat(String(home)) || 0;
            const a = parseFloat(String(away)) || 0;
            const total = h + a || 1;
            return (
              <div key={String(label)}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">{home}</span>
                  <span className="text-gray-400">{label}</span>
                  <span className="font-bold text-white">{away}</span>
                </div>
                <div className="flex h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500" style={{ width: `${(h / total) * 100}%` }} />
                  <div className="bg-blue-500" style={{ width: `${(a / total) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
