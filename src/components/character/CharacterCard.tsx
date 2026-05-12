'use client';

import Link from 'next/link';
import { MessageSquare, Trash2 } from 'lucide-react';
import type { CharacterSummary } from '@/lib/types';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

interface CharacterCardProps {
  character: CharacterSummary;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

export default function CharacterCard({ character, onDelete, deleting }: CharacterCardProps) {
  return (
    <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 flex flex-col gap-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-start gap-4">
        <Avatar src={character.avatarUrl} name={character.name} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{character.name}</h3>
          <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{character.personality}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Link href={`/characters/${character.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            상세 보기
          </Button>
        </Link>
        <Link href={`/conversations?characterId=${character.id}`}>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <MessageSquare size={15} />
            대화
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          loading={deleting}
          onClick={() => onDelete(character.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 size={15} />
        </Button>
      </div>
    </div>
  );
}
