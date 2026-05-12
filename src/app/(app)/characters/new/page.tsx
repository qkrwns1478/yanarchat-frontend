'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { characterApi } from '@/lib/api/characters';
import CharacterForm from '@/components/character/CharacterForm';

export default function NewCharacterPage() {
  const router = useRouter();

  async function handleSubmit(name: string, personaDescription: string, files: File[]) {
    const character = await characterApi.create(name, personaDescription, files);
    router.push(`/characters/${character.id}`);
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-xl mx-auto px-6 py-8">
        <Link
          href="/characters"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          캐릭터 목록
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">새 캐릭터 만들기</h1>
          <p className="text-sm text-zinc-500 mt-1">
            이름과 페르소나를 입력하면 AI가 캐릭터를 완성해 드립니다.
          </p>
        </div>

        <CharacterForm submitLabel="캐릭터 생성" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
