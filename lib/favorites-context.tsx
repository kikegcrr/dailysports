"use client";
import {
  createContext, useContext, useEffect, useState, useCallback, useRef,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

// ─── Types ────────────────────────────────────────────────────────────────────
export type FavoriteType = "sport" | "league" | "team" | "creator" | "player";

export interface FavoritesState {
  sports:   Set<string>;
  leagues:  Set<string>;
  teams:    Set<string>;
  creators: Set<string>;
  players:  Set<string>;
}

interface FavoritesCtx {
  favorites:    FavoritesState;
  loading:      boolean;
  dbAvailable:  boolean;       // false → table missing, using localStorage fallback
  toggle:       (type: FavoriteType, value: string) => Promise<void>;
  has:          (type: FavoriteType, value: string) => boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LS_KEY = "ds_favorites_v1";
const VALID_TYPES: FavoriteType[] = ["sport","league","team","creator","player"];

function emptyState(): FavoritesState {
  return {
    sports:   new Set(),
    leagues:  new Set(),
    teams:    new Set(),
    creators: new Set(),
    players:  new Set(),
  };
}

function typeKey(type: FavoriteType): keyof FavoritesState {
  if (type === "sport")   return "sports";
  if (type === "league")  return "leagues";
  if (type === "creator") return "creators";
  if (type === "player")  return "players";
  return "teams";
}

function cloneState(s: FavoritesState): FavoritesState {
  return {
    sports:   new Set(s.sports),
    leagues:  new Set(s.leagues),
    teams:    new Set(s.teams),
    creators: new Set(s.creators),
    players:  new Set(s.players),
  };
}

function loadLocalStorage(): FavoritesState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return {
      sports:   new Set<string>(parsed.sports   ?? []),
      leagues:  new Set<string>(parsed.leagues  ?? []),
      teams:    new Set<string>(parsed.teams    ?? []),
      creators: new Set<string>(parsed.creators ?? []),
      players:  new Set<string>(parsed.players  ?? []),
    };
  } catch { return emptyState(); }
}

function saveLocalStorage(s: FavoritesState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      sports:   [...s.sports],
      leagues:  [...s.leagues],
      teams:    [...s.teams],
      creators: [...s.creators],
      players:  [...s.players],
    }));
  } catch { /* ignore */ }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const FavoritesContext = createContext<FavoritesCtx>({
  favorites:   emptyState(),
  loading:     true,
  dbAvailable: true,
  toggle:      async () => {},
  has:         () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [favorites,   setFavorites]   = useState<FavoritesState>(emptyState);
  const [loading,     setLoading]     = useState(true);
  const [dbAvailable, setDbAvailable] = useState(true);

  const favRef = useRef(favorites);
  useEffect(() => { favRef.current = favorites; }, [favorites]);

  // ── Load ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Wait until auth has resolved so we don't double-load
    if (authLoading) return;

    setLoading(true);

    if (!user) {
      // Not logged in → localStorage only
      setFavorites(loadLocalStorage());
      setLoading(false);
      return;
    }

    // Logged in → load from Supabase
    const supabase = createClient();
    supabase
      .from("user_favorites")
      .select("type, value")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (error) {
          // Table might not exist yet — fall back to localStorage
          console.warn("[favorites] Supabase load failed, using localStorage:", error.message);
          setDbAvailable(false);
          setFavorites(loadLocalStorage());
        } else {
          setDbAvailable(true);
          const state = emptyState();
          for (const row of data ?? []) {
            if (!VALID_TYPES.includes(row.type as FavoriteType)) continue;
            state[typeKey(row.type as FavoriteType)].add(row.value);
          }
          setFavorites(state);
        }
        setLoading(false);
      });
  }, [user, authLoading]);

  // ── Toggle ──────────────────────────────────────────────────────────────────
  const toggle = useCallback(async (type: FavoriteType, value: string) => {
    const key    = typeKey(type);
    const adding = !favRef.current[key].has(value);

    // 1. Optimistic update
    setFavorites(prev => {
      const next = cloneState(prev);
      if (adding) next[key].add(value);
      else        next[key].delete(value);
      // Always mirror to localStorage as backup
      saveLocalStorage(next);
      return next;
    });

    // 2. If not logged in or DB unavailable → localStorage only (already done above)
    if (!user || !dbAvailable) return;

    // 3. Sync to Supabase — check { error } explicitly (Supabase never throws)
    const supabase = createClient();
    let dbError: unknown = null;

    if (adding) {
      const { error } = await supabase
        .from("user_favorites")
        .insert({ user_id: user.id, type, value });
      dbError = error;
    } else {
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("type", type)
        .eq("value", value);
      dbError = error;
    }

    if (dbError) {
      // Rollback optimistic update and mark DB as unavailable
      console.warn("[favorites] Supabase save failed:", dbError);
      setDbAvailable(false);
      setFavorites(prev => {
        const next = cloneState(prev);
        // Reverse the change
        if (adding) next[key].delete(value);
        else        next[key].add(value);
        saveLocalStorage(next);
        return next;
      });
    }
  }, [user, dbAvailable]);

  const has = useCallback((type: FavoriteType, value: string): boolean => {
    return favRef.current[typeKey(type)].has(value);
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, loading, dbAvailable, toggle, has }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
