"use client";
import { useState } from "react";
import { LiveMatch, MatchEvent } from "@/app/api/scores/route";
import FavoriteButton from "@/components/favorites/FavoriteButton";

interface EventMarker {
  event: MatchEvent;
  x: number;
  y: number;
}

function getEventPosition(event: MatchEvent, index: number): { x: number; y: number } {
  const isHome = event.teamSide === "home";

  // Distribute events visually on the pitch
  const positions: Record<string, { x: number; y: number }[]> = {
    goal: [
      { x: isHome ? 14 : 86, y: 50 },
      { x: isHome ? 13 : 87, y: 44 },
      { x: isHome ? 14 : 86, y: 56 },
    ],
    yellowcard: [
      { x: isHome ? 35 : 65, y: 35 },
      { x: isHome ? 40 : 60, y: 65 },
      { x: isHome ? 30 : 70, y: 50 },
    ],
    redcard: [
      { x: isHome ? 38 : 62, y: 40 },
      { x: isHome ? 35 : 65, y: 60 },
    ],
    substitution: [
      { x: isHome ? 45 : 55, y: 30 },
      { x: isHome ? 43 : 57, y: 70 },
    ],
    penalty: [{ x: isHome ? 11 : 89, y: 50 }],
  };

  const typePositions = positions[event.type] || positions.yellowcard;
  return typePositions[index % typePositions.length];
}

const EVENT_ICONS: Record<string, string> = {
  goal: "⚽",
  yellowcard: "🟨",
  redcard: "🟥",
  substitution: "🔄",
  penalty: "🎯",
};

const EVENT_COLORS: Record<string, string> = {
  goal: "#22c55e",
  yellowcard: "#eab308",
  redcard: "#ef4444",
  substitution: "#3b82f6",
  penalty: "#f59e0b",
};

interface PitchProps {
  match: LiveMatch;
}

