"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, X, Volume2, SkipBack, SkipForward, ChevronUp, ChevronDown, Mic } from "lucide-react";

interface Voice {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

interface VoiceReaderProps {
  text?: string;
  title?: string;
}

const WEB_SPEECH_VOICES = [
  { id: "ws-es-1", name: "Comentarista Latino", description: "Energía alta, ritmo deportivo", emoji: "⚽", pitch: 1.1, rate: 1.1, lang: "es-ES" },
  { id: "ws-es-2", name: "Narrador Épico", description: "Tono grave y épico", emoji: "🎙️", pitch: 0.8, rate: 0.9, lang: "es-ES" },
  { id: "ws-en-1", name: "British Commentator", description: "Estilo Premier League", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pitch: 1.0, rate: 0.95, lang: "en-GB" },
  { id: "ws-es-3", name: "Locutora Radio", description: "Voz femenina profesional", emoji: "📻", pitch: 1.3, rate: 1.0, lang: "es-ES" },
  { id: "ws-es-4", name: "Analista Táctico", description: "Pausado y analítico", emoji: "📊", pitch: 0.9, rate: 0.85, lang: "es-ES" },
];

export default function VoiceReader({ text, title }: VoiceReaderProps) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [useElevenLabs, setUseElevenLabs] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [elVoices, setElVoices] = useState<Voice[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressRef = useRef<number>(0);

  // Load ElevenLabs voices
  useEffect(() => {
    fetch("/api/tts")
      .then((r) => r.json())
      .then((data: Voice[]) => {
        setElVoices(data);
        setVoices([...WEB_SPEECH_VOICES, ...data]);
      })
      .catch(() => {
        setVoices(WEB_SPEECH_VOICES);
      });
  }, []);

  const stopAll = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
    setProgress(0);
  }, []);

  const playWebSpeech = useCallback((voiceConfig: typeof WEB_SPEECH_VOICES[0], readText: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(readText);
    utterance.lang = voiceConfig.lang;
    utterance.pitch = voiceConfig.pitch;
    utterance.rate = voiceConfig.rate;

    // Try to match browser voice
    const availableVoices = window.speechSynthesis.getVoices();
    const matchedVoice = availableVoices.find(
      (v) => v.lang.startsWith(voiceConfig.lang.split("-")[0])
    );
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => { setPlaying(false); setProgress(100); };
    utterance.onerror = () => setPlaying(false);
    utterance.onboundary = (e) => {
      if (readText.length > 0) {
        progressRef.current = (e.charIndex / readText.length) * 100;
        setProgress(progressRef.current);
      }
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const playElevenLabs = useCallback(async (voiceId: string, readText: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: readText, voiceId }),
      });

      if (!res.ok) {
        // Fallback to web speech
        const wsVoice = WEB_SPEECH_VOICES[0];
        playWebSpeech(wsVoice, readText);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      });
      audio.addEventListener("ended", () => { setPlaying(false); setProgress(100); });
      audio.addEventListener("error", () => { setPlaying(false); });

      await audio.play();
      setPlaying(true);
    } finally {
      setLoading(false);
    }
  }, [playWebSpeech]);

  const handlePlay = useCallback(async () => {
    const readText = text || "No hay texto disponible para leer.";
    if (!selectedVoice) {
      setShowVoicePicker(true);
      return;
    }

    stopAll();

    const wsVoice = WEB_SPEECH_VOICES.find((v) => v.id === selectedVoice);
    const elVoice = elVoices.find((v) => v.id === selectedVoice);

    if (wsVoice) {
      playWebSpeech(wsVoice, readText);
    } else if (elVoice) {
      await playElevenLabs(elVoice.id, readText);
    }
  }, [text, selectedVoice, stopAll, playWebSpeech, playElevenLabs, elVoices]);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
    } else if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.pause();
      setPlaying(false);
    }
  }, []);

  const handleResume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlaying(true);
    } else if (window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
      setPlaying(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopAll();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [stopAll, audioUrl]);

  const currentVoice = voices.find((v) => v.id === selectedVoice);
  const isElVoice = elVoices.some((v) => v.id === selectedVoice);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sport-card border border-gold-500/40 hover:border-gold-500/70 text-gold-400 shadow-xl shadow-black/50 transition-all hover:scale-105"
        >
          <Mic size={18} className={playing ? "animate-pulse" : ""} />
          <span className="text-sm font-semibold">Leer artículo</span>
          {playing && <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />}
        </button>
      )}

      {/* Expanded player */}
      {open && (
        <div className="w-80 bg-sport-card border border-sport-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-sport-border bg-gradient-to-r from-gold-500/10 to-transparent">
            <div className="flex items-center gap-2">
              <Mic size={16} className={`text-gold-400 ${playing ? "animate-pulse" : ""}`} />
              <span className="text-sm font-semibold text-white">Lector IA</span>
            </div>
            <button onClick={() => { setOpen(false); stopAll(); }} className="text-gray-500 hover:text-white p-1">
              <X size={16} />
            </button>
          </div>

          {/* Article title */}
          {title && (
            <div className="px-4 py-2 border-b border-sport-border">
              <p className="text-xs text-gray-400 line-clamp-2">{title}</p>
            </div>
          )}

          {/* Voice selector */}
          <div className="px-4 py-2 border-b border-sport-border">
            <button
              onClick={() => setShowVoicePicker(!showVoicePicker)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <span>{currentVoice?.emoji || "🎙️"}</span>
                <span className="text-sm text-white">{currentVoice?.name || "Selecciona una voz"}</span>
                {isElVoice && <span className="text-xs bg-gold-500/20 text-gold-400 px-1.5 py-0.5 rounded border border-gold-500/30">ElevenLabs</span>}
              </div>
              {showVoicePicker ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
            </button>

            {showVoicePicker && (
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                {voices.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => { setSelectedVoice(voice.id); setShowVoicePicker(false); stopAll(); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                      selectedVoice === voice.id ? "bg-gold-500/20 text-gold-400" : "hover:bg-white/5 text-gray-300"
                    }`}
                  >
                    <span>{voice.emoji}</span>
                    <div>
                      <p className="text-xs font-medium">{voice.name}</p>
                      <p className="text-xs text-gray-500">{voice.description}</p>
                    </div>
                    {elVoices.some((v) => v.id === voice.id) && (
                      <span className="ml-auto text-xs text-gold-600">EL</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="px-4 py-1">
            <div className="h-1 bg-sport-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 px-4 py-3">
            <button
              onClick={() => { stopAll(); setProgress(0); }}
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={() => {
                if (playing) handlePause();
                else if (progress > 0) handleResume();
                else handlePlay();
              }}
              disabled={loading}
              className="w-12 h-12 rounded-full bg-gold-500 hover:bg-gold-400 text-black flex items-center justify-center shadow-lg shadow-gold-500/30 transition-all hover:scale-105 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : playing ? (
                <Pause size={20} fill="black" />
              ) : (
                <Play size={20} className="ml-0.5" fill="black" />
              )}
            </button>

            <button
              onClick={stopAll}
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SkipForward size={18} />
            </button>
          </div>

          <div className="px-4 pb-3 text-center">
            <p className="text-xs text-gray-600">
              {playing ? "Reproduciendo..." : "Selecciona una voz y pulsa play"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
