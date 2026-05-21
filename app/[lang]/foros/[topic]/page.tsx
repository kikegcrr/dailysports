"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MessageSquare, Plus, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { FORUM_TOPICS } from "@/lib/utils";
import ForumTopics from "@/components/forums/ForumTopics";
import ThreadCard, { Thread } from "@/components/forums/ThreadCard";
import Button from "@/components/ui/Button";

const MOCK_THREADS: Thread[] = [
  {
    id: "1",
    title: "¿Quién será el campeón de LaLiga esta temporada?",
    content: "Con la igualdad que hay este año entre los tres grandes, ¿quién creéis que se llevará el título?",
    topic: "laliga",
    user_id: "user1",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    reply_count: 42,
    view_count: 1240,
    profiles: { username: "futbolero_mad" },
  },
  {
    id: "2",
    title: "Análisis táctico: El sistema del Barcelona esta temporada",
    content: "¿Cómo veis el cambio de sistema que está implementando el entrenador?",
    topic: "laliga",
    user_id: "user2",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    reply_count: 28,
    view_count: 890,
    profiles: { username: "tacticaFCB" },
  },
  {
    id: "3",
    title: "El mejor gol de la jornada - votación",
    content: "¡Vota tu favorito! Hay tres candidatos increíbles esta semana.",
    topic: "laliga",
    user_id: "user3",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    reply_count: 67,
    view_count: 3400,
    pinned: true,
    profiles: { username: "golazo_es" },
  },
  {
    id: "4",
    title: "Fichajes de invierno - rumores y confirmados",
    content: "Hilo para seguir todos los movimientos del mercado de invierno en LaLiga",
    topic: "laliga",
    user_id: "user4",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    reply_count: 134,
    view_count: 8900,
    pinned: true,
    profiles: { username: "mercado_es" },
  },
];

export default function TopicForumPage() {
  const params = useParams();
  const lang = params.lang as string;
  const topicSlug = params.topic as string;

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const topicInfo = FORUM_TOPICS.find((t) => t.slug === topicSlug);

  useEffect(() => {
    // In production: fetch(`/api/forums?topic=${topicSlug}`)
    setTimeout(() => {
      setThreads(MOCK_THREADS.filter((t) => t.topic === topicSlug || topicSlug === "laliga"));
      setLoading(false);
    }, 500);
  }, [topicSlug]);

  const handleNewThread = async () => {
    if (!newTitle.trim()) return;
    const newThread: Thread = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      topic: topicSlug,
      user_id: "guest",
      created_at: new Date().toISOString(),
      reply_count: 0,
      view_count: 0,
      profiles: { username: "Tú" },
    };
    setThreads([newThread, ...threads]);
    setNewTitle("");
    setNewContent("");
    setShowNewThread(false);
  };

  if (!topicInfo) {
    return (
      <div className="text-center py-20 text-gray-400">
        Foro no encontrado.{" "}
        <Link href={`/${lang}/foros`} className="text-gold-400 hover:text-gold-300">
          Ver todos los foros
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-1 space-y-4">
        <Link
          href={`/${lang}/foros`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} /> Todos los foros
        </Link>
        <div className="bg-sport-card border border-sport-border rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Otros foros
          </h3>
          <ForumTopics lang={lang} activeSlug={topicSlug} />
        </div>
      </aside>

      {/* Main */}
      <div className="lg:col-span-3 space-y-5">
        {/* Topic header */}
        <div className={`rounded-2xl p-6 bg-gradient-to-r ${topicInfo.color} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-sport-card/70 backdrop-blur-sm" />
          <div className="relative flex items-center justify-between">
            <div>
              <span className="text-4xl block mb-2">{topicInfo.icon}</span>
              <h1 className="text-2xl font-display tracking-wide text-white">{topicInfo.label}</h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MessageSquare size={12} /> {threads.length} hilos</span>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowNewThread(!showNewThread)}
            >
              <Plus size={16} /> Nuevo hilo
            </Button>
          </div>
        </div>

        {/* New thread form */}
        {showNewThread && (
          <div className="bg-sport-card border border-gold-500/40 rounded-2xl p-5 space-y-3 animate-slide-up">
            <h3 className="font-semibold text-white">Crear nuevo hilo</h3>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título del hilo..."
              className="w-full bg-sport-border text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-600 border border-transparent focus:border-gold-500/50 focus:outline-none transition-colors"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Escribe el contenido... (noticias, debates, opiniones...)"
              rows={4}
              className="w-full bg-sport-border text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-600 border border-transparent focus:border-gold-500/50 focus:outline-none transition-colors resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowNewThread(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleNewThread}>
                Publicar hilo
              </Button>
            </div>
          </div>
        )}

        {/* Threads */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-sport-card border border-sport-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p>Sé el primero en crear un hilo en este foro</p>
            <Button className="mt-4" onClick={() => setShowNewThread(true)}>
              <Plus size={16} /> Crear primer hilo
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {threads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
