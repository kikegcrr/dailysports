"use client";
import { Star, ChevronRight, X, Plus, Search } from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";
import { useFavorites, FavoriteType } from "@/lib/favorites-context";
import { useAuth } from "@/components/auth/AuthProvider";
import { TEAMS } from "@/components/news/MyTeamFeed";

// ─── Data ─────────────────────────────────────────────────────────────────────
const SPORTS = [
  { key: "football",   label: "Fútbol",     icon: "⚽" },
  { key: "basketball", label: "Baloncesto", icon: "🏀" },
  { key: "tennis",     label: "Tenis",      icon: "🎾" },
];

const LEAGUES_BY_SPORT: {
  sport: string;
  sportLabel: string;
  leagues: { key: string; label: string }[];
}[] = [
  {
    sport: "football",
    sportLabel: "Fútbol",
    leagues: [
      { key: "laliga",       label: "LaLiga" },
      { key: "champions",    label: "Champions" },
      { key: "premier",      label: "Premier League" },
      { key: "seriea",       label: "Serie A" },
      { key: "bundesliga",   label: "Bundesliga" },
      { key: "ligue1",       label: "Ligue 1" },
      { key: "europa",       label: "Europa League" },
      { key: "ligaportugal", label: "Liga Portugal" },
    ],
  },
  {
    sport: "basketball",
    sportLabel: "Baloncesto",
    leagues: [
      { key: "nba",        label: "NBA" },
      { key: "euroleague", label: "EuroLeague" },
      { key: "acb",        label: "ACB" },
    ],
  },
  {
    sport: "tennis",
    sportLabel: "Tenis",
    leagues: [
      { key: "atp", label: "ATP" },
      { key: "wta", label: "WTA" },
    ],
  },
];

// ─── Popular players ──────────────────────────────────────────────────────────
const POPULAR_PLAYERS: { name: string; team: string; sport: string }[] = [
  // ⚽ Fútbol
  { name: "Mbappé",          team: "Real Madrid",  sport: "⚽" },
  { name: "Vinicius Jr.",     team: "Real Madrid",  sport: "⚽" },
  { name: "Bellingham",       team: "Real Madrid",  sport: "⚽" },
  { name: "Valverde",         team: "Real Madrid",  sport: "⚽" },
  { name: "Lamine Yamal",     team: "FC Barcelona", sport: "⚽" },
  { name: "Lewandowski",      team: "FC Barcelona", sport: "⚽" },
  { name: "Pedri",            team: "FC Barcelona", sport: "⚽" },
  { name: "Gavi",             team: "FC Barcelona", sport: "⚽" },
  { name: "Griezmann",        team: "Atlético",     sport: "⚽" },
  { name: "Julián Álvarez",   team: "Atlético",     sport: "⚽" },
  { name: "Salah",            team: "Liverpool",    sport: "⚽" },
  { name: "Haaland",          team: "Man City",     sport: "⚽" },
  { name: "Wirtz",            team: "Bayern",       sport: "⚽" },
  { name: "Saka",             team: "Arsenal",      sport: "⚽" },
  { name: "Yamal",            team: "FC Barcelona", sport: "⚽" },
  // 🏀 Baloncesto
  { name: "LeBron James",     team: "Lakers",       sport: "🏀" },
  { name: "Stephen Curry",    team: "Warriors",     sport: "🏀" },
  { name: "Nikola Jokić",     team: "Nuggets",      sport: "🏀" },
  { name: "Luka Dončić",      team: "Mavericks",    sport: "🏀" },
  { name: "Giannis",          team: "Bucks",        sport: "🏀" },
  { name: "Kevin Durant",     team: "Suns",         sport: "🏀" },
  // 🎾 Tenis
  { name: "Carlos Alcaraz",   team: "ATP",          sport: "🎾" },
  { name: "Djokovic",         team: "ATP",          sport: "🎾" },
  { name: "Jannik Sinner",    team: "ATP",          sport: "🎾" },
  { name: "Iga Swiatek",      team: "WTA",          sport: "🎾" },
  { name: "Sabalenka",        team: "WTA",          sport: "🎾" },
  { name: "Paula Badosa",     team: "WTA",          sport: "🎾" },
];

