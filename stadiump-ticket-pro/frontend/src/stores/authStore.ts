const TOKEN_KEY = 'stadium_access_token';

export function useAuthStore() {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const setToken = (t: string | null) => {
    if (typeof window === 'undefined') return;
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  };
  const logout = () => setToken(null);
  return { token, setToken, logout, isLoggedIn: !!token };
}

export function getAuthToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
}
