'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { characterApi } from '@/lib/api/characters';
import type { CharacterResponse } from '@/lib/types';
import CharacterDetail from '@/components/character/CharacterDetail';
import CharacterForm from '@/components/character/CharacterForm';
import Button from '@/components/ui/Button';

export default function CharacterPage() {
  const { characterId } = useParams<{ characterId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isEditing = searchParams.get('edit') === 'true';

  const [character, setCharacter] = useState<CharacterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    characterApi
      .get(characterId)
      .then(setCharacter)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [characterId]);

  async function handleUpdate(name: string, personaDescription: string, files: File[]) {
    const updated = await characterApi.update(characterId, name, personaDescription, files);
    setCharacter(updated);
    router.push(`/characters/${characterId}`);
  }

  async function handleDelete() {
    if (!confirm('캐릭터를 삭제하시겠습니까? 관련 대화도 모두 삭제됩니다.')) return;
    setDeleting(true);
    try {
      await characterApi.delete(characterId);
      router.push('/characters');
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제에 실패했습니다.');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-400 text-sm">{error || '캐릭터를 찾을 수 없습니다.'}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/characters"
            className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ChevronLeft size={16} />
            캐릭터 목록
          </Link>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              loading={deleting}
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 size={15} />
              삭제
            </Button>
          )}
        </div>

        {isEditing ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">캐릭터 수정</h1>
            </div>
            <CharacterForm
              initialName={character.name}
              initialPersona={character.personaDescription}
              submitLabel="수정 완료"
              onSubmit={handleUpdate}
            />
          </>
        ) : (
          <CharacterDetail character={character} />
        )}
      </div>
    </div>
  );
}
