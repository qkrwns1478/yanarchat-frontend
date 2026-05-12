'use client';

import { Brain } from 'lucide-react';
import type { MemoryResponse } from '@/lib/types';
import MemoryItem from './MemoryItem';

interface MemoryListProps {
  memories: MemoryResponse[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

export default function MemoryList({ memories, onDelete, deletingId }: MemoryListProps) {
  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Brain size={36} className="text-zinc-700" />
        <p className="text-zinc-500 text-sm">아직 기억이 없습니다. 대화를 나눠보세요.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {memories.map((memory) => (
        <li key={memory.id}>
          <MemoryItem
            memory={memory}
            onDelete={onDelete}
            deleting={deletingId === memory.id}
          />
        </li>
      ))}
    </ul>
  );
}
