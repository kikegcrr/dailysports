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

const TENNIS_LEAGUES: Record<string, string> = {
  atp: "tennis/atp",
  wta: "tennis/wta",
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

export interface PlayerLeader {
  stat: string;
  value: string;
  name: string;
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
  basketStats?: {
    rebounds?: [number, number];
    assists?: [number, number];
    fgPct?: [number, number];
    threePct?: [number, number];
    ftPct?: [number, number];
    steals?: [number, number];
    blocks?: [number, number];
    turnovers?: [number, number];
    quarterScores?: [number[], number[]];
  };
  leaders?: PlayerLeader[];
  broadcasts?: string[];
  startTime?: string;
  venue?: string;
}

function parseStatus(statusName: string): MatchStatus {
  const s = statusName.toUpperCase();
  // Halftime / end of half — check before IN_PROGRESS so halftime wins
  if (s.includes("HALFTIME") || s.includes("HALF_TIME")) return "halftime";
  // Any live / in-progress state
  if (
    s.includes("IN_PROGRESS") ||
    s.includes("FIRST_HALF") ||
    s.includes("SECOND_HALF") ||
    s.includes("EXTRA_TIME") ||
    s.includes("OVERTIME") ||
    s.includes("PENALTY") ||
    s.includes("END_PERIOD") ||      // basketball Q1/Q3 break
    s.includes("KICKOFF")
  ) return "live";
  // Finished / concluded
  if (
    s.includes("FINAL") ||
    s.includes("FULL_TIME") ||
    s.includes("COMPLETED") ||
    s.includes("ABANDONED") ||
    s.includes("POSTPONED") ||
    s.includes("CANCELED") ||
    s.includes("SUSPENDED") ||
    s.includes("WALKOVER")
  ) return "finished";
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
function statVal(arr: any[], name: string): number | undefined {
  const s = arr.find((x: any) => x.name === name);
  return s ? parseFloat(s.displayValue ?? s.value ?? "0") : undefined;
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

  // Football/soccer competition-level stats
  const compStats = comp.statistics || [];
  const statsMap: Record<string, number[]> = {};
  for (const stat of compStats) {
    statsMap[stat.name] = [parseFloat(stat.homeValue || "0"), parseFloat(stat.awayValue || "0")];
  }

  // Basketball competitor-level stats (NBA: stats live on each competitor)
  const homeStats: any[] = homeTeam?.statistics || [];
  const awayStats: any[] = awayTeam?.statistics || [];
  const homeQtr: number[] = (homeTeam?.linescores || []).map((l: any) => l.value ?? 0);
  const awayQtr: number[] = (awayTeam?.linescores || []).map((l: any) => l.value ?? 0);

  const basketStats = homeStats.length > 0 ? {
    rebounds:    [statVal(homeStats, "rebounds"), statVal(awayStats, "rebounds")] as [number, number],
    assists:     [statVal(homeStats, "assists"),  statVal(awayStats, "assists")]  as [number, number],
    fgPct:       [statVal(homeStats, "fieldGoalPct"),       statVal(awayStats, "fieldGoalPct")]       as [number, number],
    threePct:    [statVal(homeStats, "threePointPct"),      statVal(awayStats, "threePointPct")]      as [number, number],
    ftPct:       [statVal(homeStats, "freeThrowPct"),       statVal(awayStats, "freeThrowPct")]       as [number, number],
    turnovers:   [statVal(homeStats, "turnovers") ?? 0,    statVal(awayStats, "turnovers") ?? 0]    as [number, number],
    quarterScores: homeQtr.length > 0 ? [homeQtr, awayQtr] as [number[], number[]] : undefined,
  } : undefined;

  // Player leaders
  const leaders: PlayerLeader[] = [];
  for (const competitor of [homeTeam, awayTeam]) {
    for (const leader of competitor?.leaders || []) {
      const top = leader.leaders?.[0];
      if (top?.athlete?.displayName) {
        leaders.push({ stat: leader.displayName ?? leader.name, value: top.displayValue, name: top.athlete.displayName });
      }
    }
  }

  // Broadcast info
  const broadcasts = (comp.broadcasts || []).flatMap((b: any) => b.names || []) as string[];

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
    stats: compStats.length > 0 ? {
      possession: statsMap.possessionPct as [number, number] | undefined,
      shots: statsMap.totalShots as [number, number] | undefined,
      shotsOnTarget: statsMap.shotsOnTarget as [number, number] | undefined,
      corners: statsMap.cornerKicks as [number, number] | undefined,
      fouls: statsMap.fouls as [number, number] | undefined,
      yellowCards: statsMap.yellowCards as [number, number] | undefined,
    } : undefined,
    basketStats,
    leaders: leaders.length > 0 ? leaders : undefined,
    broadcasts: broadcasts.length > 0 ? broadcasts : undefined,
    startTime: event.date,
    venue: comp.venue?.fullName,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseTennisEvent(event: any, leagueKey: string): LiveMatch[] {
  const tournament = event.name ?? leagueKey;
  const matches: LiveMatch[] = [];

  for (const grouping of event.groupings ?? []) {
    for (const comp of grouping.competitions ?? []) {
      const [p1, p2] = (comp.competitors ?? []).slice(0, 2);
      if (!p1 || !p2) continue;

      const statusName: string = comp.status?.type?.name ?? "";
      const status = parseStatus(statusName);

      const p1Scores: number[] = (p1.linescores ?? []).map((s: { value: number }) => s.value);
      const p2Scores: number[] = (p2.linescores ?? []).map((s: { value: number }) => s.value);

      let p1Sets = 0, p2Sets = 0;
      const setLen = Math.max(p1Scores.length, p2Scores.length);
      for (let i = 0; i < setLen; i++) {
        if ((p1Scores[i] ?? 0) > (p2Scores[i] ?? 0)) p1Sets++;
        else if ((p2Scores[i] ?? 0) > (p1Scores[i] ?? 0)) p2Sets++;
      }

      // Build readable set scores: "6-4 6-1"
      const setStr = p1Scores.map((s, i) => `${s}-${p2Scores[i] ?? 0}`).join(" ");

      matches.push({
        id: comp.id ?? `${event.id}-${matches.length}`,
        league: leagueKey,
        leagueName: tournament,
        status,
        minute: setStr || undefined,
        period: comp.status?.period,
        home: {
          name: p1.athlete?.displayName ?? "Player 1",
          shortName: p1.athlete?.shortName ?? "P1",
          logo: p1.athlete?.flag?.href ?? "",
          score: String(p1Sets),
        },
        away: {
          name: p2.athlete?.displayName ?? "Player 2",
          shortName: p2.athlete?.shortName ?? "P2",
          logo: p2.athlete?.flag?.href ?? "",
          score: String(p2Sets),
        },
        events: [],
        startTime: comp.date,
        venue: comp.venue?.fullName,
      });
    }
  }
  return matches;
}

async function fetchLeague(leagueKey: string, path: string, isTennis = false): Promise<LiveMatch[]> {
  try {
    const res = await fetch(`${ESPN_BASE}/${path}/scoreboard`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (isTennis) {
      return (json.events ?? []).flatMap((e: unknown) => parseTennisEvent(e, leagueKey));
    }
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
    const leagues = league ? { [league]: FOOTBALL_LEAGUES[league] } : FOOTBALL_LEAGUES;
    for (const [key, path] of Object.entries(leagues)) {
      if (path) tasks.push(fetchLeague(key, path));
    }
  }

  if (sport === "all" || sport === "basketball") {
    const leagues = league ? { [league]: BASKETBALL_LEAGUES[league] } : BASKETBALL_LEAGUES;
    for (const [key, path] of Object.entries(leagues)) {
      if (path) tasks.push(fetchLeague(key, path));
    }
  }

  if (sport === "all" || sport === "tennis") {
    const leagues = league ? { [league]: TENNIS_LEAGUES[league] } : TENNIS_LEAGUES;
    for (const [key, path] of Object.entries(leagues)) {
      if (path) tasks.push(fetchLeague(key, path, true));
    }
  }

  const results = await Promise.allSettled(tasks);
  const allMatches = results
    .filter((r): r is PromiseFulfilledResult<LiveMatch[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const order: Record<MatchStatus, number> = { live: 0, halftime: 1, scheduled: 2, finished: 3 };
  allMatches.sort((a, b) => order[a.status] - order[b.status]);

  return NextResponse.json(allMatches, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=10" },
  });
}
