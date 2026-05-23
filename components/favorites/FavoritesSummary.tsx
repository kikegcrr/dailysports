"use client";
import { Star, AlertTriangle, X } from "lucide-react";
import { useFavorites, FavoriteType } from "@/lib/favorites-context";
import { TEAMS } from "@/components/news/MyTeamFeed";

// Map league key → label
const LEAGUE_LABELS: Record<string, string> = {
  laliga: "LaLiga", champions: "Champions", premier: "Premier League",
  seriea: "Serie A", bundesliga: "Bundesliga", ligue1: "Ligue 1",
  ligaportugal: "Liga Portugal", europa: "Europa League",
  nba: "NBA", euroleague: "EuroLeague", acb: "ACB",
  atp: "ATP", wta: "WTA",
};

const SPORT_LABELS: Record<string, string> = {
  football: "⚽ Fútbol", basketball: "🏀 Baloncesto", tennis: "🎾 Tenis",
};

interface ChipProps {
  label: string;
  onRemove: () => void;
  color?: string;
}
function FavChip({ label, onRemove, color = "text-white bg-white/10 border-white/20" }: ChipProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${color}`}>
      {label}
      <button
        onClick={onRemove}
        className="text-current opacity-50 hover:opacity-100 transition-opacity"
        title="Eliminar"
      >
        <X size={10} />
      </button>
    </span>
  );
}

interface SectionProps {
  icon: string;
  title: string;
  items: { label: string; type: FavoriteType; value: string }[];
  toggle: (type: FavoriteType, value: string) => void;
  chipColor?: string;
  emptyText: string;
}
function FavSection({ icon, title, items, toggle, chipColor, emptyText }: SectionProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <span>{icon}</span> {title}
      </p>
      {items.length === 0 ? (
        <p className="text-xs text-gray-700 italic">{emptyText}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map(({ label, type, value }) => (
            <FavChip
              key={`${type}-${value}`}
              label={label}
              onRemove={() => toggle(type, value)}
              color={chipColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  /** Show the DB-missing warning banner */
  showDbWarning?: boolean;
}

export default function FavoritesSummary({ showDbWarning }: Props) {
  const { favorites, loading, dbAvailable, toggle } = useFavorites();

  if (loading) {
    return (
      <div className="space-y-2">
        {[80, 120, 60].map((w, i) => (
          <div key={i} className={`h-5 rounded-lg bg-sport-border animate-pulse`} style={{ width: w }} />
        ))}
      </div>
    );
  }

  const sportItems = [...favorites.sports].map(v => ({
    label: SPORT_LABELS[v] ?? v, type: "sport" as FavoriteType, value: v,
  }));
  const leagueItems = [...favorites.leagues].map(v => ({
    label: LEAGUE_LABELS[v] ?? v, type: "league" as FavoriteType, value: v,
  }));
  const teamItems = [...favorites.teams].map(v => {
    const team = TEAMS.find(t => t.id === v);
    return { label: team?.name ?? v, type: "team" as FavoriteType, value: v };
  });
  const playerItems = [...favorites.players].map(v => ({
    label: v, type: "player" as FavoriteType, value: v,
  }));
  const creatorItems = [...favorites.creators].map(v => ({
    label: v, type: "creator" as FavoriteType, value: v,
  }));

  const totalCount =
    sportItems.length + leagueItems.length + teamItems.length +
    playerItems.length + creatorItems.length;

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Star size={15} className="text-gold-400" fill="currentColor" />
          Lo que tienes guardado
        </h3>
        {totalCount > 0 && (
          <span className="text-xs text-gray-600">
            {totalCount} elemento{totalCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* DB warning banner */}
      {showDbWarning && !dbAvailable && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
          <span>
            La tabla de favoritos no existe en la base de datos.{" "}
            <strong>Los favoritos se están guardando localmente</strong> en este dispositivo.
            Para sincronizarlos entre dispositivos, ejecuta el SQL de configuración en Supabase.
          </span>
        </div>
      )}

      {/* Empty state */}
      {totalCount === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Todavía no has guardado nada.</p>
          <p className="text-xs text-gray-700 mt-1">
            Usa las ⭐ en marcadores, ligas, jugadores y creadores para añadir favoritos.
          </p>
        </div>
      ) : (
        <div className="space-y-3 divide-y divide-sport-border">
          {sportItems.length > 0 && (
            <div className="pt-3 first:pt-0">
              <FavSection
                icon="🏆" title="Deportes"
                items={sportItems}
                toggle={toggle}
                emptyText="Sin deportes guardados"
              />
            </div>
          )}
          {leagueItems.length > 0 && (
            <div className="pt-3 first:pt-0">
              <FavSection
                icon="🥇" title="Ligas"
                items={leagueItems}
                toggle={toggle}
                chipColor="text-gold-300 bg-gold-500/10 border-gold-500/30"
                emptyText="Sin ligas guardadas"
              />
            </div>
          )}
          {teamItems.length > 0 && (
            <div className="pt-3 first:pt-0">
              <FavSection
                icon="🛡️" title="Equipos"
                items={teamItems}
                toggle={toggle}
                chipColor="text-sky-300 bg-sky-500/10 border-sky-500/30"
                emptyText="Sin equipos guardados"
              />
            </div>
          )}
          {playerItems.length > 0 && (
            <div className="pt-3 first:pt-0">
              <FavSection
                icon="👤" title="Jugadores"
                items={playerItems}
                toggle={toggle}
                chipColor="text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
                emptyText="Sin jugadores guardados"
              />
            </div>
          )}
          {creatorItems.length > 0 && (
            <div className="pt-3 first:pt-0">
              <FavSection
                icon="📺" title="Medios"
                items={creatorItems}
                toggle={toggle}
                chipColor="text-purple-300 bg-purple-500/10 border-purple-500/30"
                emptyText="Sin medios guardados"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
