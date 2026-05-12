import { apiFetch } from './client';
import type { ConversationSummary, ConversationResponse, ConversationDetail, ConversationPageResponse } from '../types';

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body.message ?? fallback;
  } catch {
    return fallback;
  }
}

export const conversationApi = {
  async list(params?: {
    characterId?: string;
    page?: number;
    size?: number;
  }): Promise<ConversationSummary[]> {
    const qs = new URLSearchParams();
    if (params?.characterId) qs.set('characterId', params.characterId);
    if (params?.page != null) qs.set('page', String(params.page));
    if (params?.size != null) qs.set('size', String(params.size));

    const res = await apiFetch(`/api/conversations?${qs}`);
    if (!res.ok) throw new Error(await parseError(res, '대화 목록을 불러오는데 실패했습니다.'));
    const data: ConversationPageResponse = await res.json();
    return data.content;
  },

  async create(characterId: string, title: string): Promise<ConversationResponse> {
    const res = await apiFetch('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ characterId, title }),
    });
    if (!res.ok) throw new Error(await parseError(res, '대화 생성에 실패했습니다.'));
    return res.json();
  },

  async get(
    id: string,
    params?: { page?: number; size?: number },
  ): Promise<ConversationDetail> {
    const qs = new URLSearchParams();
    if (params?.page != null) qs.set('page', String(params.page));
    if (params?.size != null) qs.set('size', String(params.size));

    const res = await apiFetch(`/api/conversations/${id}?${qs}`);
    if (!res.ok) throw new Error(await parseError(res, '대화를 불러오는데 실패했습니다.'));
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await apiFetch(`/api/conversations/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await parseError(res, '대화 삭제에 실패했습니다.'));
  },

  async *sendMessage(conversationId: string, content: string): AsyncGenerator<string> {
    const res = await apiFetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { Accept: 'text/event-stream' },
      body: JSON.stringify({ content }),
    });

    if (!res.ok || !res.body) {
      throw new Error(await parseError(res, '메시지 전송에 실패했습니다.'));
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            if (data === '[DONE]') return;
            if (data) yield data;
          }
        }
      }

      if (buffer.startsWith('data:')) {
        const data = buffer.slice(5).trim();
        if (data && data !== '[DONE]') yield data;
      }
    } finally {
      reader.releaseLock();
    }
  },
};
