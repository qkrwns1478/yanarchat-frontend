'use client';

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { setAccessToken } from '@/lib/api/client';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

type State = { isAuthenticated: boolean; isLoading: boolean };
type Action =
  | { type: 'INIT'; authenticated: boolean }
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case 'INIT':
      return { isAuthenticated: action.authenticated, isLoading: false };
    case 'LOGIN':
      return { isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { isAuthenticated: false, isLoading: false };
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ isAuthenticated, isLoading }, dispatch] = useReducer(reducer, {
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    }
    dispatch({ type: 'INIT', authenticated: !!token });
  }, []);

  function login(accessToken: string, refreshToken: string) {
    setAccessToken(accessToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    dispatch({ type: 'LOGIN' });
  }

  function logout() {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
