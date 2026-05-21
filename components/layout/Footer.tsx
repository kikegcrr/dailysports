import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer({ lang }: { lang: string }) {
  return (
    <footer className="border-t border-sport-border bg-sport-darker mt-16">
      <div className="max-w-screen-2xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${lang}`} className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-500">
                <Zap size={18} className="text-black" fill="black" />
              </span>
              <span className="font-display text-lg text-white">
                daily<span className="text-gold-400">Sports</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              Las noticias deportivas más importantes, actualizadas cada 10 minutos.
              Fútbol, baloncesto y mucho más.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Secciones</h4>
            <ul className="space-y-2">
              {[
                { href: `/${lang}/futbol`, label: "⚽ Fútbol" },
                { href: `/${lang}/baloncesto`, label: "🏀 Baloncesto" },
                { href: `/${lang}/otros`, label: "🏆 Otros Deportes" },
                { href: `/${lang}/social`, label: "📱 Social" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Comunidad</h4>
            <ul className="space-y-2">
              {[
                { href: `/${lang}/foros`, label: "💬 Foros" },
                { href: `/${lang}/social/creadores`, label: "👤 Creadores" },
                { href: `/${lang}/registro`, label: "✨ Registrarse" },
                { href: `/${lang}/guardados`, label: "🔖 Guardados" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Legal</h4>
            <ul className="space-y-2">
              {[
                { href: `/${lang}/sobre`, label: "ℹ️ Acerca de" },
                { href: `/${lang}/contacto`, label: "✉️ Contacto" },
                { href: `/${lang}/privacidad`, label: "🔒 Privacidad" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-sport-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} dailySports. Agregador de noticias deportivas.
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/privacidad`} className="text-xs text-gray-700 hover:text-gray-500 transition-colors">Privacidad</Link>
            <Link href={`/${lang}/contacto`} className="text-xs text-gray-700 hover:text-gray-500 transition-colors">Contacto</Link>
            <Link href={`/${lang}/sobre`} className="text-xs text-gray-700 hover:text-gray-500 transition-colors">Acerca de</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
