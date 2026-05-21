import Link from "next/link";
import { MessageSquare, Eye, Clock, Pin } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export interface Thread {
  id: string;
  title: string;
  content: string;
  topic: string;
  user_id: string;
  created_at: string;
  pinned?: boolean;
  reply_count?: number;
  view_count?: number;
  profiles?: { username: string; avatar_url?: string };
}

export default function ThreadCard({ thread, lang }: { thread: Thread; lang: string }) {
  return (
    <Link
      href={`/${lang}/foros/${thread.topic}/${thread.id}`}
      className="group flex gap-4 p-4 rounded-xl border border-sport-border bg-sport-card hover:border-gold-500/30 hover:bg-white/[0.02] transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          {thread.pinned && (
            <span className="flex items-center gap-1 text-gold-400 text-xs font-medium">
              <Pin size={11} fill="currentColor" /> Fijado
            </span>
          )}
        </div>
        <h3 className="font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-2">
          {thread.title}
        </h3>
        {thread.content && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{thread.content}</p>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
          <span className="font-medium text-gray-500">
            {thread.profiles?.username || "Usuario"}
          </span>
          <span className="flex items-center gap-0.5">
            <Clock size={10} /> {timeAgo(thread.created_at, lang)}
          </span>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-2 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <MessageSquare size={12} />
          {thread.reply_count || 0}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={12} />
          {thread.view_count || 0}
        </span>
      </div>
    </Link>
  );
}
