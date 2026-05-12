'use client';

import { useEffect, useRef } from 'react';
import type { MessageResponse } from '@/lib/types';
import MessageBubble, { StreamingBubble } from './MessageBubble';

interface MessageListProps {
  messages: MessageResponse[];
  streamingContent?: string;
  characterName?: string;
}

export default function MessageList({ messages, streamingContent, characterName }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  if (messages.length === 0 && !streamingContent) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-zinc-600">첫 번째 메시지를 보내 대화를 시작하세요.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} characterName={characterName} />
        ))}
        {streamingContent !== undefined && streamingContent !== '' && (
          <StreamingBubble content={streamingContent} characterName={characterName} />
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
