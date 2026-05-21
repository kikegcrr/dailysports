import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/rss";

// In-memory cache: revalidated every 10 min by Vercel cron
let cache: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");

  if (!cache || Date.now() - cache.ts > CACHE_TTL) {
    const news = await fetchAllNews();
    cache = { data: news, ts: Date.now() };
  }

  let data = cache.data as Awaited<ReturnType<typeof fetchAllNews>>;
  if (category && category !== "all") {
    data = data.filter((item) => item.category === category);
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60",
    },
  });
}
