import { apiFetch, setAccessToken } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body.message ?? fallback;
  } catch {
    return fallback;
  }
}

export const authApi = {
  async login(data: LoginRequest): Promise<TokenResponse> {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseError(res, '이메일 또는 비밀번호가 올바르지 않습니다.'));
    return res.json();
  },

  async signup(data: SignupRequest): Promise<TokenResponse> {
    const res = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseError(res, '회원가입에 실패했습니다.'));
    return res.json();
  },

  async logout(): Promise<void> {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    setAccessToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
};
