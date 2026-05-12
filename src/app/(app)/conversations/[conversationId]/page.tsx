'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronLeft, Brain } from 'lucide-react';
import { conversationApi } from '@/lib/api/conversations';
import type { ConversationDetail, MessageResponse } from '@/lib/types';
import MessageList from '@/components/conversation/MessageList';
import MessageInput from '@/components/conversation/MessageInput';

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();

  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    conversationApi
      .get(conversationId)
      .then((conv) => {
        setConversation(conv);
        setMessages(conv.messages);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [conversationId]);

  async function handleSend(content: string) {
    const userMessage: MessageResponse = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setStreaming(true);
    setStreamingContent('');

    let accumulated = '';

    try {
      for await (const token of conversationApi.sendMessage(conversationId, content)) {
        accumulated += token;
        setStreamingContent(accumulated);
      }

      const assistantMessage: MessageResponse = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: accumulated,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      setError(e instanceof Error ? e.message : '메시지 전송 중 오류가 발생했습니다.');
    } finally {
      setStreamingContent('');
      setStreaming(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error && !conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="h-14 flex items-center justify-between px-4 border-b border-zinc-800 bg-zinc-950 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/conversations"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <p className="text-sm font-semibold text-white leading-none">
              {conversation?.title}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">{conversation?.characterName}</p>
          </div>
        </div>

        {conversation?.characterId && (
          <Link
            href={`/characters/${conversation.characterId}/memories`}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Brain size={14} />
            기억
          </Link>
        )}
      </header>

      {error && (
        <div className="shrink-0 mx-4 mt-3 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      <MessageList
        messages={messages}
        streamingContent={streaming ? streamingContent : undefined}
        characterName={conversation?.characterName}
      />

      <MessageInput onSend={handleSend} disabled={streaming} />
    </div>
  );
}
