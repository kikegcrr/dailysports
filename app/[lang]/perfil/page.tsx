"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Bookmark, MessageSquare, Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import FavoritesManager from "@/components/favorites/FavoritesManager";
import FavoritesSummary from "@/components/favorites/FavoritesSummary";
import { useFavorites } from "@/lib/favorites-context";

export default function ProfilePage() {
  const { lang }  = useParams() as { lang: string };
  const router    = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${lang}`);
    router.refresh();
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-sport-card border border-sport-border rounded-2xl p-6 h-32 animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[0,1,2].map(i => <div key={i} className="bg-sport-card border border-sport-border rounded-2xl h-24 animate-pulse" />)}
        </div>
      </div>
    );
  }

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-sport-card border border-sport-border rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-sport-border flex items-center justify-center mx-auto mb-4">
            <User size={28} className="text-gray-500" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Accede a tu perfil</h1>
          <p className="text-gray-500 text-sm mb-6">Inicia sesión para ver y gestionar tu cuenta.</p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/${lang}/login`}
              className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href={`/${lang}/registro`}
              className="px-6 py-2.5 rounded-xl border border-sport-border text-white hover:bg-white/5 text-sm transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Logged in ─────────────────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { favorites } = useFavorites();
  const favCount = favorites.leagues.size + favorites.teams.size + favorites.sports.size + favorites.creators.size + favorites.players.size;

  const username  = user.user_metadata?.username || user.email?.split("@")[0] || "Usuario";
  const email     = user.email ?? "";
  const letter    = username.charAt(0).toUpperCase();
  const joinedAt  = new Date(user.created_at).toLocaleDateString("es", { year: "numeric", month: "long" });

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Profile header */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center text-2xl font-bold text-black shrink-0">
            {letter}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-white truncate">{username}</h1>
            <p className="text-sm text-gray-500 truncate">{email}</p>
            <p className="text-xs text-gray-600 mt-0.5">Miembro desde {joinedAt}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-colors shrink-0"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Bookmark size={20} className="text-gold-400" />, label: "Guardados", value: "0" },
          { icon: <Star size={20} className="text-gold-400" />,     label: "Favoritos", value: String(favCount) },
          { icon: <MessageSquare size={20} className="text-gold-400" />, label: "Posts", value: "0" },
        ].map((s) => (
          <div key={s.label} className="bg-sport-card border border-sport-border rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Account info */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-5 space-y-3">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <User size={16} className="text-gold-400" /> Información de cuenta
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-sport-border">
            <span className="text-gray-500">Usuario</span>
            <span className="text-white font-medium">{username}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-sport-border">
            <span className="text-gray-500">Email</span>
            <span className="text-white">{email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500">Miembro desde</span>
            <span className="text-white">{joinedAt}</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Settings size={16} className="text-gray-400" /> Configuración
        </h2>
        <div className="space-y-1">
          {["Notificaciones", "Privacidad"].map((item) => (
            <button
              key={item}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              {item}
              <span className="text-gray-600">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Favorites: summary (what you have saved) ──────────────────────── */}
      <div>
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Star size={16} className="text-gold-400" fill="currentColor" /> Mis favoritos
        </h2>
        <FavoritesSummary showDbWarning />
      </div>

      {/* ── Favorites: manager (add / remove) ─────────────────────────────── */}
      <div>
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm text-gray-400">
          Añadir o quitar favoritos
        </h2>
        <FavoritesManager lang={lang} compact />
      </div>
    </div>
  );
}
