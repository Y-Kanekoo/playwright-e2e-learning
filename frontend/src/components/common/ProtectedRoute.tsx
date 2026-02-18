import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/AuthContext';
import type { ReactNode } from 'react';

/** ProtectedRouteのProps */
interface ProtectedRouteProps {
  children: ReactNode;
}

/** 保護されたルートコンポーネント: 未認証の場合はログインページにリダイレクト */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
