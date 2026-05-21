import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/rss";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const news = await fetchAllNews();
    return NextResponse.json({ ok: true, count: news.length, ts: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
