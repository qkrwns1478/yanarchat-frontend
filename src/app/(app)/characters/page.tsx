'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { characterApi } from '@/lib/api/characters';
import type { CharacterSummary } from '@/lib/types';
import CharacterCard from '@/components/character/CharacterCard';
import Button from '@/components/ui/Button';

export default function CharactersPage() {
  const [characters, setCharacters] = useState<CharacterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    characterApi
      .list()
      .then(setCharacters)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('캐릭터를 삭제하시겠습니까?')) return;
    setDeletingId(id);
    try {
      await characterApi.delete(id);
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">캐릭터</h1>
            <p className="text-sm text-zinc-500 mt-1">나만의 AI 캐릭터를 만들어 보세요.</p>
          </div>
          <Link href="/characters/new">
            <Button size="sm" className="gap-1.5">
              <Plus size={16} />
              새 캐릭터
            </Button>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-6 w-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && characters.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-zinc-500 text-sm">아직 캐릭터가 없습니다.</p>
            <Link href="/characters/new">
              <Button size="sm" className="gap-1.5">
                <Plus size={16} />
                첫 번째 캐릭터 만들기
              </Button>
            </Link>
          </div>
        )}

        {!loading && !error && characters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((c) => (
              <CharacterCard
                key={c.id}
                character={c}
                onDelete={handleDelete}
                deleting={deletingId === c.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
