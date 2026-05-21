import { NextRequest, NextResponse } from "next/server";

// ElevenLabs TTS proxy
const ELEVENLABS_API = "https://api.elevenlabs.io/v1";

// Curated voice IDs — real ElevenLabs voice IDs for well-known voices
export const VOICE_CHARACTERS = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Narrador Épico", description: "Voz grave y épica estilo narrador de documentales", emoji: "🎙️" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Comentarista Latino", description: "Energía latina, perfecto para narrar goles", emoji: "⚽" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Locutora Profesional", description: "Voz femenina profesional de radio deportiva", emoji: "📻" },
  { id: "ErXwobaYiN019PkySvjV", name: "Reportero Urgente", description: "Tono urgente de última hora deportiva", emoji: "🚨" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Analista Táctico", description: "Voz pausada y analítica, estilo conferencia", emoji: "📊" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Narrador Clásico", description: "Estilo clásico de narración deportiva española", emoji: "🏆" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Presentador Premium", description: "Voz premium, televisión de alto nivel", emoji: "📺" },
  { id: "Zlb1dXrM653N07WRdFW3", name: "Voz Brit Deportes", description: "Estilo inglés, Premier League vibes", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
];

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ElevenLabs API key not configured" },
      { status: 503 }
    );
  }

  const { text, voiceId } = await request.json();

  if (!text || !voiceId) {
    return NextResponse.json({ error: "Missing text or voiceId" }, { status: 400 });
  }

  // Limit text length to avoid excessive API usage
  const truncatedText = text.slice(0, 3000);

  try {
    const res = await fetch(`${ELEVENLABS_API}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: truncatedText,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const audioBuffer = await res.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Return available voices
export async function GET() {
  return NextResponse.json(VOICE_CHARACTERS);
}
