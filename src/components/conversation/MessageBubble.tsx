import type { MessageResponse } from '@/lib/types';

interface MessageBubbleProps {
  message: MessageResponse;
  characterName?: string;
}

export default function MessageBubble({ message, characterName }: MessageBubbleProps) {
  const isUser = message.role.toLowerCase() === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="h-8 w-8 shrink-0 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs font-semibold text-violet-300">
          {(characterName ?? 'AI')[0].toUpperCase()}
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-violet-600 text-white rounded-tr-sm'
            : 'bg-zinc-800 text-zinc-100 rounded-tl-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export function StreamingBubble({
  content,
  characterName,
}: {
  content: string;
  characterName?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 shrink-0 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs font-semibold text-violet-300">
        {(characterName ?? 'AI')[0].toUpperCase()}
      </div>
      <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-zinc-800 px-4 py-2.5 text-sm leading-relaxed text-zinc-100 whitespace-pre-wrap">
        {content}
        <span className="inline-block h-4 w-0.5 ml-0.5 bg-zinc-400 animate-pulse align-middle" />
      </div>
    </div>
  );
}
