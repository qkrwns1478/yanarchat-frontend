'use client';

import Link from 'next/link';
import { Brain, MessageSquare, Pencil } from 'lucide-react';
import type { CharacterResponse } from '@/lib/types';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

interface CharacterDetailProps {
  character: CharacterResponse;
}

export default function CharacterDetail({ character }: CharacterDetailProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-5">
        <Avatar src={character.avatarUrl} name={character.name} size="xl" />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white">{character.name}</h1>
          <p className="mt-1 text-sm text-zinc-400">{character.personality}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {character.traits.map((trait) => (
              <span
                key={trait}
                className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-0.5 text-xs text-violet-300"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={`/conversations?characterId=${character.id}`}>
          <Button size="sm" className="gap-1.5">
            <MessageSquare size={15} />
            대화하기
          </Button>
        </Link>
        <Link href={`/characters/${character.id}/memories`}>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <Brain size={15} />
            기억 관리
          </Button>
        </Link>
        <Link href={`/characters/${character.id}?edit=true`}>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Pencil size={15} />
            수정
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Section title="말투" content={character.speechStyle} />
        <Section title="배경" content={character.background} />
        <Section title="페르소나 설명" content={character.personaDescription} className="sm:col-span-2" />
      </div>

      {character.files.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs font-medium text-zinc-500 mb-2">첨부 파일</p>
          <ul className="flex flex-col gap-1.5">
            {character.files.map((f) => (
              <li key={f.id} className="text-sm text-zinc-300 truncate">
                {f.originalName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  content,
  className = '',
}: {
  title: string;
  content: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 ${className}`}>
      <p className="text-xs font-medium text-zinc-500 mb-2">{title}</p>
      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}
