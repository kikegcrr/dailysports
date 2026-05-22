"use client";
import { useEffect, useState, useCallback } from "react";
import { NewsItem } from "@/lib/rss";
import { LiveMatch } from "@/app/api/scores/route";

const LEAGUE_ABBR: Record<string, string> = {
  laliga: "LaLiga", champions: "UCL", premier: "PL", seriea: "SerieA",
  bundesliga: "Bund.", ligue1: "L1", ligaportugal: "POR", europa: "UEL",
  nba: "NBA", atp: "ATP", wta: "WTA",
};

function fmtTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

function matchSegment(m: LiveMatch): string {
  const lg = LEAGUE_ABBR[m.league] ?? m.league.toUpperCase();
  const h = m.home.shortName, a = m.away.shortName;

  if (m.status === "live") {
    return `🔴 ${lg}  ${h} ${m.home.score} – ${m.away.score} ${a}  ${m.minute ?? ""}`;
  }
  if (m.status === "halftime") {
    return `⏸ ${lg}  ${h} ${m.home.score} – ${m.away.score} ${a}  DESCANSO`;
  }
  if (m.status === "finished") {
    return `✔ ${lg}  ${h} ${m.home.score} – ${m.away.score} ${a}`;
  }
  if (m.status === "scheduled" && m.startTime) {
    return `🗓 ${lg}  ${h} vs ${a}  ${fmtTime(m.startTime)}`;
  }
  return "";
}

export default function TickerBar() {
  const [text,      setText]      = useState("");
  const [liveCount, setLiveCount] = useState(0);

  const load = useCallback(async () => {
    const [newsRes, scoresRes] = await Promise.allSettled([
      fetch("/api/news").then((r) => r.json() as Promise<NewsItem[]>),
      fetch("/api/scores").then((r) => r.json() as Promise<LiveMatch[]>),
    ]);

    const news: NewsItem[]    = newsRes.status    === "fulfilled" ? newsRes.value    : [];
    const scores: LiveMatch[] = scoresRes.status  === "fulfilled" ? scoresRes.value  : [];

    const live      = scores.filter((m) => m.status === "live" || m.status === "halftime");
    const finished  = scores.filter((m) => m.status === "finished").slice(0, 8);
    const scheduled = scores.filter((m) => m.status === "scheduled").slice(0, 6);

    setLiveCount(live.length);

    const matchParts = [...live, ...finished, ...scheduled]
      .map(matchSegment)
      .filter(Boolean);

    const newsParts = news
      .slice(0, 12)
      .map((n) => `${n.source.toUpperCase()}: ${n.title}`);

    const joined = [...matchParts, ...newsParts].join("     •     ");
    if (joined) setText(joined);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 3 * 60 * 1000); // refresh every 3 min
    return () => clearInterval(id);
  }, [load]);

  if (!text) return null;

  return (
    <div className="bg-gold-500 text-black text-xs font-semibold overflow-hidden h-8 flex items-center select-none">
      {/* Badge */}
      <span className="shrink-0 bg-black text-gold-400 px-3 h-full flex items-center gap-1.5 uppercase tracking-widest text-[10px]">
        {liveCount > 0 && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        )}
        {liveCount > 0 ? `${liveCount} EN VIVO` : "HOY"}
      </span>

      {/* Scrolling text */}
      <div className="flex-1 overflow-hidden">
        <div
          className="whitespace-nowrap animate-ticker inline-block"
          style={{ animationDuration: `${Math.max(60, text.length * 0.14)}s` }}
        >
          {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </div>
      </div>
    </div>
  );
}
