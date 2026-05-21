import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const topic = searchParams.get("topic");
  const supabase = await createClient();

  let query = supabase
    .from("forum_threads")
    .select("*, forum_replies(count), profiles(username, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (topic) query = query.eq("topic", topic);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json();
  const { topic, title, content } = body;

  const { data, error } = await supabase
    .from("forum_threads")
    .insert({ topic, title, content, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