export default function InteractivePitch({ match }: PitchProps) {
  const [hoveredEvent, setHoveredEvent] = useState<MatchEvent | null>(null);
  const [view, setView] = useState<"pitch" | "stats" | "timeline">("pitch");

  const eventMarkers: EventMarker[] = match.events.map((event, i) => ({
    event,
    ...getEventPosition(event, i),
  }));

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl overflow-hidden">
      {/* Match header */}
      <div className="p-4 border-b border-sport-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 flex-1 justify-start">
            {match.home.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.home.logo} alt={match.home.name} className="w-10 h-10 object-contain" />
            )}
            <div className="text-right">
              <p className="font-bold text-white text-sm">{match.home.shortName}</p>
            </div>
          </div>

          <div className="text-center px-4">
            <div className="text-3xl font-display tracking-widest text-white">
              {match.home.score} — {match.away.score}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              {match.status === "live" && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {match.minute}
                </span>
              )}
              {match.status === "halftime" && (
                <span className="text-xs font-bold text-yellow-400">DESCANSO</span>
              )}
              {match.status === "finished" && (
                <span className="text-xs font-bold text-gray-500">FINAL</span>
              )}
              {match.status === "scheduled" && (
                <span className="text-xs text-gray-500">
                  {match.startTime ? new Date(match.startTime).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) : "Próximamente"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="text-left">
              <p className="font-bold text-white text-sm">{match.away.shortName}</p>
            </div>
            {match.away.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.away.logo} alt={match.away.name} className="w-10 h-10 object-contain" />
            )}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mt-3">
          {(["pitch", "stats", "timeline"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                view === tab
                  ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {tab === "pitch" ? "🏟 Pista" : tab === "stats" ? "📊 Stats" : "⏱ Timeline"}
            </button>
          ))}
        </div>
      </div>

      {/* Pitch view */}
      {view === "pitch" && (
        <div className="relative p-4">
          <svg
            viewBox="0 0 200 130"
            className="w-full rounded-xl"
            style={{ background: "linear-gradient(180deg, #166534 0%, #15803d 50%, #166534 100%)" }}
          >
            {/* Pitch lines */}
            <defs>
              <pattern id="grass" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="4" height="4" fill="#166534" />
                <rect width="4" height="2" fill="#15803d" />
              </pattern>
            </defs>
            <rect width="200" height="130" fill="url(#grass)" />

            {/* Outer boundary */}
            <rect x="5" y="5" width="190" height="120" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />

            {/* Center line */}
            <line x1="100" y1="5" x2="100" y2="125" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />

            {/* Center circle */}
            <circle cx="100" cy="65" r="18" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            <circle cx="100" cy="65" r="1" fill="rgba(255,255,255,0.6)" />

            {/* Left penalty area */}
            <rect x="5" y="35" width="30" height="60" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            {/* Left goal area */}
            <rect x="5" y="47" width="12" height="36" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            {/* Left penalty spot */}
            <circle cx="22" cy="65" r="1" fill="rgba(255,255,255,0.6)" />
            {/* Left penalty arc */}
            <path d="M 35 52 A 18 18 0 0 1 35 78" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />

            {/* Right penalty area */}
            <rect x="165" y="35" width="30" height="60" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            {/* Right goal area */}
            <rect x="183" y="47" width="12" height="36" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            {/* Right penalty spot */}
            <circle cx="178" cy="65" r="1" fill="rgba(255,255,255,0.6)" />
            {/* Right penalty arc */}
            <path d="M 165 52 A 18 18 0 0 0 165 78" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />

            {/* Left goal */}
            <rect x="1" y="56" width="4" height="18" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.8" />
            {/* Right goal */}
            <rect x="195" y="56" width="4" height="18" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.8" />

            {/* Corner arcs */}
            <path d="M 5 8 A 3 3 0 0 1 8 5" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            <path d="M 192 5 A 3 3 0 0 1 195 8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            <path d="M 5 122 A 3 3 0 0 0 8 125" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            <path d="M 192 125 A 3 3 0 0 0 195 122" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />

            {/* Team labels */}
            <text x="30" y="14" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="5" fontWeight="bold">
              {match.home.shortName}
            </text>
            <text x="170" y="14" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="5" fontWeight="bold">
              {match.away.shortName}
            </text>

            {/* Possession zone — if available */}
            {match.stats?.possession && (
              <g>
                <rect
                  x="5"
                  y="124"
                  width={`${(match.stats.possession[0] / 100) * 190}`}
                  height="4"
                  fill={`#${match.home.color || "22c55e"}`}
                  opacity="0.7"
                />
                <rect
                  x={5 + (match.stats.possession[0] / 100) * 190}
                  y="124"
                  width={`${(match.stats.possession[1] / 100) * 190}`}
                  height="4"
                  fill={`#${match.away.color || "ef4444"}`}
                  opacity="0.7"
                />
              </g>
            )}

            {/* Event markers */}
            {eventMarkers.map((marker, i) => (
              <g
                key={i}
                transform={`translate(${(marker.x / 100) * 200}, ${(marker.y / 100) * 130})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEvent(marker.event)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                <circle
                  r="5"
                  fill={EVENT_COLORS[marker.event.type]}
                  opacity="0.9"
                  className="animate-pulse-gold"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="4"
                >
                  {EVENT_ICONS[marker.event.type]}
                </text>
              </g>
            ))}

            {/* No events placeholder */}
            {match.events.length === 0 && match.status !== "scheduled" && (
              <text x="100" y="65" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6">
                Sin eventos registrados
              </text>
            )}
            {match.status === "scheduled" && (
              <text x="100" y="62" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontWeight="bold">
                PARTIDO PENDIENTE
              </text>
            )}
          </svg>

          {/* Hover tooltip */}
          {hoveredEvent && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 border border-sport-border rounded-xl px-3 py-2 text-xs text-white whitespace-nowrap z-10 shadow-xl">
              <span>{EVENT_ICONS[hoveredEvent.type]}</span>
              <span className="ml-1 font-semibold">{hoveredEvent.minute}</span>
              {hoveredEvent.player && <span className="ml-1 text-gold-400">{hoveredEvent.player}</span>}
              <span className="ml-1 text-gray-400">({hoveredEvent.teamSide === "home" ? match.home.shortName : match.away.shortName})</span>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {Object.entries(EVENT_ICONS).map(([type, icon]) => (
              <span key={type} className="flex items-center gap-1 text-xs text-gray-500">
                {icon} {type === "goal" ? "Gol" : type === "yellowcard" ? "Amarilla" : type === "redcard" ? "Roja" : type === "substitution" ? "Cambio" : "Penalti"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats view */}
      {view === "stats" && (
        <div className="p-4 space-y-3">
          {/* Team headers */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1 px-1">
            <span className="font-semibold text-white truncate max-w-[35%]">{match.home.shortName}</span>
            <span>Estadísticas</span>
            <span className="font-semibold text-white truncate max-w-[35%] text-right">{match.away.shortName}</span>
          </div>

          {match.stats && (() => {
            const rows = [
              { label: "Posesión %",    values: match.stats!.possession,    suffix: "%" },
              { label: "Tiros",         values: match.stats!.shots,         suffix: ""  },
              { label: "A puerta",      values: match.stats!.shotsOnTarget, suffix: ""  },
              { label: "Córners",       values: match.stats!.corners,       suffix: ""  },
              { label: "Faltas",        values: match.stats!.fouls,         suffix: ""  },
              { label: "T. Amarillas",  values: match.stats!.yellowCards,   suffix: ""  },
            ].filter(({ values }) => values && (values[0] || values[1]));

            if (rows.length === 0) return null;

            return rows.map(({ label, values, suffix }) => {
              const v0 = values![0] ?? 0;
              const v1 = values![1] ?? 0;
              const total   = v0 + v1 || 1;
              const homePct = (v0 / total) * 100;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white w-10">{v0}{suffix}</span>
                    <span className="text-gray-500 text-[11px]">{label}</span>
                    <span className="font-bold text-white w-10 text-right">{v1}{suffix}</span>
                  </div>
                  <div className="flex h-1.5 rounded-full overflow-hidden bg-sport-border">
                    <div className="bg-emerald-500 transition-all duration-700" style={{ width: `${homePct}%` }} />
                    <div className="bg-blue-500 transition-all duration-700"   style={{ width: `${100 - homePct}%` }} />
                  </div>
                </div>
              );
            });
          })()}

          {(!match.stats || Object.values(match.stats).every((v) => !v)) && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {match.status === "scheduled"
                  ? "⏳ El partido aún no ha empezado"
                  : "📊 ESPN no ha publicado las estadísticas de este partido"}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Las stats suelen estar disponibles en partidos en vivo y recién terminados
              </p>
            </div>
          )}

          {/* Leaders */}
          {match.leaders && match.leaders.length > 0 && (
            <div className="mt-4 border-t border-sport-border pt-3">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Destacados</p>
              <div className="space-y-1.5">
                {(match.leaders as { stat: string; value: string; name: string }[]).map((l, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{l.stat}</span>
                    <span className="text-white font-semibold">{l.name}</span>
                    <span className="text-gold-400 font-bold">{l.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timeline view */}
      {view === "timeline" && (
        <div className="p-4">
          {match.events.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-6">Sin eventos en este partido</p>
          ) : (
            <div className="space-y-2">
              {match.events.map((event, i) => (
                <div key={i} className={`flex items-center gap-3 ${event.teamSide === "away" ? "flex-row-reverse" : ""}`}>
                  <span className="text-xs font-bold text-gold-400 w-8 text-center shrink-0">
                    {event.minute}
                  </span>
                  <div
                    className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-xl border ${
                      event.teamSide === "home"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-left"
                        : "bg-blue-500/10 border-blue-500/20 text-right"
                    }`}
                  >
                    <span>{EVENT_ICONS[event.type]}</span>
                    <span className="text-sm font-medium text-white flex-1">{event.player || event.description}</span>
                    {event.assist && (
                      <span className="text-xs text-gray-500">({event.assist})</span>
                    )}
                    {event.player && (
                      <FavoriteButton
                        type="player"
                        value={event.player}
                        label={event.player}
                        size="xs"
                      />
                    )}
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-center shrink-0">
                    {event.teamSide === "home" ? match.home.shortName : match.away.shortName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
