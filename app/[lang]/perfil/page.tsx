"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { User, Star, Bookmark, MessageSquare, Settings } from "lucide-react";

const FAVORITE_TEAMS = [
  { name: "Real Madrid", icon: "👑", league: "LaLiga" },
  { name: "NBA Lakers", icon: "🏀", league: "NBA" },
  { name: "FC Barcelona", icon: "💙❤️", league: "LaLiga" },
];

export default function ProfilePage() {
  const { lang } = useParams() as { lang: string };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-amber-700 flex items-center justify-center text-2xl font-bold text-black">
            U
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white">Mi Perfil</h1>
            <p className="text-sm text-gray-500">Inicia sesión para ver tu perfil completo</p>
          </div>
          <Link
            href={`/${lang}/login`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm transition-colors"
          >
            <User size={16} /> Iniciar Sesión
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Bookmark size={20} className="text-gold-400" />, label: "Guardados", value: "0" },
          { icon: <Star size={20} className="text-gold-400" />, label: "Favoritos", value: "0" },
          { icon: <MessageSquare size={20} className="text-gold-400" />, label: "Posts", value: "0" },
        ].map((s) => (
          <div key={s.label} className="bg-sport-card border border-sport-border rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Favorite teams */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Star size={18} className="text-gold-400" /> Equipos Favoritos
        </h2>
        <div className="space-y-3">
          {FAVORITE_TEAMS.map((team) => (
            <div key={team.name} className="flex items-center gap-3 p-3 rounded-xl bg-sport-border/50">
              <span className="text-2xl">{team.icon}</span>
              <div>
                <p className="text-sm font-medium text-white">{team.name}</p>
                <p className="text-xs text-gray-500">{team.league}</p>
              </div>
            </div>
          ))}
          <button className="w-full py-2 rounded-xl border border-dashed border-sport-border text-sm text-gray-600 hover:text-gold-400 hover:border-gold-500/40 transition-colors">
            + Añadir equipo
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Settings size={18} className="text-gray-400" /> Configuración
        </h2>
        <div className="space-y-2">
          {[
            "Notificaciones",
            "Equipos favoritos",
            "Creadores seguidos",
            "Privacidad",
          ].map((item) => (
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
    </div>
  );
}
