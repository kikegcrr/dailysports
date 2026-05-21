import { NextRequest, NextResponse } from "next/server";

// ESPN public API — no API key required
const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

const FOOTBALL_LEAGUES: Record<string, string> = {
  laliga: "soccer/esp.1",
  champions: "soccer/uefa.champions",
  premier: "soccer/eng.1",
  seriea: "soccer/ita.1",
  bundesliga: "soccer/ger.1",
  ligue1: "soccer/fra.1",
  ligaportugal: "soccer/por.1",
  europa: "soccer/uefa.europa",
  libertadores: "soccer/conmebol.libertadores",
};

const BASKETBALL_LEAGUES: Record<string, string> = {
  nba: "basketball/nba",
};

export type MatchStatus = "scheduled" | "live" | "halftime" | "finished";

export interface MatchEvent {
  type: "goal" | "yellowcard" | "redcard" | "substitution" | "penalty";
  minute: string;
  teamSide: "home" | "away";
  player?: string;
  assist?: string;
  description?: string;
}

export interface MatchTeam {
  name: string;
  shortName: string;
  logo: string;
  color?: string;
  score: string;
}

export interface LiveMatch {
  id: string;
  league: string;
  leagueName: string;
  status: MatchStatus;
  minute?: string;
  period?: number;
  home: MatchTeam;
  away: MatchTeam;
  events: MatchEvent[];
  stats?: {
    possession?: [number, number];
    shots?: [number, number];
    shotsOnTarget?: [number, number];
    corners?: [number, number];
    fouls?: [number, number];
    yellowCards?: [number, number];
    redCards?: [number, number];
  };
  startTime?: string;
  venue?: string;
}

function parseStatus(statusName: string): MatchStatus {
  if (statusName.includes("IN_PROGRESS") || statusName.includes("HALFTIME")) {
    if (statusName.includes("HALFTIME")) return "halftime";
    return "live";
  }
  if (statusName.includes("FINAL") || statusName.includes("FULL_TIME") || statusName.includes("COMPLETED")) return "finished";
  return "scheduled";
}

function parseEventType(typeText: string): MatchEvent["type"] {
  const t = typeText.toLowerCase();
  if (t.includes("goal") || t.includes("gol")) return "goal";
  if (t.includes("yellow") || t.includes("amarilla")) return "yellowcard";
  if (t.includes("red") || t.includes("roja")) return "redcard";
  if (t.includes("penalty") || t.includes("penalti")) return "penalty";
  return "substitution";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseMatch(event: any, leagueName: string): LiveMatch {
  const comp = event.competitions?.[0] || {};
  const statusName = comp.status?.type?.name || "";
  const homeTeam = comp.competitors?.find((c: any) => c.homeAway === "home");
  const awayTeam = comp.competitors?.find((c: any) => c.homeAway === "away");

  const events: MatchEvent[] = (comp.details || []).map((d: any) => ({
    type: parseEventType(d.type?.text || ""),
    minute: d.clock?.displayValue || "",
    teamSide: d.team?.id === homeTeam?.team?.id ? "home" : "away",
    player: d.athletesInvolved?.[0]?.displayName,
    assist: d.athletesInvolved?.[1]?.displayName,
    description: d.type?.text,
  }));

  // Parse stats
  const statsMap: Record<string, number[]> = {};
  for (const stat of comp.statistics || []) {
    statsMap[stat.name] = [
      parseFloat(stat.homeValue || "0"),
      parseFloat(stat.awayValue || "0"),
    ];
  }

  return {
    id: event.id,
    league: leagueName,
    leagueName: event.season?.slug || leagueName,
    status: parseStatus(statusName),
    minute: comp.status?.displayClock || comp.status?.type?.shortDetail,
    period: comp.status?.period,
    home: {
      name: homeTeam?.team?.displayName || "Home",
      shortName: homeTeam?.team?.abbreviation || "HOM",
      logo: homeTeam?.team?.logo || "",
      color: homeTeam?.team?.color,
      score: homeTeam?.score || "0",
    },
    away: {
      name: awayTeam?.team?.displayName || "Away",
      shortName: awayTeam?.team?.abbreviation || "AWY",
      logo: awayTeam?.team?.logo || "",
      color: awayTeam?.team?.color,
      score: awayTeam?.score || "0",
    },
    events,
    stats: {
      possession: statsMap.possessionPct as [number, number] | undefined,
      shots: statsMap.totalShots as [number, number] | undefined,
      shotsOnTarget: statsMap.shotsOnTarget as [number, number] | undefined,
      corners: statsMap.cornerKicks as [number, number] | undefined,
      fouls: statsMap.fouls as [number, number] | undefined,
      yellowCards: statsMap.yellowCards as [number, number] | undefined,
    },
    startTime: event.date,
    venue: comp.venue?.fullName,
  };
}

async function fetchLeague(leagueKey: string, path: string): Promise<LiveMatch[]> {
  try {
    const res = await fetch(`${ESPN_BASE}/${path}/scoreboard`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.events || []).map((e: unknown) => parseMatch(e, leagueKey));
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get("sport") || "all";
  const league = searchParams.get("league");

  const tasks: Promise<LiveMatch[]>[] = [];

  if (sport === "all" || sport === "football") {
    const footballLeagues = league
      ? { [league]: FOOTBALL_LEAGUES[league] }
      : FOOTBALL_LEAGUES;

    for (const [key, path] of Object.entries(footballLeagues)) {
      tasks.push(fetchLeague(key, path));
    }
  }

  if (sport === "all" || sport === "basketball") {
    const basketballLeagues = league
      ? { [league]: BASKETBALL_LEAGUES[league] }
      : BASKETBALL_LEAGUES;

    for (const [key, path] of Object.entries(basketballLeagues)) {
      tasks.push(fetchLeague(key, path));
    }
  }

  const results = await Promise.allSettled(tasks);
  const allMatches = results
    .filter((r): r is PromiseFulfilledResult<LiveMatch[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  // Sort: live first, then halftime, then scheduled, then finished
  const order: Record<MatchStatus, number> = { live: 0, halftime: 1, scheduled: 2, finished: 3 };
  allMatches.sort((a, b) => order[a.status] - order[b.status]);

  return NextResponse.json(allMatches, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=10" },
  });
}
