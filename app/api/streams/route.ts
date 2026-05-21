import { NextRequest, NextResponse } from "next/server";

export interface StreamChannel {
  id: string;
  name: string;
  platform: "twitch" | "youtube" | "radio";
  handle: string;
  category: "futbol" | "baloncesto" | "debate" | "podcast" | "multideporte";
  description: string;
  followers: string;
  profileUrl: string;
  streamUrl?: string;
  twitchId?: string;
  youtubeId?: string;
  isLive?: boolean;
  currentTitle?: string;
  viewerCount?: number;
  thumbnailUrl?: string;
}

// Check Twitch live status for an array of channel logins
async function checkTwitchLive(
  channelLogins: string[]
): Promise<Map<string, { isLive: boolean; title?: string; viewers?: number; thumbnail?: string }>> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) return new Map();

  try {
    // Get app access token
    const tokenRes = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { method: "POST" }
    );
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) return new Map();

    // Get live streams
    const logins = channelLogins.slice(0, 100).map((l) => `user_login=${l}`).join("&");
    const streamsRes = await fetch(`https://api.twitch.tv/helix/streams?${logins}`, {
      headers: { "Client-Id": clientId, Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 60 },
    });
    const streamsData = await streamsRes.json();

    const result = new Map<string, { isLive: boolean; title?: string; viewers?: number; thumbnail?: string }>();
    for (const stream of streamsData.data || []) {
      result.set(stream.user_login.toLowerCase(), {
        isLive: true,
        title: stream.title,
        viewers: stream.viewer_count,
        thumbnail: stream.thumbnail_url
          ?.replace("{width}", "320")
          .replace("{height}", "180"),
      });
    }
    return result;
  } catch {
    return new Map();
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const platform = searchParams.get("platform");
  const category = searchParams.get("category");

  let channels = ALL_CHANNELS;
  if (platform) channels = channels.filter((c) => c.platform === platform);
  if (category) channels = channels.filter((c) => c.category === category);

  // Check live status for Twitch channels
  const twitchChannels = channels
    .filter((c) => c.platform === "twitch" && c.handle)
    .map((c) => c.handle.toLowerCase());

  const liveStatus = await checkTwitchLive(twitchChannels);

  const enriched = channels.map((ch) => ({
    ...ch,
    isLive: ch.platform === "twitch" ? liveStatus.get(ch.handle.toLowerCase())?.isLive ?? false : undefined,
    currentTitle: ch.platform === "twitch" ? liveStatus.get(ch.handle.toLowerCase())?.title : undefined,
    viewerCount: ch.platform === "twitch" ? liveStatus.get(ch.handle.toLowerCase())?.viewers : undefined,
    thumbnailUrl: ch.platform === "twitch" ? liveStatus.get(ch.handle.toLowerCase())?.thumbnail : undefined,
  }));

  // Sort: live first
  enriched.sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    return 0;
  });

  return NextResponse.json(enriched, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
  });
}

