"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home, Tv2, MessageSquare, Bookmark, LogIn,
  UserPlus, Menu, X, Zap, LogOut, User,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/components/auth/AuthProvider";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

// Returns the display name: username from metadata, or the part before @ in email
function displayName(user: { email?: string; user_metadata?: { username?: string } }): string {
  return user.user_metadata?.username || user.email?.split("@")[0] || "Usuario";
}

// First letter avatar
function Avatar({ user }: { user: { email?: string; user_metadata?: { username?: string } } }) {
  const letter = displayName(user).charAt(0).toUpperCase();
  return (
    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center text-sm font-bold text-black shrink-0">
      {letter}
    </span>
  );
}

export default function Header({ lang, dict }: { lang: string; dict: Record<string, string> }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const { user, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav: NavItem[] = [
    { href: `/${lang}`,            label: dict.home,       icon: <Home size={16} /> },
    { href: `/${lang}/marcadores`, label: "Marcadores",    icon: <span>🔴</span> },
    { href: `/${lang}/futbol`,     label: dict.football,   icon: <span>⚽</span> },
    { href: `/${lang}/baloncesto`, label: dict.basketball, icon: <span>🏀</span> },
    { href: `/${lang}/directo`,    label: "En Vivo",       icon: <Tv2 size={16} /> },
    { href: `/${lang}/social`,     label: dict.social,     icon: <span>📱</span> },
    { href: `/${lang}/foros`,      label: dict.forums,     icon: <MessageSquare size={16} /> },
  ];

  const isActive = (href: string) =>
    href === `/${lang}` ? pathname === `/${lang}` : pathname.startsWith(href);

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    router.push(`/${lang}`);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 bg-sport-darker/95 backdrop-blur-md border-b border-sport-border">
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 shrink-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-500 shadow-lg shadow-gold-500/40">
            <Zap size={18} className="text-black" fill="black" />
          </span>
          <span className="font-display text-xl tracking-wide text-white">
            daily<span className="text-gold-400">Sports</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-gold-500/15 text-gold-400 border border-gold-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher currentLang={lang} />

          <Link
            href={`/${lang}/guardados`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Bookmark size={16} />
            <span className="hidden md:inline">{dict.saved}</span>
          </Link>

          {/* Auth area — skeleton while loading */}
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-sport-border animate-pulse" />
          ) : user ? (
            /* ── Logged in ── */
            <div className="flex items-center gap-2">
              <Link
                href={`/${lang}/perfil`}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Avatar user={user} />
                <span className="hidden md:block text-sm font-medium text-white max-w-[120px] truncate">
                  {displayName(user)}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                title="Cerrar sesión"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Salir</span>
              </button>
            </div>
          ) : (
            /* ── Logged out ── */
            <>
              <Link
                href={`/${lang}/login`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogIn size={16} />
                <span className="hidden md:inline">{dict.login}</span>
              </Link>
              <Link
                href={`/${lang}/registro`}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm bg-gold-500 hover:bg-gold-400 text-black font-semibold transition-colors"
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">{dict.register}</span>
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-sport-border bg-sport-darker/98 backdrop-blur-md">
          <nav className="flex flex-col p-4 gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-gold-500/15 text-gold-400"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            <div className="mt-2 pt-2 border-t border-sport-border">
              {user ? (
                <>
                  <Link
                    href={`/${lang}/perfil`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    <Avatar user={user} />
                    <span>{displayName(user)}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={16} /> Cerrar sesión
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href={`/${lang}/login`}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-sport-border text-white hover:bg-white/5"
                  >
                    <LogIn size={16} /> {dict.login}
                  </Link>
                  <Link
                    href={`/${lang}/registro`}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm bg-gold-500 text-black font-semibold hover:bg-gold-400"
                  >
                    <UserPlus size={16} /> {dict.register}
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
