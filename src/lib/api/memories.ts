import { apiFetch } from './client';
import type { MemoryResponse } from '../types';

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body.message ?? fallback;
  } catch {
    return fallback;
  }
}

export const memoryApi = {
  async list(characterId: string, type?: string): Promise<MemoryResponse[]> {
    const qs = type ? `?type=${encodeURIComponent(type)}` : '';
    const res = await apiFetch(`/api/characters/${characterId}/memories${qs}`);
    if (!res.ok) throw new Error(await parseError(res, '기억 목록을 불러오는데 실패했습니다.'));
    return res.json();
  },

  async delete(characterId: string, memoryId: string): Promise<void> {
    const res = await apiFetch(`/api/characters/${characterId}/memories/${memoryId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(await parseError(res, '기억 삭제에 실패했습니다.'));
  },
};
