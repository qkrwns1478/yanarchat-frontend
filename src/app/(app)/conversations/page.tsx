'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { conversationApi } from '@/lib/api/conversations';
import { characterApi } from '@/lib/api/characters';
import type { ConversationSummary, CharacterSummary } from '@/lib/types';
import ConversationList from '@/components/conversation/ConversationList';
import Button from '@/components/ui/Button';

export default function ConversationsPage() {
  const searchParams = useSearchParams();
  const characterId = searchParams.get('characterId') ?? undefined;

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [characters, setCharacters] = useState<CharacterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    Promise.all([
      conversationApi.list({ characterId }),
      characterApi.list(),
    ])
      .then(([convs, chars]) => {
        setConversations(convs);
        setCharacters(chars);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [characterId]);

  async function handleDelete(id: string) {
    if (!confirm('대화를 삭제하시겠습니까?')) return;
    setDeletingId(id);
    try {
      await conversationApi.delete(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleNewConversation(charId: string) {
    setCreating(true);
    try {
      const char = characters.find((c) => c.id === charId);
      const title = `${char?.name ?? ''}와의 대화`;
      const conv = await conversationApi.create(charId, title);
      window.location.href = `/conversations/${conv.id}`;
    } catch (e) {
      alert(e instanceof Error ? e.message : '대화 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  }

  const filteredCharacter = characterId
    ? characters.find((c) => c.id === characterId)
    : null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {filteredCharacter ? `${filteredCharacter.name}와의 대화` : '대화'}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {filteredCharacter
                ? '이 캐릭터와 나눈 대화 목록입니다.'
                : '모든 대화 목록입니다.'}
            </p>
          </div>

          {characterId && (
            <Button
              size="sm"
              loading={creating}
              onClick={() => handleNewConversation(characterId)}
              className="gap-1.5"
            >
              <Plus size={16} />
              새 대화
            </Button>
          )}
        </div>

        {!characterId && characters.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-zinc-400 mb-2">캐릭터와 새 대화 시작</p>
            <div className="flex flex-wrap gap-2">
              {characters.map((c) => (
                <Button
                  key={c.id}
                  variant="secondary"
                  size="sm"
                  loading={creating}
                  onClick={() => handleNewConversation(c.id)}
                  className="gap-1.5"
                >
                  <Plus size={14} />
                  {c.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {!characterId && characters.length === 0 && !loading && (
          <div className="mb-6 rounded-lg bg-zinc-800/50 border border-zinc-700 px-4 py-3 text-sm text-zinc-400">
            캐릭터가 없습니다.{' '}
            <Link href="/characters/new" className="text-violet-400 hover:text-violet-300">
              캐릭터를 먼저 만들어 보세요.
            </Link>
          </div>
        )}

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
          <ConversationList
            conversations={conversations}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
      </div>
    </div>
  );
}
