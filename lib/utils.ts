import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(dateStr: string, locale = "es"): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return locale === "es" ? "hace un momento" : "just now";
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return locale === "es" ? `hace ${m}m` : `${m}m ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return locale === "es" ? `hace ${h}h` : `${h}h ago`;
  }
  const d = Math.floor(diff / 86400);
  return locale === "es" ? `hace ${d}d` : `${d}d ago`;
}

export const SPORT_ICONS: Record<string, string> = {
  football: "⚽",
  basketball: "🏀",
  other: "🏆",
};

export const CATEGORY_COLORS: Record<string, string> = {
  football: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  basketball: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  other: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export const FORUM_TOPICS = [
  { slug: "laliga", label: "LaLiga", icon: "🇪🇸", sport: "football", color: "from-red-600 to-orange-600" },
  { slug: "champions", label: "Champions League", icon: "⭐", sport: "football", color: "from-blue-700 to-indigo-700" },
  { slug: "realmadrid", label: "Real Madrid", icon: "👑", sport: "football", color: "from-white/20 to-gold-500/20" },
  { slug: "barcelona", label: "FC Barcelona", icon: "💙❤️", sport: "football", color: "from-blue-600 to-red-600" },
  { slug: "atletico", label: "Atlético de Madrid", icon: "❤️🤍", sport: "football", color: "from-red-700 to-slate-700" },
  { slug: "premierleague", label: "Premier League", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", sport: "football", color: "from-purple-700 to-blue-700" },
  { slug: "nba", label: "NBA", icon: "🏀", sport: "basketball", color: "from-blue-600 to-red-600" },
  { slug: "acb", label: "ACB", icon: "🇪🇸🏀", sport: "basketball", color: "from-orange-600 to-red-600" },
  { slug: "mundial", label: "Mundial", icon: "🌍", sport: "football", color: "from-amber-500 to-yellow-600" },
  { slug: "eurobasket", label: "EuroBasket", icon: "🇪🇺", sport: "basketball", color: "from-blue-500 to-yellow-400" },
  { slug: "otros", label: "Otros Deportes", icon: "🏆", sport: "other", color: "from-purple-600 to-pink-600" },
];

export const SOCIAL_CHANNELS = {
  youtube: [
    { name: "El Chiringuito de Jugones", handle: "ElChiringuitodejugones", type: "debate" },
    { name: "Jijantes FC", handle: "JijantesFC", type: "debate" },
    { name: "El Larguero", handle: "Cadena_SER", type: "podcast" },
    { name: "Tiempo de Juego", handle: "TiempodeJuegoCOPE", type: "podcast" },
    { name: "Basket Total", handle: "BasketTotal", type: "basketball" },
    { name: "NBA España", handle: "NBASpain", type: "basketball" },
  ],
  twitch: [
    { name: "Mister Chip", handle: "misterchip_tv", type: "stats" },
    { name: "El Chiringuito", handle: "elchiringuitotv", type: "debate" },
    { name: "LoJuegasTV", handle: "lojuegastv", type: "gaming/sports" },
  ],
  twitter: [
    { name: "Mister Chip", handle: "misterchip" },
    { name: "El Chiringuito", handle: "elchiringuitotv" },
    { name: "Fabrizio Romano", handle: "FabrizioRomano" },
    { name: "Alfredo Martínez", handle: "Alfremartinezz" },
    { name: "Mundo Deportivo", handle: "mundodeportivo" },
    { name: "Marca", handle: "marca" },
  ],
};
