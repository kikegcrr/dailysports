export const runtime = "edge";
export const dynamic = "force-dynamic";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

const LEAGUES: Record<string, { path: string; tennis?: boolean }> = {
  laliga:       { path: "soccer/esp.1" },
  champions:    { path: "soccer/uefa.champions" },
  premier:      { path: "soccer/eng.1" },
  seriea:       { path: "soccer/ita.1" },
  bundesliga:   { path: "soccer/ger.1" },
  ligue1:       { path: "soccer/fra.1" },
  ligaportugal: { path: "soccer/por.1" },
  europa:       { path: "soccer/uefa.europa" },
  libertadores: { path: "soccer/conmebol.libertadores" },
  nba:          { path: "basketball/nba" },
  atp:          { path: "tennis/atp", tennis: true },
  wta:          { path: "tennis/wta", tennis: true },
};

function parseStatus(name: string): string {
  const s = name.toUpperCase();
  if (s.includes("HALFTIME") || s.includes("HALF_TIME")) return "halftime";
  if (
    s.includes("IN_PROGRESS") || s.includes("FIRST_HALF") || s.includes("SECOND_HALF") ||
    s.includes("EXTRA_TIME")  || s.includes("OVERTIME")   || s.includes("PENALTY") ||
    s.includes("END_PERIOD")  || s.includes("KICKOFF")
  ) return "live";
  if (
    s.includes("FINAL") || s.includes("FULL_TIME") || s.includes("COMPLETED") ||
    s.includes("ABANDONED") || s.includes("POSTPONED") || s.includes("CANCELED") ||
    s.includes("SUSPENDED")  || s.includes("WALKOVER")
  ) return "finished";
  return "scheduled";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseMatch(event: any, league: string) {
  const comp = event.competitions?.[0] ?? {};
  const status = parseStatus(comp.status?.type?.name ?? "");
  const home = comp.competitors?.find((c: any) => c.homeAway === "home");
  const away = comp.competitors?.find((c: any) => c.homeAway === "away");

  const events = (comp.details ?? []).map((d: any) => {
    const t = (d.type?.text ?? "").toLowerCase();
    let type = "substitution";
    if (t.includes("goal") || t.includes("gol")) type = "goal";
    else if (t.includes("yellow") || t.includes("amarilla")) type = "yellowcard";
    else if (t.includes("red") || t.includes("roja")) type = "redcard";
    else if (t.includes("penalty") || t.includes("penalti")) type = "penalty";
    return { type, minute: d.clock?.displayValue ?? "", teamSide: d.team?.id === home?.team?.id ? "home" : "away", player: d.athletesInvolved?.[0]?.displayName };
  });

  const compStats = comp.statistics ?? [];
  const statsMap: Record<string, number[]> = {};
  for (const s of compStats) statsMap[s.name] = [parseFloat(s.homeValue ?? "0"), parseFloat(s.awayValue ?? "0")];

  // Basketball competitor-level stats
  const sv = (arr: any[], name: string) => { const s = arr.find((x: any) => x.name === name); return s ? parseFloat(s.displayValue ?? s.value ?? "0") : undefined; };
  const hs: any[] = home?.statistics ?? [];
  const as_: any[] = away?.statistics ?? [];
  const hQtr = (home?.linescores ?? []).map((l: any) => l.value ?? 0);
  const aQtr = (away?.linescores ?? []).map((l: any) => l.value ?? 0);
  const basketStats = hs.length > 0 ? {
    rebounds: [sv(hs, "rebounds"), sv(as_, "rebounds")],
    assists:  [sv(hs, "assists"),  sv(as_, "assists")],
    fgPct:    [sv(hs, "fieldGoalPct"),  sv(as_, "fieldGoalPct")],
    threePct: [sv(hs, "threePointPct"), sv(as_, "threePointPct")],
    ftPct:    [sv(hs, "freeThrowPct"),  sv(as_, "freeThrowPct")],
    turnovers:[sv(hs, "turnovers") ?? 0, sv(as_, "turnovers") ?? 0],
    quarterScores: hQtr.length > 0 ? [hQtr, aQtr] : undefined,
  } : undefined;

  // Player leaders
  const leaders: unknown[] = [];
  for (const c of [home, away]) {
    for (const l of c?.leaders ?? []) {
      const top = l.leaders?.[0];
      if (top?.athlete?.displayName) leaders.push({ stat: l.displayName ?? l.name, value: top.displayValue, name: top.athlete.displayName });
    }
  }

  const broadcasts = (comp.broadcasts ?? []).flatMap((b: any) => b.names ?? []) as string[];

  return {
    id: event.id, league, leagueName: event.season?.slug ?? league, status,
    minute: comp.status?.displayClock ?? comp.status?.type?.shortDetail, period: comp.status?.period,
    home: { name: home?.team?.displayName ?? "Home", shortName: home?.team?.abbreviation ?? "HOM", logo: home?.team?.logo ?? "", color: home?.team?.color, score: home?.score ?? "0" },
    away: { name: away?.team?.displayName ?? "Away", shortName: away?.team?.abbreviation ?? "AWY", logo: away?.team?.logo ?? "", color: away?.team?.color, score: away?.score ?? "0" },
    events,
    stats: compStats.length > 0 ? { possession: statsMap.possessionPct, shots: statsMap.totalShots, shotsOnTarget: statsMap.shotsOnTarget, corners: statsMap.cornerKicks, fouls: statsMap.fouls, yellowCards: statsMap.yellowCards } : undefined,
    basketStats, leaders: leaders.length > 0 ? leaders : undefined,
    broadcasts: broadcasts.length > 0 ? broadcasts : undefined,
    startTime: event.date, venue: comp.venue?.fullName,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseTennisEvent(event: any, league: string) {
  const tournament = event.name ?? league;
  const matches: unknown[] = [];
  for (const grouping of event.groupings ?? []) {
    for (const comp of grouping.competitions ?? []) {
      const [p1, p2] = (comp.competitors ?? []).slice(0, 2);
      if (!p1 || !p2) continue;
      const status = parseStatus(comp.status?.type?.name ?? "");
      const p1Scores: number[] = (p1.linescores ?? []).map((s: { value: number }) => s.value);
      const p2Scores: number[] = (p2.linescores ?? []).map((s: { value: number }) => s.value);
      let p1Sets = 0, p2Sets = 0;
      for (let i = 0; i < Math.max(p1Scores.length, p2Scores.length); i++) {
        if ((p1Scores[i] ?? 0) > (p2Scores[i] ?? 0)) p1Sets++;
        else if ((p2Scores[i] ?? 0) > (p1Scores[i] ?? 0)) p2Sets++;
      }
      const setStr = p1Scores.map((s, i) => `${s}-${p2Scores[i] ?? 0}`).join(" ");
      matches.push({
        id: comp.id ?? `${event.id}-${matches.length}`, league, leagueName: tournament, status,
        minute: setStr || undefined, period: comp.status?.period,
        home: { name: p1.athlete?.displayName ?? "Player 1", shortName: p1.athlete?.shortName ?? "P1", logo: p1.athlete?.flag?.href ?? "", score: String(p1Sets) },
        away: { name: p2.athlete?.displayName ?? "Player 2", shortName: p2.athlete?.shortName ?? "P2", logo: p2.athlete?.flag?.href ?? "", score: String(p2Sets) },
        events: [], startTime: comp.date, venue: comp.venue?.fullName,
      });
    }
  }
  return matches;
}

// Compute the ESPN date string (YYYYMMDD) for a Date object using UTC
function toESPNDate(d: Date): string {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}

// Return the previous calendar day in ESPN format
function prevDay(espnDate: string): string {
  const y = parseInt(espnDate.slice(0, 4));
  const m = parseInt(espnDate.slice(4, 6)) - 1;
  const d = parseInt(espnDate.slice(6, 8));
  const prev = new Date(Date.UTC(y, m, d - 1));
  return toESPNDate(prev);
}

// ─── EuroLeague via official XML API ─────────────────────────────────────────
// api-live.euroleague.net/v1/results — free, no auth, server-accessible.
// Contains ALL season games; played=1 means finished, played=0 means not yet played.
// NOTE: Games only get scores once finished. Live status is inferred from time.

const EURO_MONTH_MAP: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

function euroSeasonCode(yyyymmdd: string): string {
  const year  = parseInt(yyyymmdd.slice(0, 4));
  const month = parseInt(yyyymmdd.slice(4, 6));
  return month >= 9 ? `E${year}` : `E${year - 1}`;
}

// "Oct 15, 2025" → "20251015"
function euroDateToYYYYMMDD(dateStr: string): string {
  const m = dateStr.match(/(\w{3})\s+(\d{1,2}),\s+(\d{4})/);
  if (!m) return "";
  return `${m[3]}${EURO_MONTH_MAP[m[1]] ?? "00"}${m[2].padStart(2, "0")}`;
}

// Time-window heuristic — XML has no live flag
const EURO_PRE_MS  = 2 * 60 * 60 * 1000; // treat as live 2 h before tip-off
const EURO_POST_MS = 3 * 60 * 60 * 1000; // treat as live up to 3 h after tip-off

function euroLiveStatus(startISO: string): "live" | "scheduled" | "finished" {
  const start = new Date(startISO).getTime();
  const now   = Date.now();
  if (now >= start - EURO_PRE_MS && now <= start + EURO_POST_MS) return "live";
  if (now < start - EURO_PRE_MS) return "scheduled";
  return "finished";
}

// Module-level logo cache — persists for the lifetime of the edge isolate (one SSE connection)
let _euroLogos: Record<string, string> = {};
let _euroLogosFetched = false;

async function fetchEuroLogoMap(): Promise<Record<string, string>> {
  if (_euroLogosFetched) return _euroLogos;
  try {
    const res = await fetch("https://api-live.euroleague.net/v2/clubs", {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await res.json() as { data: any[] };
      for (const c of data) {
        if (c.code && c.images?.crest) _euroLogos[c.code] = c.images.crest;
      }
    }
  } catch { /* use empty map on failure */ }
  _euroLogosFetched = true;
  return _euroLogos;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseEuroLeagueXML(xml: string, targetDate: string, logos: Record<string, string>): any[] {
  const gameBlocks = xml.match(/<game>([\s\S]*?)<\/game>/g) ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out: any[] = [];

  for (const block of gameBlocks) {
    const tag = (name: string) =>
      block.match(new RegExp(`<${name}>([^<]*)<\\/${name}>`))?.[1]?.trim() ?? "";

    const date     = tag("date");      // "Oct 15, 2025"
    const yyyymmdd = euroDateToYYYYMMDD(date);
    if (yyyymmdd !== targetDate) continue;

    const code      = tag("gamecode"); // "E2025_001"
    const played    = tag("played") === "true" || tag("played") === "1";
    const homeCode  = tag("homecode");
    const awayCode  = tag("awaycode");
    const homeName  = tag("hometeam");
    const awayName  = tag("awayteam");
    const homeScore = tag("homescore");
    const awayScore = tag("awayscore");
    const time      = tag("time");     // "20:00" — CET

    // Build ISO start time (CET ≈ UTC+1 during EuroLeague season, ignores DST)
    let startISO = "";
    if (date && time) {
      const [hh, mm] = time.split(":").map(Number);
      const iso = `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
      const d = new Date(iso);
      d.setUTCHours(hh - 1, mm, 0, 0);
      startISO = d.toISOString();
    }

    const status: string = played
      ? "finished"
      : startISO
        ? euroLiveStatus(startISO)
        : "scheduled";

    out.push({
      id:         `euro-${code}`,
      league:     "euroleague",
      leagueName: "EuroLeague",
      status,
      minute:     undefined,
      home: {
        name:      homeName || homeCode,
        shortName: homeCode,
        logo:      logos[homeCode] ?? "",
        score:     played ? homeScore : "0",
      },
      away: {
        name:      awayName || awayCode,
        shortName: awayCode,
        logo:      logos[awayCode] ?? "",
        score:     played ? awayScore : "0",
      },
      events:    [],
      startTime: startISO || undefined,
    });
  }
  return out;
}

// Fetch EuroLeague (and/or ACB) games for a given YYYYMMDD date.
// ACB has no free server-accessible API — returns [] gracefully.
async function fetchSofascoreBasketball(date: string, leagueFilter: string | null): Promise<unknown[]> {
  if (leagueFilter === "acb") return [];

  const seasonCode = euroSeasonCode(date);
  const url = `https://api-live.euroleague.net/v1/results?seasonCode=${seasonCode}`;
  try {
    const [res, logos] = await Promise.all([
      fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
        headers: { Accept: "application/xml, text/xml, */*" },
      }),
      fetchEuroLogoMap(),
    ]);
    if (!res.ok) return [];
    const xml = await res.text();
    return parseEuroLeagueXML(xml, date, logos);
  } catch {
    return [];
  }
}

// Fetch all matching leagues for a single ESPN date
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchDate(sport: string, league: string | null, date: string): Promise<any[]> {
  const entries = Object.entries(LEAGUES).filter(([key, meta]) => {
    if (league) return key === league;
    if (sport === "football") return !meta.tennis && key !== "nba";
    if (sport === "basketball") return key === "nba";
    if (sport === "tennis") return !!meta.tennis;
    return true;
  });

  const results = await Promise.allSettled(
    entries.map(async ([key, meta]) => {
      const url = `${ESPN_BASE}/${meta.path}/scoreboard?dates=${date}`;
      const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(5000) });
      if (!res.ok) return [];
      const json = await res.json();
      if (meta.tennis) return (json.events ?? []).flatMap((e: unknown) => parseTennisEvent(e, key));
      return (json.events ?? []).map((e: unknown) => parseMatch(e, key));
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<unknown[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchAllMatches(sport: string, league: string | null, date: string, isToday: boolean) {
  // EuroLeague + ACB come from Sofascore (live scores, full schedule)
  // ESPN handles everything else (football, NBA, tennis)
  const wantSofa = league === "euroleague" || league === "acb" ||
    (!league && (sport === "basketball" || sport === "all"));
  // Skip ESPN when the filter targets a Sofascore-only league
  const wantEspn = league !== "euroleague" && league !== "acb";

  const [espnMain, sofaMain] = await Promise.all([
    wantEspn ? fetchDate(sport, league, date)              : Promise.resolve([]),
    wantSofa ? fetchSofascoreBasketball(date, league)      : Promise.resolve([]),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let all: any[] = [...espnMain, ...sofaMain];

  if (isToday && wantEspn) {
    // Also check the previous calendar day — catches US-timezone sports (NBA playoffs etc.)
    // stored under the prior Eastern-time date but live/finishing for European viewers.
    const yesterday = prevDay(date);
    const prev = await fetchDate(sport, league, yesterday);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seenIds = new Set(espnMain.map((m: any) => m.id));
    for (const m of prev) {
      if ((m.status === "live" || m.status === "halftime") && !seenIds.has(m.id)) {
        all = [m, ...all];
        seenIds.add(m.id);
      }
    }
  }

  const order: Record<string, number> = { live: 0, halftime: 1, scheduled: 2, finished: 3 };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  all.sort((a: any, b: any) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
  return all;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sport  = searchParams.get("sport")  ?? "all";
  const league = searchParams.get("league") ?? null;
  const date   = searchParams.get("date")   ?? toESPNDate(new Date());
  // Client explicitly tells us if this is "today" so we don't depend on server clock timezone
  const isToday = searchParams.get("today") === "1";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = async () => {
        try {
          const data = await fetchAllMatches(sport, league, date, isToday);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // skip failed fetch — client keeps the last good data
        }
      };

      await send();

      // Past / future dates: one fetch is enough — no live updates needed
      if (!isToday) {
        controller.close();
        return;
      }

      // Today: keep updating every 5 s for up to 5 minutes, then EventSource auto-reconnects
      let ticks = 0;
      const interval = setInterval(async () => {
        ticks++;
        if (ticks >= 60) {
          clearInterval(interval);
          controller.close();
          return;
        }
        await send();
      }, 5000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        try { controller.close(); } catch { /* already closed */ }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
