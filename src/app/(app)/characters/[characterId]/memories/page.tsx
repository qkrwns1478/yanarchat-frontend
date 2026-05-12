'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { memoryApi } from '@/lib/api/memories';
import { characterApi } from '@/lib/api/characters';
import type { MemoryResponse } from '@/lib/types';
import MemoryList from '@/components/memory/MemoryList';

export default function MemoriesPage() {
  const { characterId } = useParams<{ characterId: string }>();

  const [memories, setMemories] = useState<MemoryResponse[]>([]);
  const [characterName, setCharacterName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([memoryApi.list(characterId), characterApi.get(characterId)])
      .then(([mems, char]) => {
        setMemories(mems);
        setCharacterName(char.name);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [characterId]);

  async function handleDelete(memoryId: string) {
    if (!confirm('이 기억을 삭제하시겠습니까?')) return;
    setDeletingId(memoryId);
    try {
      await memoryApi.delete(characterId, memoryId);
      setMemories((prev) => prev.filter((m) => m.id !== memoryId));
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link
          href={`/characters/${characterId}`}
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          {characterName || '캐릭터'}
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">기억 관리</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {characterName}의 기억 목록입니다. 불필요한 기억은 삭제할 수 있습니다.
          </p>
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

        {!loading && !error && (
          <MemoryList memories={memories} onDelete={handleDelete} deletingId={deletingId} />
        )}
      </div>
    </div>
  );
}
