import { apiFetch } from './client';
import type { CharacterResponse, CharacterSummary } from '../types';

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body.message ?? fallback;
  } catch {
    return fallback;
  }
}

export const characterApi = {
  async list(): Promise<CharacterSummary[]> {
    const res = await apiFetch('/api/characters');
    if (!res.ok) throw new Error(await parseError(res, '캐릭터 목록을 불러오는데 실패했습니다.'));
    return res.json();
  },

  async get(id: string): Promise<CharacterResponse> {
    const res = await apiFetch(`/api/characters/${id}`);
    if (!res.ok) throw new Error(await parseError(res, '캐릭터를 불러오는데 실패했습니다.'));
    return res.json();
  },

  async create(name: string, personaDescription: string, files?: File[]): Promise<CharacterResponse> {
    const params = new URLSearchParams({ name, personaDescription });
    const formData = new FormData();
    files?.forEach((f) => formData.append('files', f));

    const res = await apiFetch(`/api/characters?${params}`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(await parseError(res, '캐릭터 생성에 실패했습니다.'));
    return res.json();
  },

  async update(
    id: string,
    name: string,
    personaDescription: string,
    files?: File[],
  ): Promise<CharacterResponse> {
    const params = new URLSearchParams({ name, personaDescription });
    const formData = new FormData();
    files?.forEach((f) => formData.append('files', f));

    const res = await apiFetch(`/api/characters/${id}?${params}`, {
      method: 'PUT',
      body: formData,
    });
    if (!res.ok) throw new Error(await parseError(res, '캐릭터 수정에 실패했습니다.'));
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await apiFetch(`/api/characters/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await parseError(res, '캐릭터 삭제에 실패했습니다.'));
  },
};
