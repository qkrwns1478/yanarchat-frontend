'use client';

import { FormEvent, useState, useRef, KeyboardEvent } from 'react';
import { SendHorizonal } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const content = value.trim();
    if (!content || disabled) return;
    onSend(content);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto flex items-end gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 focus-within:border-violet-500 transition-colors"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:opacity-50 py-1.5 max-h-[200px] overflow-y-auto"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="shrink-0 h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mb-0.5"
        >
          <SendHorizonal size={15} />
        </button>
      </form>
      <p className="text-center text-xs text-zinc-700 mt-2">
        Enter로 전송, Shift+Enter로 줄바꿈
      </p>
    </div>
  );
}
