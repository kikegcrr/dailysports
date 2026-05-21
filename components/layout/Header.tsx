"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home, Tv2, Users, MessageSquare, Bookmark, LogIn,
  UserPlus, Menu, X, Trophy, Zap
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function Header({ lang, dict }: { lang: string; dict: Record<string, string> }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav: NavItem[] = [
    { href: `/${lang}`, label: dict.home, icon: <Home size={16} /> },
    { href: `/${lang}/futbol`, label: dict.football, icon: <span>⚽</span> },
    { href: `/${lang}/baloncesto`, label: dict.basketball, icon: <span>🏀</span> },
    { href: `/${lang}/otros`, label: dict.other, icon: <Trophy size={16} /> },
    { href: `/${lang}/social`, label: dict.social, icon: <Tv2 size={16} /> },
    { href: `/${lang}/foros`, label: dict.forums, icon: <MessageSquare size={16} /> },
  ];

  const isActive = (href: string) =>
    href === `/${lang}` ? pathname === `/${lang}` : pathname.startsWith(href);

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

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher currentLang={lang} />

          <Link
            href={`/${lang}/guardados`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Bookmark size={16} />
            <span className="hidden md:inline">{dict.saved}</span>
          </Link>

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
            <div className="mt-2 pt-2 border-t border-sport-border flex gap-2">
              <Link
                href={`/${lang}/login`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-sport-border text-white hover:bg-white/5"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={16} /> {dict.login}
              </Link>
              <Link
                href={`/${lang}/registro`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm bg-gold-500 text-black font-semibold hover:bg-gold-400"
                onClick={() => setMobileOpen(false)}
              >
                <Users size={16} /> {dict.register}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
