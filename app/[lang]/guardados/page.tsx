"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Bookmark, Trash2 } from "lucide-react";
import { NewsItem } from "@/lib/rss";
import NewsCard from "@/components/news/NewsCard";
import Link from "next/link";

export default function SavedPage() {
  const { lang } = useParams() as { lang: string };
  const [saved, setSaved] = useState<NewsItem[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("savedArticles") || "[]");
    setSaved(items);
  }, []);

  const removeItem = (id: string) => {
    const updated = saved.filter((s) => s.id !== id);
    setSaved(updated);
    localStorage.setItem("savedArticles", JSON.stringify(updated));
  };

  const clearAll = () => {
    setSaved([]);
    localStorage.removeItem("savedArticles");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-display tracking-wide text-white flex items-center gap-3">
          <Bookmark size={28} className="text-gold-400" fill="currentColor" />
          Artículos Guardados
        </h1>
        {saved.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={14} /> Limpiar todo
          </button>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-20">
          <Bookmark size={48} className="mx-auto mb-4 text-gray-700" />
          <p className="text-gray-400 text-lg">No tienes artículos guardados</p>
          <p className="text-gray-600 text-sm mt-1 mb-6">
            Guarda noticias desde el feed principal para leerlas después
          </p>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm transition-colors"
          >
            Explorar noticias
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((item) => (
            <div key={item.id} className="relative group">
              <NewsCard item={item} lang={lang} />
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Eliminar"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
