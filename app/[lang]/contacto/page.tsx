import { hasLocale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Mail, MessageSquare, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacto — dailySports",
  description: "Contacta con el equipo de dailySports para sugerencias, errores o colaboraciones.",
};

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-display tracking-wide text-white mb-2">Contacto</h1>
        <p className="text-gray-400 text-sm">
          ¿Tienes alguna sugerencia, has encontrado un error o quieres colaborar? Escríbenos.
        </p>
      </div>

      <div className="space-y-4">
        <a
          href="mailto:kikegc11@gmail.com"
          className="flex items-center gap-4 bg-sport-card border border-sport-border hover:border-gold-500/40 rounded-2xl p-5 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
            <Mail size={20} className="text-gold-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm group-hover:text-gold-400 transition-colors">Correo electrónico</p>
            <p className="text-gray-400 text-sm">kikegc11@gmail.com</p>
          </div>
        </a>

        <a
          href="https://github.com/kikegcrr/dailysports/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-sport-card border border-sport-border hover:border-white/20 rounded-2xl p-5 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <ExternalLink size={20} className="text-gray-300" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm group-hover:text-gray-300 transition-colors">GitHub Issues</p>
            <p className="text-gray-400 text-sm">Reporta errores o solicita funcionalidades</p>
          </div>
        </a>

        <div className="flex items-center gap-4 bg-sport-card border border-sport-border rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <MessageSquare size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Foros de la comunidad</p>
            <p className="text-gray-400 text-sm">
              También puedes dejar tu opinión en los{" "}
              <a href={`/${lang}/foros`} className="text-gold-400 hover:underline">foros de dailySports</a>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-2">Tiempo de respuesta</h2>
        <p className="text-gray-400 text-sm">
          Intentamos responder a todos los mensajes en un plazo de 48-72 horas. Para reportar contenido inapropiado en los foros, usa el botón de reporte dentro de cada publicación.
        </p>
      </div>
    </div>
  );
}
