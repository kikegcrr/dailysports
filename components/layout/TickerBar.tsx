"use client";
import { useEffect, useState } from "react";
import { NewsItem } from "@/lib/rss";

export default function TickerBar() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/news?category=all")
      .then((r) => r.json())
      .then((data) => setItems(data.slice(0, 12)))
      .catch(() => {});
  }, []);

  if (!items.length) return null;

  const text = items.map((n) => `${n.source.toUpperCase()}: ${n.title}`).join("   •   ");

  return (
    <div className="bg-gold-500 text-black text-xs font-semibold overflow-hidden h-8 flex items-center">
      <span className="shrink-0 bg-black text-gold-400 px-3 py-1 h-full flex items-center uppercase tracking-widest text-[10px]">
        EN VIVO
      </span>
      <div className="flex-1 overflow-hidden relative">
        <div
          className="whitespace-nowrap animate-ticker inline-block"
          style={{ animationDuration: `${Math.max(30, text.length * 0.08)}s` }}
        >
          {text} &nbsp;&nbsp;&nbsp; {text}
        </div>
      </div>
    </div>
  );
}
