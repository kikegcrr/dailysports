"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, LogIn, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid credentials"))
    return "Email o contraseña incorrectos. Comprueba tus datos e inténtalo de nuevo.";
  if (m.includes("email not confirmed"))
    return "Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.";
  if (m.includes("too many requests") || m.includes("rate limit"))
    return "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.";
  if (m.includes("user not found"))
    return "No existe una cuenta con ese email.";
  if (m.includes("network") || m.includes("fetch"))
    return "Error de conexión. Comprueba tu internet e inténtalo de nuevo.";
  return `Error al iniciar sesión: ${msg}`;
}

export default function LoginPage() {
  const { lang } = useParams() as { lang: string };
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: sbError } = await supabase.auth.signInWithPassword({ email, password });
      if (sbError) {
        setError(translateError(sbError.message));
        return;
      }
      router.push(`/${lang}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? translateError(err.message) : "Error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-semibold text-white">Iniciar Sesión</h1>
          <p className="text-gray-500 text-sm mt-1">Accede a tu cuenta deportiva</p>
        </div>

        <form onSubmit={handleLogin} className="bg-sport-card border border-sport-border rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
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
          </div>

          <Button type="submit" loading={loading} className="w-full">
            <LogIn size={16} /> Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          ¿No tienes cuenta?{" "}
          <Link href={`/${lang}/registro`} className="text-gold-400 hover:text-gold-300 font-medium">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
