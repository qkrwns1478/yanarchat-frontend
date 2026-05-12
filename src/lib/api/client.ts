const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    const refreshToken =
      typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const data: { accessToken: string; refreshToken: string } = await refreshRes.json();
        accessToken = data.accessToken;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        headers.set('Authorization', `Bearer ${accessToken}`);
        res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
      } else {
        accessToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }

  return res;
}
