import Parser from "rss-parser";

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceUrl: string;
  category: "football" | "basketball" | "other";
  region: "es" | "global";
  priority: number;
  imageUrl?: string;
  summary?: string;
  translated?: boolean;
};

type CustomItem = {
  "media:content"?: { $?: { url?: string } };
  "media:thumbnail"?: { $?: { url?: string } };
  enclosure?: { url?: string };
  content?: string;
  contentSnippet?: string;
};

const parser = new Parser<Record<string, unknown>, CustomItem>({
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
    ],
  },
});

// priority 1=highest influence, 5=lowest. Sources interleaved in feed by recency then priority.
// maxItems overrides the default 15 cap per source (use to limit high-volume English feeds).
export const RSS_SOURCES: {
  url: string; name: string;
  category: "football" | "basketball" | "other";
  region: "es" | "global";
  priority: number;
  maxItems?: number;
}[] = [
  // ══════════════════════════════════════════════════════════
  // PRENSA DEPORTIVA ESPAÑOLA — TOP 25 FUENTES
  // ══════════════════════════════════════════════════════════

  // — Prioridad 1: cabeceras de referencia —
  { url: "https://www.marca.com/rss/portada.xml",           name: "Marca",              category: "football"   as const, region: "es" as const, priority: 1 },
  { url: "https://www.mundodeportivo.com/rss/portada.xml",  name: "Mundo Deportivo",    category: "football"   as const, region: "es" as const, priority: 1 },
  { url: "https://www.abc.es/rss/feeds/abc_Deportes.xml",   name: "ABC Deportes",       category: "other"      as const, region: "es" as const, priority: 1 },
  { url: "https://www.cope.es/rss/deportes.xml",            name: "COPE Deportes",      category: "football"   as const, region: "es" as const, priority: 1 },
  { url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/deportes/portada", name: "El País Deportes", category: "other" as const, region: "es" as const, priority: 1 },

  // — Prioridad 2: diarios nacionales y digitales influyentes —
  { url: "https://okdiario.com/deportes/feed",              name: "OK Diario Deportes", category: "football"   as const, region: "es" as const, priority: 2 },
  { url: "https://www.elmundo.es/rss/deportes.xml",         name: "El Mundo Deportes",  category: "other"      as const, region: "es" as const, priority: 2 },
  { url: "https://www.lavanguardia.com/rss/deportes.xml",   name: "La Vanguardia Dep",  category: "other"      as const, region: "es" as const, priority: 2 },
  { url: "https://www.20minutos.es/rss/deportes/",          name: "20 Minutos Deportes",category: "other"      as const, region: "es" as const, priority: 2 },
  { url: "https://www.efe.com/efe/espana/deportes/rss/",    name: "EFE Deportes",       category: "other"      as const, region: "es" as const, priority: 2 },
  { url: "https://www.larazon.es/rss/deportes.xml",         name: "La Razón Deportes",  category: "football"   as const, region: "es" as const, priority: 2 },
  { url: "https://www.eldesmarque.com/rss.xml",             name: "El Desmarque",       category: "football"   as const, region: "es" as const, priority: 2 },

  // — Prioridad 3: medios digitales y deportivos especializados —
  { url: "https://www.superdeporte.es/rss",                 name: "Superdeporte",       category: "football"   as const, region: "es" as const, priority: 3 },
  { url: "https://diariogol.com/feed",                      name: "Diario Gol",         category: "football"   as const, region: "es" as const, priority: 3 },

  // ══════════════════════════════════════════════════════════
  // NOTICIAS POR EQUIPOS (Marca y MD — feeds activos)
  // ══════════════════════════════════════════════════════════
  { url: "https://www.marca.com/rss/futbol/primera-division/real-madrid.xml", name: "Marca Real Madrid", category: "football" as const, region: "es" as const, priority: 2 },
  { url: "https://www.mundodeportivo.com/rss/futbol/real-madrid.xml",         name: "MD Real Madrid",    category: "football" as const, region: "es" as const, priority: 3 },
  { url: "https://www.marca.com/rss/futbol/primera-division/fc-barcelona.xml",name: "Marca Barça",       category: "football" as const, region: "es" as const, priority: 2 },
  { url: "https://www.mundodeportivo.com/rss/futbol/fc-barcelona.xml",        name: "MD Barça",          category: "football" as const, region: "es" as const, priority: 2 },

  // ══════════════════════════════════════════════════════════
  // GLOBAL FÚTBOL — complementan sin tapar la prensa española
  // ══════════════════════════════════════════════════════════
  { url: "https://www.goal.com/feeds/en/news",              name: "Goal.com",            category: "football"  as const, region: "global" as const, priority: 3 },
  { url: "https://www.theguardian.com/football/rss",        name: "The Guardian Fútbol", category: "football"  as const, region: "global" as const, priority: 3 },
  { url: "https://www.uefa.com/rssfeed/newslist/index.xml", name: "UEFA",                category: "football"  as const, region: "global" as const, priority: 2 },
  { url: "https://www.transfermarkt.com/news/rss",          name: "Transfermarkt",       category: "football"  as const, region: "global" as const, priority: 3 },
  { url: "https://theathletic.com/rss/",                    name: "The Athletic",        category: "football"  as const, region: "global" as const, priority: 4 },
  { url: "https://www.90min.com/posts.rss",                 name: "90min",               category: "football"  as const, region: "global" as const, priority: 4 },
  { url: "https://www.skysports.com/rss/12040",             name: "Sky Sports",          category: "football"  as const, region: "global" as const, priority: 4 },

  // — Inglés generalista: muy limitado para no eclipsar la prensa española —
  { url: "https://feeds.bbci.co.uk/sport/rss.xml",          name: "BBC Sport",           category: "other"     as const, region: "global" as const, priority: 4, maxItems: 5 },
  { url: "https://www.espn.com/espn/rss/news",              name: "ESPN",                category: "other"     as const, region: "global" as const, priority: 5, maxItems: 4 },

  // ══════════════════════════════════════════════════════════
  // LATINOAMÉRICA
  // ══════════════════════════════════════════════════════════
  { url: "https://www.clarin.com/rss/deportes/",            name: "Clarín Deportes",    category: "football"   as const, region: "global" as const, priority: 3 },
  { url: "https://www.ole.com.ar/rss/feed.xml",             name: "Olé Argentina",      category: "football"   as const, region: "global" as const, priority: 3 },
  { url: "https://www.infobae.com/deportes/feeds/rss/",     name: "Infobae Deportes",   category: "other"      as const, region: "global" as const, priority: 3 },
  { url: "https://www.tycsports.com/rss.xml",               name: "TyC Sports",         category: "other"      as const, region: "global" as const, priority: 4 },
  { url: "https://www.mediotiempo.com/feed",                 name: "Medio Tiempo MX",    category: "football"   as const, region: "global" as const, priority: 4 },
  { url: "https://www.record.com.mx/feed",                  name: "Record México",      category: "football"   as const, region: "global" as const, priority: 4 },
  { url: "https://www.espn.com.ar/rss/news",                name: "ESPN Argentina",     category: "other"      as const, region: "global" as const, priority: 4, maxItems: 4 },

  // ══════════════════════════════════════════════════════════
  // BALONCESTO
  // ══════════════════════════════════════════════════════════
  { url: "https://www.marca.com/rss/baloncesto.xml",        name: "Marca Basket",       category: "basketball" as const, region: "es"     as const, priority: 2 },
  { url: "https://basketplus.es/feed/",                     name: "Basket Plus",        category: "basketball" as const, region: "es"     as const, priority: 3 },
  { url: "https://www.acb.com/noticias/rss",                name: "ACB",                category: "basketball" as const, region: "es"     as const, priority: 2 },
  { url: "https://zona-nba.es/feed",                        name: "Zona NBA",           category: "basketball" as const, region: "es"     as const, priority: 3 },
  { url: "https://www.nba.com/rss/nba_rss.xml",             name: "NBA.com",            category: "basketball" as const, region: "global" as const, priority: 3, maxItems: 5 },
  { url: "https://www.euroleaguebasketball.net/euroleague/news/latest/rss/", name: "EuroLeague", category: "basketball" as const, region: "global" as const, priority: 3 },

  // ══════════════════════════════════════════════════════════
  // MOTOR / F1 / MOTOGP
  // ══════════════════════════════════════════════════════════
  { url: "https://es.motorsport.com/rss/news/",             name: "Motorsport.com ES",  category: "other"      as const, region: "es"     as const, priority: 3 },
  { url: "https://www.marca.com/rss/motor.xml",             name: "Marca Motor",        category: "other"      as const, region: "es"     as const, priority: 3 },
];

// ─────────────────────────────────────────────────────────────────────────────
// SITEMAP-BASED FETCHERS
// Some media (AS, Sport, Onda Cero) removed RSS support but expose Google News
// sitemaps with titles + dates. We fetch those instead.
// ─────────────────────────────────────────────────────────────────────────────

type SitemapSource = {
  name: string;
  sitemapUrl: string;
  category: "football" | "basketball" | "other";
  region: "es" | "global";
  priority: number;
  maxItems?: number;
  // Return true to keep this URL; omit to keep all
  filterUrl?: (url: string) => boolean;
};

const SITEMAP_SOURCES: SitemapSource[] = [
  {
    name: "AS",
    sitemapUrl: "https://as.com/sitemaps/news.xml",
    category: "football",
    region: "es",
    priority: 1,
    maxItems: 15,
    // AS is 100% sports — keep everything except ads/promo pages
    filterUrl: (u) => !u.includes("/publicidad/") && !u.includes("/pruebas/"),
  },
  {
    name: "Sport",
    sitemapUrl: "https://www.sport.es/es/sitemapNews.xml",
    category: "football",
    region: "es",
    priority: 1,
    maxItems: 15,
    // Keep articles, skip videos and cover-page meta items
    filterUrl: (u) => u.includes("/noticias/") && !u.includes("/portada-sport/"),
  },
  {
    name: "Onda Cero Deportes",
    sitemapUrl: "https://www.ondacero.es/sitemaps/news.xml",
    category: "other",
    region: "es",
    priority: 2,
    maxItems: 10,
    // Onda Cero is general radio — filter to sports sections
    filterUrl: (u) => /\/deportes\/|\/futbol\/|\/baloncesto\/|\/motor\//.test(u),
  },
];

// Googlebot UA is required by some outlets (AS) to get the sitemap
const GOOGLEBOT_UA = "Googlebot/2.1 (+http://www.google.com/bot.html)";

async function fetchFromSitemap(source: SitemapSource): Promise<NewsItem[]> {
  try {
    const r = await fetch(source.sitemapUrl, {
      signal: AbortSignal.timeout(9000),
      headers: { "User-Agent": GOOGLEBOT_UA, Accept: "application/xml, text/xml, */*" },
    });
    if (!r.ok) return [];
    const xml = await r.text();

    const entries = xml.match(/<url>([\s\S]*?)<\/url>/g) ?? [];
    const items: NewsItem[] = [];

    for (const entry of entries) {
      const loc = entry.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim() ?? "";
      if (!loc) continue;
      if (source.filterUrl && !source.filterUrl(loc)) continue;

      // Title: prefer <news:title>, fall back to slug-based title
      const rawTitle = (
        entry.match(/<news:title>([\s\S]*?)<\/news:title>/)?.[1] ??
        entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ??
        ""
      ).replace(/<!\[CDATA\[|\]\]>/g, "").trim();

      const title = rawTitle || (() => {
        const slug = loc.split("/").pop()?.replace(/-\d+\.shtml$|\.shtml$|\.\w+$/, "") ?? "";
        return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      })();

      if (!title || title.length < 6) continue;

      const pubDate =
        entry.match(/<news:publication_date>([^<]+)<\/news:publication_date>/)?.[1]?.trim() ??
        entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() ??
        new Date().toISOString();

      items.push({
        id: `${source.name}-${loc}`,
        title,
        link: loc,
        pubDate,
        source: source.name,
        sourceUrl: source.sitemapUrl,
        category: source.category,
        region: source.region,
        priority: source.priority,
      });

      if (items.length >= (source.maxItems ?? 15)) break;
    }

    return items;
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────

function extractImage(item: CustomItem): string | undefined {
  // 1. Structured media fields (most reliable)
  const media =
    item["media:content"]?.["$"]?.url ||
    item["media:thumbnail"]?.["$"]?.url ||
    item.enclosure?.url;
  if (media) return media;

  // 2. First <img> in the HTML content (fallback for feeds without media tags)
  const html = item.content ?? "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match?.[1]) {
    const url = match[1];
    // Skip tiny tracking pixels and data URIs
    if (!url.startsWith("data:") && !url.includes("pixel") && url.startsWith("http")) {
      return url;
    }
  }

  return undefined;
}

export async function fetchNewsFromSource(source: (typeof RSS_SOURCES)[0]): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const limit = source.maxItems ?? 15;
    return (feed.items || []).slice(0, limit).map((item) => ({
      id: `${source.name}-${item.link || item.title}`,
      title: item.title || "",
      link: item.link || "#",
      pubDate: item.pubDate || new Date().toISOString(),
      source: source.name,
      sourceUrl: source.url,
      category: source.category,
      region: source.region,
      priority: source.priority,
      imageUrl: extractImage(item as CustomItem),
      summary: item.contentSnippet?.slice(0, 200),
    }));
  } catch {
    return [];
  }
}

