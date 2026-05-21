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
  if (name.includes("HALFTIME")) return "halftime";
  if (name.includes("IN_PROGRESS")) return "live";
  if (name.includes("FINAL") || name.includes("COMPLETED") || name.includes("FULL_TIME")) return "finished";
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

  const statsMap: Record<string, number[]> = {};
  for (const s of comp.statistics ?? []) {
    statsMap[s.name] = [parseFloat(s.homeValue ?? "0"), parseFloat(s.awayValue ?? "0")];
  }

  return {
    id: event.id, league, leagueName: event.season?.slug ?? league, status,
    minute: comp.status?.displayClock ?? comp.status?.type?.shortDetail, period: comp.status?.period,
    home: { name: home?.team?.displayName ?? "Home", shortName: home?.team?.abbreviation ?? "HOM", logo: home?.team?.logo ?? "", color: home?.team?.color, score: home?.score ?? "0" },
    away: { name: away?.team?.displayName ?? "Away", shortName: away?.team?.abbreviation ?? "AWY", logo: away?.team?.logo ?? "", color: away?.team?.color, score: away?.score ?? "0" },
    events, stats: { possession: statsMap.possessionPct, shots: statsMap.totalShots, shotsOnTarget: statsMap.shotsOnTarget, corners: statsMap.cornerKicks, fouls: statsMap.fouls, yellowCards: statsMap.yellowCards },
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

async function fetchAllMatches(sport: string, league: string | null) {
  const entries = Object.entries(LEAGUES).filter(([key, meta]) => {
    if (league) return key === league;
    if (sport === "football") return !meta.tennis && key !== "nba";
    if (sport === "basketball") return key === "nba";
    if (sport === "tennis") return !!meta.tennis;
    return true;
  });

  const results = await Promise.allSettled(
    entries.map(async ([key, meta]) => {
      const res = await fetch(`${ESPN_BASE}/${meta.path}/scoreboard`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return [];
      const json = await res.json();
      if (meta.tennis) return (json.events ?? []).flatMap((e: unknown) => parseTennisEvent(e, key));
      return (json.events ?? []).map((e: unknown) => parseMatch(e, key));
    })
  );

  const all = results
    .filter((r): r is PromiseFulfilledResult<unknown[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const order: Record<string, number> = { live: 0, halftime: 1, scheduled: 2, finished: 3 };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  all.sort((a: any, b: any) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
  return all;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sport = searchParams.get("sport") ?? "all";
  const league = searchParams.get("league");

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = async () => {
        try {
          const data = await fetchAllMatches(sport, league);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // skip failed fetch — client keeps the last good data
        }
      };

      await send();

      let ticks = 0;
      const interval = setInterval(async () => {
        ticks++;
        if (ticks >= 60) {
          // Close after 5 minutes; EventSource auto-reconnects
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
