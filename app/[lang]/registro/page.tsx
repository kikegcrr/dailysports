"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, UserPlus, Eye, EyeOff, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

// ── Translate Supabase error messages to Spanish ──────────────────────────────
function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Este email ya está registrado. Prueba a iniciar sesión.";
  if (m.includes("user already registered"))
    return "Este email ya está registrado. Prueba a iniciar sesión.";
  if (m.includes("password should be at least") || m.includes("weak password"))
    return "La contraseña no cumple los requisitos mínimos de seguridad.";
  if (m.includes("rate limit") || m.includes("too many requests") || m.includes("email rate limit"))
    return "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.";
  if (m.includes("invalid email") || m.includes("unable to validate email"))
    return "El email introducido no es válido.";
  if (m.includes("network") || m.includes("fetch"))
    return "Error de conexión. Comprueba tu internet e inténtalo de nuevo.";
  // Return raw message so we can debug in production if needed
  return `Error al crear la cuenta: ${msg}`;
}

export default function RegisterPage() {
  const { lang } = useParams() as { lang: string };
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", confirm: "", username: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Client-side validation ────────────────────────────────────────────────
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError("La contraseña debe incluir al menos una letra y un número");
      return;
    }
    if (form.username.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(form.username)) {
      setError("El nombre de usuario solo puede contener letras, números, guiones y guiones bajos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: sbError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { username: form.username },
        },
      });

      if (sbError) {
        setError(translateError(sbError.message));
        return;
      }

      // If Supabase gave us an immediate session (email confirmation disabled)
      // redirect straight to the app.
      if (data.session) {
        router.push(`/${lang}`);
        router.refresh();
        return;
      }

      // No error → success, confirmation email on its way.
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? translateError(err.message) : "Error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">¡Cuenta creada!</h2>
          <p className="text-gray-400 mb-6">
            Hemos enviado un enlace de confirmación a{" "}
            <span className="text-white">{form.email}</span>.
            Revisa tu bandeja de entrada (y la carpeta de spam).
          </p>
          <Button onClick={() => router.push(`/${lang}/login`)}>
            Ir a Iniciar Sesión
          </Button>
        </div>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────────────
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500 shadow-lg shadow-gold-500/40">
              <Zap size={22} className="text-black" fill="black" />
            </span>
            <span className="font-display text-2xl tracking-wide text-white">
              daily<span className="text-gold-400">Sports</span>
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-white">Crear Cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Únete a la comunidad deportiva</p>
        </div>

        <form onSubmit={handleRegister} className="bg-sport-card border border-sport-border rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre de usuario</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              required
              autoComplete="username"
              placeholder="futbolero_es"
              className="w-full bg-sport-border text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-600 border border-transparent focus:border-gold-500/50 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
              autoComplete="email"
              placeholder="tu@email.com"
              className="w-full bg-sport-border text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-600 border border-transparent focus:border-gold-500/50 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Contraseña</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-sport-border text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-600 border border-transparent focus:border-gold-500/50 focus:outline-none transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">Mínimo 8 caracteres con letras y números</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Confirmar contraseña</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Repite tu contraseña"
              className="w-full bg-sport-border text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-600 border border-transparent focus:border-gold-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Features list */}
          <div className="bg-sport-border/50 rounded-xl p-3 space-y-1.5">
            {[
              "Guarda artículos y noticias favoritas",
              "Sigue tus equipos y creadores",
              "Participa en todos los foros",
              "Redacta y publica noticias propias",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-gray-400">
                <Check size={12} className="text-emerald-400 shrink-0" /> {f}
              </div>
            ))}
          </div>

          <Button type="submit" loading={loading} className="w-full">
            <UserPlus size={16} /> Crear Cuenta Gratis
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link href={`/${lang}/login`} className="text-gold-400 hover:text-gold-300 font-medium">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