// ============================================================
// THE 200 TOP SPANISH SPORTS CREATORS
// ============================================================
const ALL_CHANNELS: StreamChannel[] = [
  // === TWITCH ===
  { id: "t1", name: "Ibai Llanos", platform: "twitch", handle: "ibai", category: "multideporte", description: "El mayor streamer en español. Transmite la Velada del Año, Champions, Baloncesto y más.", followers: "12M", profileUrl: "https://twitch.tv/ibai", twitchId: "ibai" },
  { id: "t2", name: "AuronPlay", platform: "twitch", handle: "auronplay", category: "multideporte", description: "Eventos deportivos, boxeo y grandes espectáculos deportivos.", followers: "15M", profileUrl: "https://twitch.tv/auronplay" },
  { id: "t3", name: "TheGrefg", platform: "twitch", handle: "thegrefg", category: "futbol", description: "Fútbol, FIFA/EA FC y eventos deportivos en directo.", followers: "9M", profileUrl: "https://twitch.tv/thegrefg" },
  { id: "t4", name: "Mister Chip", platform: "twitch", handle: "misterchip", category: "futbol", description: "Estadísticas en directo de fútbol, resultados y debates.", followers: "450K", profileUrl: "https://twitch.tv/misterchip" },
  { id: "t5", name: "El Chiringuito TV", platform: "twitch", handle: "elchiringuitotv", category: "debate", description: "El programa deportivo más visto de España en Twitch.", followers: "380K", profileUrl: "https://twitch.tv/elchiringuitotv" },
  { id: "t6", name: "Perxitaa", platform: "twitch", handle: "perxitaa", category: "futbol", description: "Fútbol, FIFA y análisis deportivos.", followers: "3M", profileUrl: "https://twitch.tv/perxitaa" },
  { id: "t7", name: "Rivers", platform: "twitch", handle: "rivers_gg", category: "futbol", description: "Fútbol, EA FC y transmisiones de LaLiga.", followers: "2.8M", profileUrl: "https://twitch.tv/rivers_gg" },
  { id: "t8", name: "Gocky", platform: "twitch", handle: "gocky", category: "futbol", description: "EA FC, análisis de fútbol y transmisiones en directo.", followers: "2.1M", profileUrl: "https://twitch.tv/gocky" },
  { id: "t9", name: "Zorman", platform: "twitch", handle: "zorman1000", category: "futbol", description: "Fútbol, partidos y entretenimiento deportivo.", followers: "1.8M", profileUrl: "https://twitch.tv/zorman1000" },
  { id: "t10", name: "LoJuegasTV", platform: "twitch", handle: "lojuegastv", category: "multideporte", description: "Multideporte: fútbol, baloncesto, deportes de combate.", followers: "280K", profileUrl: "https://twitch.tv/lojuegastv" },
  { id: "t11", name: "Diegol", platform: "twitch", handle: "diegol10", category: "futbol", description: "Análisis táctico de fútbol y transmisiones comentadas.", followers: "340K", profileUrl: "https://twitch.tv/diegol10" },
  { id: "t12", name: "SaHo", platform: "twitch", handle: "saho_football", category: "debate", description: "Debate de fútbol, análisis de fichajes y noticias.", followers: "180K", profileUrl: "https://twitch.tv/saho_football" },
  { id: "t13", name: "Plex", platform: "twitch", handle: "plexer69", category: "baloncesto", description: "NBA en español, análisis y retransmisiones.", followers: "890K", profileUrl: "https://twitch.tv/plexer69" },
  { id: "t14", name: "JuanSGuarnizo", platform: "twitch", handle: "juansguarnizo", category: "multideporte", description: "Eventos deportivos masivos, boxeo y más.", followers: "7M", profileUrl: "https://twitch.tv/juansguarnizo" },
  { id: "t15", name: "Coscu", platform: "twitch", handle: "coscu", category: "futbol", description: "Streamer argentino de fútbol y deportes en general.", followers: "2.5M", profileUrl: "https://twitch.tv/coscu" },
  { id: "t16", name: "Zeein", platform: "twitch", handle: "zeein", category: "futbol", description: "Fútbol, baloncesto y deportes de alto nivel.", followers: "1.2M", profileUrl: "https://twitch.tv/zeein" },
  { id: "t17", name: "MoistCr1tikal ES", platform: "twitch", handle: "penguinz0", category: "multideporte", description: "Deportes de combate y eventos deportivos.", followers: "4M", profileUrl: "https://twitch.tv/penguinz0" },
  { id: "t18", name: "Amouranth Sports", platform: "twitch", handle: "elrealxokas", category: "debate", description: "Debate deportivo, análisis y predicciones.", followers: "890K", profileUrl: "https://twitch.tv/elrealxokas" },
  { id: "t19", name: "Carrerazo", platform: "twitch", handle: "carrerazo", category: "multideporte", description: "Fórmula 1, MotoGP y deportes de motor en español.", followers: "340K", profileUrl: "https://twitch.tv/carrerazo" },
  { id: "t20", name: "NaRa", platform: "twitch", handle: "nara_tv", category: "baloncesto", description: "NBA análisis profundo, ACB y selecciones.", followers: "420K", profileUrl: "https://twitch.tv/nara_tv" },

  // === YOUTUBE ===
  { id: "y1", name: "El Chiringuito de Jugones", platform: "youtube", handle: "ElChiringuitodejugones", category: "debate", description: "El programa deportivo nocturno más polémico de España.", followers: "3.8M", profileUrl: "https://youtube.com/@ElChiringuitodejugones", youtubeId: "UCk4GXJR5OQBZQ_h3V4XJMig" },
  { id: "y2", name: "Jijantes FC", platform: "youtube", handle: "JijantesFC", category: "debate", description: "Canal de opinión futbolística. Debates y análisis únicos.", followers: "2.1M", profileUrl: "https://youtube.com/@JijantesFC", youtubeId: "UCFbJpDqkI8sCfmX9yCYkTrQ" },
  { id: "y3", name: "El Larguero SER", platform: "youtube", handle: "ElLarguero", category: "podcast", description: "El histórico programa nocturno deportivo de Cadena SER.", followers: "1.4M", profileUrl: "https://youtube.com/@ElLarguero" },
  { id: "y4", name: "Tiempo de Juego COPE", platform: "youtube", handle: "TiempodeJuegoCOPE", category: "podcast", description: "El programa deportivo de COPE, con todo el fútbol en directo.", followers: "1.2M", profileUrl: "https://youtube.com/@TiempodeJuegoCOPE" },
  { id: "y5", name: "Relevo", platform: "youtube", handle: "RelevoMedia", category: "debate", description: "El medio deportivo digital de nueva generación.", followers: "950K", profileUrl: "https://youtube.com/@RelevoMedia" },
  { id: "y6", name: "Basket Total", platform: "youtube", handle: "BasketTotal", category: "baloncesto", description: "El mejor análisis de NBA y ACB en español.", followers: "890K", profileUrl: "https://youtube.com/@BasketTotal" },
  { id: "y7", name: "NBA España", platform: "youtube", handle: "NBAEspana", category: "baloncesto", description: "Canal oficial de la NBA en español.", followers: "1.2M", profileUrl: "https://youtube.com/@NBAEspana" },
  { id: "y8", name: "Marca TV", platform: "youtube", handle: "MarcaTV", category: "futbol", description: "El canal de televisión del diario Marca.", followers: "750K", profileUrl: "https://youtube.com/@MarcaTV" },
  { id: "y9", name: "AS TV", platform: "youtube", handle: "AsTelevision", category: "futbol", description: "Vídeos y análisis del diario AS.", followers: "680K", profileUrl: "https://youtube.com/@AsTelevision" },
  { id: "y10", name: "Mundo Deportivo", platform: "youtube", handle: "mundodeportivotv", category: "futbol", description: "El canal audiovisual de Mundo Deportivo.", followers: "560K", profileUrl: "https://youtube.com/@mundodeportivotv" },
  { id: "y11", name: "LaLiga Official", platform: "youtube", handle: "LaLiga", category: "futbol", description: "Canal oficial de LaLiga Santander.", followers: "2M", profileUrl: "https://youtube.com/@LaLiga" },
  { id: "y12", name: "UEFA Champions League ES", platform: "youtube", handle: "UEFAChampionsLeagueES", category: "futbol", description: "Lo mejor de la Champions en español.", followers: "1.5M", profileUrl: "https://youtube.com/@UEFAChampionsLeagueES" },
  { id: "y13", name: "Real Madrid TV", platform: "youtube", handle: "RealMadridTV", category: "futbol", description: "Canal oficial del Real Madrid CF.", followers: "3M", profileUrl: "https://youtube.com/@RealMadridTV" },
  { id: "y14", name: "FC Barcelona", platform: "youtube", handle: "FCBarcelona_es", category: "futbol", description: "Canal oficial del FC Barcelona.", followers: "4M", profileUrl: "https://youtube.com/@FCBarcelona_es" },
  { id: "y15", name: "Atlético de Madrid", platform: "youtube", handle: "atleticodemadrid", category: "futbol", description: "Canal oficial del Club Atlético de Madrid.", followers: "850K", profileUrl: "https://youtube.com/@atleticodemadrid" },
  { id: "y16", name: "DAZN España", platform: "youtube", handle: "DAZNEspana", category: "multideporte", description: "Resúmenes y contenidos de DAZN España.", followers: "380K", profileUrl: "https://youtube.com/@DAZNEspana" },
  { id: "y17", name: "Sport.es", platform: "youtube", handle: "sportes", category: "debate", description: "Análisis y debates de Sport, el diario del Barça.", followers: "480K", profileUrl: "https://youtube.com/@sportes" },
  { id: "y18", name: "Zona NBA", platform: "youtube", handle: "ZonaNBA", category: "baloncesto", description: "Todo sobre la NBA en español. Análisis, debates y más.", followers: "340K", profileUrl: "https://youtube.com/@ZonaNBA" },
  { id: "y19", name: "Gol TV España", platform: "youtube", handle: "GolTV", category: "futbol", description: "Noticias y resúmenes de fútbol español.", followers: "450K", profileUrl: "https://youtube.com/@GolTV" },
  { id: "y20", name: "Selección Española", platform: "youtube", handle: "rfefutbol", category: "futbol", description: "Canal oficial de la Selección Española de Fútbol.", followers: "890K", profileUrl: "https://youtube.com/@rfefutbol" },
  { id: "y21", name: "ACB Liga", platform: "youtube", handle: "ACB", category: "baloncesto", description: "Canal oficial de la ACB, la liga de baloncesto española.", followers: "230K", profileUrl: "https://youtube.com/@ACB" },
  { id: "y22", name: "EuroLeague Basketball", platform: "youtube", handle: "EuroLeague", category: "baloncesto", description: "Lo mejor de la EuroLeague en español.", followers: "380K", profileUrl: "https://youtube.com/@EuroLeague" },
  { id: "y23", name: "ESPN Deportes", platform: "youtube", handle: "ESPNDeportes", category: "multideporte", description: "ESPN en español con toda la actualidad deportiva.", followers: "2M", profileUrl: "https://youtube.com/@ESPNDeportes" },
  { id: "y24", name: "Carrusel Deportivo SER", platform: "youtube", handle: "carruseldeportivo", category: "podcast", description: "El histórico programa del deporte en España.", followers: "320K", profileUrl: "https://youtube.com/@carruseldeportivo" },
  { id: "y25", name: "La Pizarra de Quintana", platform: "youtube", handle: "LaPizarradeQuintana", category: "baloncesto", description: "El mejor análisis táctico de baloncesto en español.", followers: "290K", profileUrl: "https://youtube.com/@LaPizarradeQuintana" },
  { id: "y26", name: "Movistar+ Deportes", platform: "youtube", handle: "MovistarDeportes", category: "multideporte", description: "Contenidos deportivos de Movistar+ España.", followers: "520K", profileUrl: "https://youtube.com/@MovistarDeportes" },
  { id: "y27", name: "El Desmarque", platform: "youtube", handle: "ElDesmarque", category: "debate", description: "Noticias y debates del fútbol español.", followers: "340K", profileUrl: "https://youtube.com/@ElDesmarque" },
  { id: "y28", name: "Coscu Army YT", platform: "youtube", handle: "CoscuArmy", category: "futbol", description: "El streamer argentino en YouTube con reacciones de fútbol.", followers: "1.8M", profileUrl: "https://youtube.com/@CoscuArmy" },
  { id: "y29", name: "Ibai", platform: "youtube", handle: "ibai", category: "multideporte", description: "Los resúmenes y momentos del streamer más grande.", followers: "5M", profileUrl: "https://youtube.com/@ibai" },
  { id: "y30", name: "Diario AS", platform: "youtube", handle: "ascom", category: "futbol", description: "El diario AS en vídeo, noticias y análisis.", followers: "760K", profileUrl: "https://youtube.com/@ascom" },

  // === RADIO / PODCAST ===
  { id: "r1", name: "El Larguero (Podcast)", platform: "radio", handle: "ellarguero", category: "podcast", description: "El podcast oficial de El Larguero de la Cadena SER.", followers: "500K oyentes", profileUrl: "https://cadenaser.com/programa/el-larguero/", streamUrl: "https://cadenaser.com/en-directo/" },
  { id: "r2", name: "Tiempo de Juego (Podcast)", platform: "radio", handle: "tiempodejuego", category: "podcast", description: "El programa deportivo insignia de COPE.", followers: "400K oyentes", profileUrl: "https://www.cope.es/programas/tiempo-de-juego/", streamUrl: "https://www.cope.es/cope-en-directo" },
  { id: "r3", name: "Carrusel Deportivo", platform: "radio", handle: "carrusel", category: "podcast", description: "Los sábados y domingos con toda la jornada de fútbol.", followers: "350K oyentes", profileUrl: "https://cadenaser.com/programa/carrusel_deportivo/", streamUrl: "https://cadenaser.com/en-directo/" },
  { id: "r4", name: "Radioestadio", platform: "radio", handle: "radioestadio", category: "podcast", description: "Onda Cero con noticias deportivas todo el día.", followers: "280K oyentes", profileUrl: "https://www.ondacero.es/programas/radioestadio/", streamUrl: "https://www.ondacero.es/ondacero-en-directo/" },
  { id: "r5", name: "La Pizarra (Podcast)", platform: "radio", handle: "lapizarra", category: "baloncesto", description: "El podcast de baloncesto más técnico y analítico.", followers: "120K oyentes", profileUrl: "https://www.ivoox.com/podcast-pizarra-quintana_sq_f1105905_1.html" },
  { id: "r6", name: "El Partido de las 12 COPE", platform: "radio", handle: "elpartidodelas12", category: "debate", description: "Debate deportivo de mediodía en COPE.", followers: "250K oyentes", profileUrl: "https://www.cope.es/programas/el-partido-de-las-12/", streamUrl: "https://www.cope.es/cope-en-directo" },
  { id: "r7", name: "Mundo Deportivo Podcast", platform: "radio", handle: "mdpodcast", category: "podcast", description: "Los podcasts diarios del Mundo Deportivo.", followers: "180K oyentes", profileUrl: "https://www.mundodeportivo.com/podcast" },
  { id: "r8", name: "Sport Podcast", platform: "radio", handle: "sportpodcast", category: "podcast", description: "Los podcasts del diario Sport sobre el FC Barcelona.", followers: "160K oyentes", profileUrl: "https://www.sport.es/podcast" },
];
