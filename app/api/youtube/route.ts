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

// Spanish sports YouTube channels — all channel IDs verified via RSS feed (HTTP 200)
const CHANNELS = [
  // ── Programas de debate y televisión ──
  { name: "El Chiringuito de Jugones", handle: "elchiringuitodejugones", channelId: "UCS6Y-E3Rwm3XXOfSi4RDnBQ" },
  { name: "Jijantes FC",              handle: "JijantesFC",              channelId: "UCtgiiOrbTuwtfACP5WzmBFQ" },
  { name: "Golazo",                   handle: "golazo",                  channelId: "UCPGZg8IuYvntTmHSxbPMCQA" },
  { name: "La Sexta Deportes",        handle: "lasextadeportes",         channelId: "UCbct55KpMUZV6ntoZJRfUuA" },
  { name: "RTVE Deportes",            handle: "rtvedeportes",            channelId: "UC4SBVYTpqOh-exr7BShLAPw" },
  { name: "DAZN Fútbol",              handle: "daznes",                  channelId: "UCz9FiMLz6SOgR_4VEFvjeIA" },
  { name: "DAZN ES",                  handle: "DAZNEspana",              channelId: "UCK-mxP4hLap1t3dp4bPbSBg" },

  // ── Radio deportiva ──
  { name: "El Larguero SER",          handle: "ElLarguero",              channelId: "UC2BfAWhbAsmPnXHpWYKR7aQ" },
  { name: "Carrusel Deportivo SER",   handle: "CarruselDeportivo",       channelId: "UCTapFcyNk2zzc7LnPUjNNQA" },
  { name: "Tiempo de Juego COPE",     handle: "TiempodeJuegoCOPE",       channelId: "UCMHb51gmuIuP8dVpsHr-uEw" },
  { name: "El Partidazo de COPE",     handle: "elpartidazodecope",       channelId: "UC3w4rq4MqM3hPcbBdnxd_2A" },

  // ── Medios deportivos digitales ──
  { name: "Diario AS",                handle: "diarioas",                channelId: "UCXISYK3xagaK5DHnhQ4X0hw" },
  { name: "MARCA",                    handle: "marca",                   channelId: "UCop57Z1sYHrtCyxCpE2z2Bg" },
  { name: "MARCA TV",                 handle: "marcatv",                 channelId: "UCq96XRqvh-69cvhnKBICZmQ" },
  { name: "Mundo Deportivo",          handle: "mundodeportivo",          channelId: "UCWSZJ4r3s5xk8zICXEveFpg" },
  { name: "SPORT",                    handle: "sport",                   channelId: "UC-KNOeH9Cz2Ch3HMujlaTow" },
  { name: "Relevo",                   handle: "relevo",                  channelId: "UCNRFDryuKxLhXovIgKYEMtg" },

  // ── Comentaristas y analistas ──
  { name: "Ramón Álvarez de Mon",     handle: "RamonAlvarezDeMon",       channelId: "UCrd8pmcZ0Za0ufAfxOrIzmQ" },

  // ── Motor ──
  { name: "Movistar F1",              handle: "movistarF1",              channelId: "UCh3uo31Iv0yEeLoHc4s6vEQ" },

  // ── Competiciones ──
  { name: "LaLiga EA Sports",         handle: "LaLiga",                  channelId: "UCTv-XvfzLX3i4IGWAm4sbmA" },

  // ── Clubes de fútbol ──
  { name: "Real Madrid",              handle: "realmadrid",              channelId: "UCWV3obpZVGgJ3j9FVhEjF2Q" },
  { name: "FC Barcelona",             handle: "FCBarcelona_es",          channelId: "UC14UlmYlSNiQCBe9Eookf_A" },
  { name: "Atlético de Madrid",       handle: "atleticodemadrid",        channelId: "UCuzKFwdh7z2GHcIOX_tXgxA" },
  { name: "Sevilla FC",               handle: "sevillafc",               channelId: "UCLy9lmj_0cqffXUzbGHNmYA" },
  { name: "Valencia CF",              handle: "valenciacf",              channelId: "UCgvyo5x49J8ht5H9imKfxMQ" },
  { name: "Athletic Club",            handle: "athleticclub",            channelId: "UCUiLE_NqFKarAXFhhmXiIFA" },
  { name: "Real Betis",               handle: "realbetis",               channelId: "UCeB7JZwcar2fVoK2w2f9OwA" },
  { name: "Villarreal CF",            handle: "villarrealcf",            channelId: "UC0MLWyQ0L7uEZY8wbkDSTkw" },
  { name: "Real Sociedad",            handle: "realsociedad",            channelId: "UCfeqewEKWQ8CXY8OiXoMxxw" },
  { name: "CA Osasuna",               handle: "caosasuna",               channelId: "UC2JTagDPIChbcEeiLjypuYA" },
  { name: "Girona FC",                handle: "gironafc",                channelId: "UC6x5gKUZpXuKDujmaHc3Xhg" },

  // ── Baloncesto ──
  { name: "Real Madrid Baloncesto",   handle: "realmadridbasket",        channelId: "UC9V4YMznqy74Ve2cW0KCg6w" },
  { name: "ACB Liga Endesa",          handle: "acbcom",                  channelId: "UCjZh7FzztNo3up7mD75DAiQ" },
  { name: "EuroLeague Basketball",    handle: "euroleague",              channelId: "UCGr3nR_XH9r6E5b09ZJAT9w" },
  { name: "Baloncesto España",        handle: "baloncestoespana",        channelId: "UCINAmYQ9p4KpiVbq-F4hGrw" },
  { name: "Gigantes del Basket",      handle: "gigantesdelbasket",       channelId: "UCXJnFRcssT0Q1ID_V6Or1sQ" },
  { name: "Basket Total",             handle: "BasketTotal",             channelId: "UCr63M3vCWZafmrqZT1tBCaQ" },
  { name: "NBA España",               handle: "NBAEspana",               channelId: "UCX7W4is1AzHZGiD9eRxB9Gw" },
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