// ─── Toggle chip ──────────────────────────────────────────────────────────────
function ToggleChip({
  label, icon, active, onClick,
}: { label: string; icon?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
        active
          ? "bg-gold-500/20 border-gold-500/50 text-gold-400"
          : "bg-white/5 border-sport-border text-gray-400 hover:text-white hover:border-white/20"
      }`}
    >
      {icon && <span>{icon}</span>}
      {label}
      {active && <Star size={11} fill="currentColor" className="text-gold-400 ml-0.5" />}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface FavoritesManagerProps {
  lang: string;
  /** compact mode: used inside perfil page */
  compact?: boolean;
}

export default function FavoritesManager({ lang, compact }: FavoritesManagerProps) {
  const { user, loading: authLoading } = useAuth();
  const { favorites, loading, toggle } = useFavorites();
  const [playerInput, setPlayerInput] = useState("");
  const [playerFilter, setPlayerFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addCustomPlayer() {
    const name = playerInput.trim();
    if (!name) return;
    toggle("player" as FavoriteType, name);
    setPlayerInput("");
    inputRef.current?.focus();
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 text-center">
        <Star size={28} className="mx-auto mb-3 text-gold-400" />
        <p className="font-semibold text-white mb-1">Inicia sesión para guardar favoritos</p>
        <p className="text-sm text-gray-500 mb-4">
          Guarda tus ligas, equipos y deportes favoritos y accede a tu feed personalizado.
        </p>
        <Link
          href={`/${lang}/login`}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm transition-colors"
        >
          Iniciar sesión <ChevronRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-5" : "space-y-6"}>

      {/* ── Deportes ───────────────────────────────────────────────────────── */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
        <h3 className="font-semibold text-white mb-3 text-sm flex items-center gap-2">
          <span className="text-base">🏆</span> Deportes
        </h3>
        <div className="flex flex-wrap gap-2">
          {SPORTS.map(s => (
            <ToggleChip
              key={s.key}
              label={s.label}
              icon={s.icon}
              active={favorites.sports.has(s.key)}
              onClick={() => toggle("sport" as FavoriteType, s.key)}
            />
          ))}
        </div>
      </div>

      {/* ── Ligas ──────────────────────────────────────────────────────────── */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
        <h3 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
          <span className="text-base">🥇</span> Ligas favoritas
        </h3>
        <div className="space-y-4">
          {LEAGUES_BY_SPORT.map(group => (
            <div key={group.sport}>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
                {group.sportLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.leagues.map(l => (
                  <ToggleChip
                    key={l.key}
                    label={l.label}
                    active={favorites.leagues.has(l.key)}
                    onClick={() => toggle("league" as FavoriteType, l.key)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Equipos ────────────────────────────────────────────────────────── */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
        <h3 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
          <span className="text-base">🛡️</span> Equipos favoritos
        </h3>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-sport-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {TEAMS.map(team => {
              const active = favorites.teams.has(team.id);
              return (
                <button
                  key={team.id}
                  onClick={() => toggle("team" as FavoriteType, team.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                    active
                      ? `${team.bg} ${team.border} ${team.text}`
                      : "bg-white/5 border-sport-border text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                    active ? `${team.bg} ${team.text} ${team.border}` : "bg-sport-border text-gray-500"
                  }`}>
                    {team.abbr.slice(0, 2)}
                  </span>
                  <span className="truncate">{team.name}</span>
                  {active && <Star size={10} fill="currentColor" className="text-gold-400 shrink-0 ml-auto" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Jugadores ──────────────────────────────────────────────────────── */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
        <h3 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
          <span className="text-base">👤</span> Jugadores favoritos
        </h3>

        {/* Custom player input */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-sport-border rounded-xl px-3 py-2 focus-within:border-gold-500/40 transition-colors">
            <Search size={13} className="text-gray-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomPlayer()}
              placeholder="Añadir jugador por nombre…"
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
            />
          </div>
          <button
            onClick={addCustomPlayer}
            disabled={!playerInput.trim()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-400 text-sm font-medium hover:bg-gold-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Plus size={14} /> Añadir
          </button>
        </div>

        {/* Saved players */}
        {favorites.players.size > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Tus jugadores</p>
            <div className="flex flex-wrap gap-2">
              {[...favorites.players].map((name) => (
                <span
                  key={name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-medium"
                >
                  ⭐ {name}
                  <button
                    onClick={() => toggle("player" as FavoriteType, name)}
                    className="text-gold-500 hover:text-white transition-colors ml-0.5"
                    title="Eliminar"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Filter bar for preset list */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
          {["Todos", "⚽", "🏀", "🎾"].map((f) => (
            <button
              key={f}
              onClick={() => setPlayerFilter(f === "Todos" ? "" : f)}
              className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-colors ${
                (f === "Todos" && playerFilter === "") || playerFilter === f
                  ? "bg-white/15 text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Preset popular players */}
        <div className="flex flex-wrap gap-2">
          {POPULAR_PLAYERS
            .filter((p) => !playerFilter || p.sport === playerFilter)
            .map((p) => {
              const active = favorites.players.has(p.name);
              return (
                <button
                  key={p.name}
                  onClick={() => toggle("player" as FavoriteType, p.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    active
                      ? "bg-gold-500/20 border-gold-500/40 text-gold-300"
                      : "bg-white/5 border-sport-border text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <span className="text-[11px]">{p.sport}</span>
                  {p.name}
                  {active
                    ? <X size={10} className="text-gold-400 ml-0.5" />
                    : <Plus size={10} className="text-gray-600 ml-0.5" />
                  }
                </button>
              );
            })}
        </div>
      </div>

      {/* ── Summary ────────────────────────────────────────────────────────── */}
      {(favorites.leagues.size > 0 || favorites.teams.size > 0 || favorites.players.size > 0) && (
        <p className="text-xs text-gray-600 text-center">
          {favorites.leagues.size > 0 && `${favorites.leagues.size} liga${favorites.leagues.size !== 1 ? "s" : ""}`}
          {favorites.leagues.size > 0 && (favorites.teams.size > 0 || favorites.players.size > 0) && " · "}
          {favorites.teams.size > 0 && `${favorites.teams.size} equipo${favorites.teams.size !== 1 ? "s" : ""}`}
          {favorites.teams.size > 0 && favorites.players.size > 0 && " · "}
          {favorites.players.size > 0 && `${favorites.players.size} jugador${favorites.players.size !== 1 ? "es" : ""}`}
          {" guardados"}
        </p>
      )}
    </div>
  );
}
