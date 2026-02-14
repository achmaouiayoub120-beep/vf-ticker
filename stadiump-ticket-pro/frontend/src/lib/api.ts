/**
 * Base URL for API requests.
 * En production (Vercel), définir VITE_API_URL dans les variables d'environnement.
 */
export function getApiUrl(): string {
  const url = import.meta.env.VITE_API_URL;
  if (url) return url.replace(/\/$/, '');
  if (typeof window !== 'undefined') return '';
  return '';
}

export function api(path: string, init?: RequestInit): Promise<Response> {
  const base = getApiUrl();
  const url = path.startsWith('http') ? path : `${base}${path}`;
  return fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    credentials: 'include',
  });
}
