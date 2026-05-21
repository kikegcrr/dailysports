import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelName: string;
  handle: string;
  channelAvatar: string;
  channelUrl: string;
}

// Real Spanish sports YouTube channels — channel IDs hardcoded (YouTube blocks server-side handle resolution)
const CHANNELS = [
  { name: "El Chiringuito de Jugones", handle: "ElChiringuitodejugones", channelId: "UCS6Y-E3Rwm3XXOfSi4RDnBQ" },
  { name: "Jijantes FC", handle: "JijantesFC", channelId: "UCtgiiOrbTuwtfACP5WzmBFQ" },
  { name: "Relevo", handle: "Relevo", channelId: "UCNRFDryuKxLhXovIgKYEMtg" },
  { name: "NBA España", handle: "NBAEspana", channelId: "UCHihzd9rUb-15vnIPpJ0AFA" },
  { name: "Basket Total", handle: "BasketTotal", channelId: "UCr63M3vCWZafmrqZT1tBCaQ" },
  { name: "LaLiga", handle: "LaLiga", channelId: "UCTv-XvfzLX3i4IGWAm4sbmA" },
  { name: "Marca TV", handle: "MarcaTV", channelId: "UCop57Z1sYHrtCyxCpE2z2Bg" },
  { name: "El Larguero SER", handle: "ElLarguero", channelId: "UC2BfAWhbAsmPnXHpWYKR7aQ" },
  { name: "Real Madrid TV", handle: "realmadridtv", channelId: "UCWV3obpZVGgJ3j9FVhEjF2Q" },
  { name: "FC Barcelona", handle: "FCBarcelona_es", channelId: "UCVCvLBHeevBjy59WMsb0QdQ" },
];

// Regex-based XML parser (avoids rss-parser ESM issues in edge)
function parseRSSXML(xml: string): { videoId: string; title: string; published: string }[] {
  const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];
  return entries.slice(0, 2).map((entry) => {
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
    const rawTitle = entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
    const title = rawTitle.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
    return { videoId, title, published };
  });
}

async function getChannelVideos(name: string, handle: string, channelId: string): Promise<YouTubeVideo[]> {
  try {
    const rss = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (!rss.ok) return [];

    const xml = await rss.text();
    const entries = parseRSSXML(xml);

    return entries
      .filter((e) => e.videoId)
      .map((e) => ({
        videoId: e.videoId,
        title: e.title,
        thumbnail: `https://img.youtube.com/vi/${e.videoId}/mqdefault.jpg`,
        publishedAt: e.published,
        channelName: name,
        handle,
        channelAvatar: `https://unavatar.io/youtube/@${handle}`,
        channelUrl: `https://youtube.com/@${handle}`,
      }));
  } catch {
    return [];
  }
}

export async function GET() {
  const results = await Promise.allSettled(
    CHANNELS.map((ch) => getChannelVideos(ch.name, ch.handle, ch.channelId))
  );

  const videos = results
    .filter((r): r is PromiseFulfilledResult<YouTubeVideo[]> => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .filter((v) => v.videoId);

  return NextResponse.json(videos, {
    headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=300" },
  });
}
