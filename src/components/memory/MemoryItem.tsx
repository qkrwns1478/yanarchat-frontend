'use client';

import { Trash2 } from 'lucide-react';
import type { MemoryResponse } from '@/lib/types';
import Button from '@/components/ui/Button';

interface MemoryItemProps {
  memory: MemoryResponse;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

export default function MemoryItem({ memory, onDelete, deleting }: MemoryItemProps) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 hover:border-zinc-700 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-100 leading-relaxed">{memory.content}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {memory.memoryType}
          </span>
          <span className="text-xs text-zinc-600">
            {new Date(memory.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        loading={deleting}
        onClick={() => onDelete(memory.id)}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-opacity shrink-0"
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );
}
