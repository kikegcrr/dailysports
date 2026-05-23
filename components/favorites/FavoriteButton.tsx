"use client";
import { Star } from "lucide-react";
import { useFavorites, FavoriteType } from "@/lib/favorites-context";

interface FavoriteButtonProps {
  type:      FavoriteType;
  value:     string;
  label?:    string;
  /** Visual style: "icon" = star only, "pill" = star + text */
  variant?:  "icon" | "pill";
  size?:     "xs" | "sm" | "md";
  className?: string;
}

export default function FavoriteButton({
  type, value, label, variant = "icon", size = "sm", className = "",
}: FavoriteButtonProps) {
  const { has, toggle } = useFavorites();
  const active = has(type, value);

  const iconSize = size === "xs" ? 10 : size === "sm" ? 12 : 15;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggle(type, value);
  };

  if (variant === "pill") {
    return (
      <button
        onClick={handleClick}
        title={active ? `Quitar de favoritos` : `Añadir a favoritos`}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          active
            ? "bg-gold-500/20 border-gold-500/40 text-gold-400"
            : "bg-white/5 border-sport-border text-gray-400 hover:text-gold-400 hover:border-gold-500/30"
        } ${className}`}
      >
        <Star size={iconSize} fill={active ? "currentColor" : "none"} />
        {label && <span>{active ? "Guardado" : label}</span>}
      </button>
    );
  }

  // Default: icon only
  return (
    <button
      onClick={handleClick}
      title={active ? `Quitar de favoritos${label ? ` (${label})` : ""}` : `Añadir a favoritos${label ? ` (${label})` : ""}`}
      className={`p-1 rounded-lg transition-all ${
        active
          ? "text-gold-400"
          : "text-gray-600 hover:text-gold-400"
      } ${className}`}
    >
      <Star size={iconSize} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
