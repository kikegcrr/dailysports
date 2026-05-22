"use client";
import { useState } from "react";
import { Newspaper } from "lucide-react";
import { NewsItem } from "@/lib/rss";
import NewsCard from "./NewsCard";

// ── Newspaper source groups ───────────────────────────────────────────────────
// Key = display identifier, value = exact source name(s) in NewsItem.source
const NEWSPAPER_GROUPS: Record<string, string[]> = {
  "Marca":             ["Marca", "Marca Real Madrid", "Marca Barça", "Marca Basket", "Marca Motor"],
  "AS":                ["AS"],
  "Mundo Deportivo":   ["Mundo Deportivo", "MD Real Madrid", "MD Barça"],
  "Sport":             ["Sport"],
  "OK Diario Deportes":["OK Diario Deportes"],
  "El País Deportes":  ["El País Deportes"],
  "ABC Deportes":      ["ABC Deportes"],
  "COPE Deportes":     ["COPE Deportes"],
  "El Mundo Deportes": ["El Mundo Deportes"],
  "La Vanguardia Dep": ["La Vanguardia Dep"],
  "EFE Deportes":      ["EFE Deportes"],
  "Onda Cero Deportes":["Onda Cero Deportes"],
  "La Razón Deportes": ["La Razón Deportes"],
  "El Desmarque":      ["El Desmarque"],
  "Superdeporte":      ["Superdeporte"],
  "Diario Gol":        ["Diario Gol"],
};

const ALL_SPANISH_SOURCES = new Set(Object.values(NEWSPAPER_GROUPS).flat());

const PAPERS: { key: string; label: string }[] = [
  { key: "all",               label: "📰 Inicio"      },
  { key: "Marca",             label: "Marca"           },
  { key: "AS",                label: "AS"              },
  { key: "Mundo Deportivo",   label: "Mundo Dep."     },
  { key: "Sport",             label: "Sport"           },
  { key: "OK Diario Deportes",label: "OK Diario"       },
  { key: "El País Deportes",  label: "El País"         },
  { key: "ABC Deportes",      label: "ABC"             },
  { key: "COPE Deportes",     label: "COPE"            },
  { key: "El Mundo Deportes", label: "El Mundo"        },
  { key: "La Vanguardia Dep", label: "La Vanguardia"   },
  { key: "EFE Deportes",      label: "EFE"             },
  { key: "Onda Cero Deportes",label: "Onda Cero"       },
  { key: "La Razón Deportes", label: "La Razón"        },
  { key: "El Desmarque",      label: "El Desmarque"    },
  { key: "Superdeporte",      label: "Superdeporte"    },
  { key: "Diario Gol",        label: "Diario Gol"      },
];

// Human-readable short name (strips the " Deportes" / " Dep" suffix)
function shortName(key: string) {
  return key.replace(/ Deportes$/, "").replace(/ Dep$/, "");
}

interface Props {
  allItems: NewsItem[];
  lang: string;
  loading: boolean;
}

export default function NewspaperFeed({ allItems, lang, loading }: Props) {
  const [selected, setSelected] = useState("all");

  const sourceSet = selected === "all" ? null : new Set(NEWSPAPER_GROUPS[selected] ?? [selected]);

  const filtered = allItems.filter((i) =>
    selected === "all" ? ALL_SPANISH_SOURCES.has(i.source) : sourceSet!.has(i.source)
  );

  const featured = filtered.slice(0, 1);
  const grid     = filtered.slice(1, 7);
  const compact  = filtered.slice(7, 55);

  return (
    <div className="space-y-5">

      {/* ── Newspaper picker ────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {PAPERS.map((p) => (
          <button
            key={p.key}
            onClick={() => setSelected(p.key)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 border ${
              selected === p.key
                ? "bg-gold-500/20 text-gold-400 border-gold-500/40"
                : "bg-sport-card border-sport-border text-gray-400 hover:text-white hover:border-white/20"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Active newspaper label ──────────────────────────────────────── */}
      {selected !== "all" && (
        <div className="flex items-center gap-2 px-1">
          <Newspaper size={14} className="text-gold-400 shrink-0" />
          <span className="text-sm font-bold text-white">{shortName(selected)}</span>
          {!loading && (
            <span className="text-xs text-gray-500">· {filtered.length} artículos</span>
          )}
        </div>
      )}

      {/* ── Content ────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-sport-card border border-sport-border rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <span className="text-4xl block mb-3">📭</span>
          <p className="font-medium">Sin artículos disponibles</p>
          <p className="text-xs mt-1 text-gray-600">Prueba con otro periódico</p>
        </div>
      ) : (
        <>
          {/* Featured + sidebar */}
          {featured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <NewsCard item={featured[0]} lang={lang} featured />
              </div>
              <div className="space-y-4">
                {filtered.slice(1, 4).map((item) => (
                  <NewsCard key={item.id} item={item} lang={lang} compact />
                ))}
              </div>
            </div>
          )}

          {/* Main grid */}
          {grid.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grid.map((item) => (
                <NewsCard key={item.id} item={item} lang={lang} />
              ))}
            </div>
          )}

          {/* Compact list */}
          {compact.length > 0 && (
            <div className="bg-sport-card border border-sport-border rounded-2xl divide-y divide-sport-border">
              <div className="px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  {selected === "all" ? "Más artículos" : `Más de ${shortName(selected)}`}
                </h3>
              </div>
              {compact.map((item) => (
                <NewsCard key={item.id} item={item} lang={lang} compact />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
