import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { action, email, password, username } = await request.json();
  const supabase = await createClient();

  if (action === "login") {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ user: data.user });
  }

  if (action === "register") {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) {
      let msg = error.message;
      if (msg.includes("already registered") || msg.includes("already been registered") || msg.includes("User already registered"))
        msg = "Este email ya está registrado. Prueba a iniciar sesión.";
      else if (msg.includes("Password should be at least") || msg.includes("password"))
        msg = "La contraseña no cumple los requisitos mínimos de seguridad.";
      else if (msg.includes("rate limit") || msg.includes("too many"))
        msg = "Demasiados intentos. Espera un momento e inténtalo de nuevo.";
      else
        msg = "No se pudo crear la cuenta. Comprueba los datos e inténtalo de nuevo.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ user: data.user });
  }

  if (action === "logout") {
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
