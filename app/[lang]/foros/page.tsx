import { hasLocale, getDictionary, Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import { ForumTopicGrid } from "@/components/forums/ForumTopics";
import { MessageSquare, TrendingUp, Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foros — dailySports",
  description: "Debate con la comunidad sobre fútbol, baloncesto y todos los deportes.",
};

export default async function ForumsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto py-6">
        <h1 className="text-3xl md:text-4xl font-display tracking-wide text-white mb-3">
          {dict.forums.title}
        </h1>
        <p className="text-gray-400">{dict.forums.subtitle}</p>

        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <MessageSquare size={16} className="text-gold-400" /> 11 foros
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp size={16} className="text-gold-400" /> Debates activos
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={16} className="text-gold-400" /> Comunidad abierta
          </span>
        </div>
      </div>

      {/* Topic grid */}
      <ForumTopicGrid lang={lang} />
    </div>
  );
}
