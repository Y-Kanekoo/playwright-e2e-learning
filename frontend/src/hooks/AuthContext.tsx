import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from './useAuth';
import type { AuthContextType } from '../types';

/** 認証コンテキスト */
const AuthContext = createContext<AuthContextType | null>(null);

/** 認証コンテキストを使用するフック */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContextはAuthProvider内で使用してください');
  }
  return context;
}

/** 認証プロバイダーのProps */
interface AuthProviderProps {
  children: ReactNode;
}

/** 認証プロバイダー */
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
