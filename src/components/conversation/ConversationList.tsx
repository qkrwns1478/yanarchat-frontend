'use client';

import Link from 'next/link';
import { Trash2, MessageSquare } from 'lucide-react';
import type { ConversationSummary } from '@/lib/types';
import Button from '@/components/ui/Button';

interface ConversationListProps {
  conversations: ConversationSummary[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

export default function ConversationList({
  conversations,
  onDelete,
  deletingId,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <MessageSquare size={36} className="text-zinc-700" />
        <p className="text-zinc-500 text-sm">아직 대화가 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {conversations.map((conv) => (
        <li
          key={conv.id}
          className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 hover:border-zinc-700 transition-colors"
        >
          <Link href={`/conversations/${conv.id}`} className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{conv.title}</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {conv.characterName} · {new Date(conv.updatedAt).toLocaleDateString('ko-KR')}
            </p>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            loading={deletingId === conv.id}
            onClick={() => onDelete(conv.id)}
            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-opacity"
          >
            <Trash2 size={14} />
          </Button>
        </li>
      ))}
    </ul>
  );
}
