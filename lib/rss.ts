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
export const RSS_SOURCES = [
  // === SPANISH SPORTS MEDIA (priority 1-2) ===
  { url: "https://www.marca.com/rss/portada.xml",           name: "Marca",          category: "football"   as const, region: "es"     as const, priority: 1 },
  { url: "https://as.com/rss/tags/ultimas_noticias.xml",    name: "AS",             category: "football"   as const, region: "es"     as const, priority: 1 },
  { url: "https://www.mundodeportivo.com/rss/portada.xml",  name: "Mundo Deportivo",category: "football"   as const, region: "es"     as const, priority: 2 },
  { url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/deportes/portada",
                                                             name: "El País Deportes",category:"other"      as const, region: "es"     as const, priority: 2 },
  { url: "https://www.abc.es/rss/feeds/abc_Deportes.xml",   name: "ABC Deportes",   category: "other"      as const, region: "es"     as const, priority: 2 },
  { url: "https://www.cope.es/rss/deportes.xml",            name: "COPE Deportes",  category: "football"   as const, region: "es"     as const, priority: 2 },
  { url: "https://www.marca.com/rss/baloncesto.xml",        name: "Marca Basket",   category: "basketball" as const, region: "es"     as const, priority: 2 },

  // === GLOBAL TOP SPORTS MEDIA (priority 1-2) ===
  { url: "https://feeds.bbci.co.uk/sport/rss.xml",          name: "BBC Sport",      category: "other"      as const, region: "global" as const, priority: 1 },
  { url: "https://www.espn.com/espn/rss/news",              name: "ESPN",           category: "other"      as const, region: "global" as const, priority: 1 },
  { url: "https://www.skysports.com/rss/12040",             name: "Sky Sports",     category: "football"   as const, region: "global" as const, priority: 1 },
  { url: "https://www.uefa.com/rssfeed/newslist/index.xml", name: "UEFA",           category: "football"   as const, region: "global" as const, priority: 2 },
  { url: "https://www.fourfourtwo.com/rss",                 name: "FourFourTwo",    category: "football"   as const, region: "global" as const, priority: 2 },

  // === LATIN AMERICA ===
  { url: "https://www.clarin.com/rss/deportes/",            name: "Clarín Deportes",category: "football"   as const, region: "global" as const, priority: 3 },

  // === BASKETBALL ===
  { url: "https://basketplus.es/feed/",                     name: "Basket Plus",    category: "basketball" as const, region: "es"     as const, priority: 3 },
  { url: "https://as.com/rss/tags/otros_deportes.xml",      name: "AS Motor/Otros", category: "other"      as const, region: "es"     as const, priority: 3 },
];

function extractImage(item: CustomItem): string | undefined {
  return (
    item["media:content"]?.["$"]?.url ||
    item["media:thumbnail"]?.["$"]?.url ||
    item.enclosure?.url
  );
}

export async function fetchNewsFromSource(source: (typeof RSS_SOURCES)[0]): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).slice(0, 12).map((item) => ({
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

export async function fetchAllNews(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    RSS_SOURCES.map(fetchNewsFromSource)
  );
  const items = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const now = Date.now();
  // Score = recency (0-100) + influence (priority weight)
  // Items published in last 2h score highest; older items decay
  return items.sort((a, b) => {
    const ageA = (now - new Date(a.pubDate).getTime()) / 1000 / 60; // minutes
    const ageB = (now - new Date(b.pubDate).getTime()) / 1000 / 60;
    const scoreA = Math.max(0, 120 - ageA) + (5 - a.priority) * 8;
    const scoreB = Math.max(0, 120 - ageB) + (5 - b.priority) * 8;
    return scoreB - scoreA;
  });
}
