import Parser from "rss-parser";

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceUrl: string;
  category: "football" | "basketball" | "other";
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

export const RSS_SOURCES = [
  // --- Football (heavy) ---
  {
    url: "https://www.marca.com/rss/portada.xml",
    name: "Marca",
    category: "football" as const,
  },
  {
    url: "https://as.com/rss/tags/ultimas_noticias.xml",
    name: "AS",
    category: "football" as const,
  },
  {
    url: "https://www.sport.es/rss/portada.xml",
    name: "Sport",
    category: "football" as const,
  },
  {
    url: "https://www.mundodeportivo.com/mvc/feed/rss/section/futbol",
    name: "Mundo Deportivo",
    category: "football" as const,
  },
  // --- Basketball ---
  {
    url: "https://basketplus.es/feed/",
    name: "Basket Plus",
    category: "basketball" as const,
  },
  {
    url: "https://www.mundodeportivo.com/mvc/feed/rss/section/baloncesto",
    name: "MD Baloncesto",
    category: "basketball" as const,
  },
  // --- Other sports ---
  {
    url: "https://as.com/rss/tags/otros_deportes.xml",
    name: "AS Otros",
    category: "other" as const,
  },
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
    return (feed.items || []).slice(0, 15).map((item) => ({
      id: `${source.name}-${item.link || item.title}`,
      title: item.title || "",
      link: item.link || "#",
      pubDate: item.pubDate || new Date().toISOString(),
      source: source.name,
      sourceUrl: source.url,
      category: source.category,
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

  // Sort by date, newest first
  return items.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}