// Sources published in English that need auto-translation
const EN_SOURCES = new Set([
  "BBC Sport", "ESPN", "Sky Sports", "FourFourTwo", "The Guardian Fútbol",
  "90min", "Goal.com", "The Athletic", "NBA.com", "EuroLeague", "Transfermarkt",
  "ESPN Argentina",
]);

// Separator unlikely to appear in any sports headline
const SEP = " ⟪§⟫ ";

async function gtranslate(texts: string[]): Promise<string[]> {
  if (!texts.length) return [];
  const safe = texts.map((t) => t.replace(/⟪§⟫/g, " "));
  const joined = safe.join(SEP);
  try {
    const url =
      `https://translate.googleapis.com/translate_a/single` +
      `?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(joined)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(7000) });
    if (!res.ok) return texts;
    const data = await res.json();
    const translated = (data[0] as [string][]).map((p) => p[0]).join("");
    const parts = translated.split(SEP);
    return texts.map((orig, i) => parts[i]?.trim() || orig);
  } catch {
    return texts; // fall back to English on any error
  }
}

async function translateEnglishItems(items: NewsItem[]): Promise<void> {
  const targets = items.filter((i) => EN_SOURCES.has(i.source));
  if (!targets.length) return;

  // Split into chunks ≤1800 chars so the URL stays safe
  const chunks: NewsItem[][] = [];
  let chunk: NewsItem[] = [];
  let len = 0;
  for (const item of targets) {
    const itemLen = item.title.length + (item.summary?.length ?? 0) + SEP.length * 2;
    if (len + itemLen > 1800 && chunk.length) {
      chunks.push(chunk);
      chunk = [];
      len = 0;
    }
    chunk.push(item);
    len += itemLen;
  }
  if (chunk.length) chunks.push(chunk);

  await Promise.allSettled(
    chunks.map(async (ch) => {
      // Translate titles
      const translatedTitles = await gtranslate(ch.map((i) => i.title));
      translatedTitles.forEach((t, j) => {
        if (t) { ch[j].title = t; ch[j].translated = true; }
      });

      // Translate summaries where present
      const withSummary = ch.filter((i) => i.summary);
      if (withSummary.length) {
        const translatedSummaries = await gtranslate(withSummary.map((i) => i.summary!));
        translatedSummaries.forEach((s, j) => {
          if (s) withSummary[j].summary = s;
        });
      }
    })
  );
}

// Deduplicate: if two headlines share ≥4 content words, keep only the higher-priority one.
// Stopwords that don't count as content words.
const STOP = new Set([
  "el","la","los","las","un","una","unos","unas","de","del","al","en","y","o","a","que",
  "se","su","sus","con","por","para","es","son","ha","han","no","le","les","lo","más",
  "como","pero","si","ya","también","este","esta","estos","estas","ese","esa","muy",
  "the","a","an","of","in","and","or","to","is","are","has","have","for","on","at","by",
]);

function titleWords(title: string): Set<string> {
  return new Set(
    title.toLowerCase().split(/\W+/).filter((w) => w.length > 3 && !STOP.has(w))
  );
}

function areDuplicates(a: NewsItem, b: NewsItem): boolean {
  const wa = titleWords(a.title);
  const wb = titleWords(b.title);
  if (wa.size === 0 || wb.size === 0) return false;
  let shared = 0;
  for (const w of wa) if (wb.has(w)) shared++;
  // Duplicate if ≥4 shared words OR ≥60% overlap relative to the shorter title
  return shared >= 4 || shared / Math.min(wa.size, wb.size) >= 0.6;
}

function deduplicateNews(items: NewsItem[]): NewsItem[] {
  const kept: NewsItem[] = [];
  for (const item of items) {
    const isDup = kept.some((k) => areDuplicates(item, k));
    if (!isDup) kept.push(item);
  }
  return kept;
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  // Fetch RSS and sitemap sources in parallel
  const [rssResults, sitemapResults] = await Promise.all([
    Promise.allSettled(RSS_SOURCES.map(fetchNewsFromSource)),
    Promise.allSettled(SITEMAP_SOURCES.map(fetchFromSitemap)),
  ]);

  const items = [
    ...rssResults
      .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === "fulfilled")
      .flatMap((r) => r.value),
    ...sitemapResults
      .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === "fulfilled")
      .flatMap((r) => r.value),
  ];

  // Translate English articles to Spanish in-place
  await translateEnglishItems(items);

  const now = Date.now();
  // Score = recency + priority weight. Sort first so deduplication keeps the best source.
  const scored = items.sort((a, b) => {
    const ageA = (now - new Date(a.pubDate).getTime()) / 1000 / 60; // minutes
    const ageB = (now - new Date(b.pubDate).getTime()) / 1000 / 60;
    const scoreA = Math.max(0, 120 - ageA) + (5 - a.priority) * 8;
    const scoreB = Math.max(0, 120 - ageB) + (5 - b.priority) * 8;
    return scoreB - scoreA;
  });

  // Remove near-duplicate headlines (keep the one from the higher-ranked source)
  return deduplicateNews(scored);
}
