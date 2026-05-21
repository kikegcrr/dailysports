import { hasLocale, getDictionary, Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import NewsFeed from "@/components/news/NewsFeed";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fútbol — dailySports",
  description: "Las últimas noticias de fútbol: LaLiga, Champions League, Premier League y mucho más.",
};

export default async function FootballPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <span className="text-4xl">⚽</span>
        <div>
          <h1 className="text-2xl md:text-3xl font-display tracking-wide text-white">
            {dict.nav.football}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            LaLiga · Champions League · Premier League · Serie A · Bundesliga
          </p>
        </div>
      </div>

      <NewsFeed lang={lang} defaultCategory="football" />
    </div>
  );
}
