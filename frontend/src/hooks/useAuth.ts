import { useState, useCallback } from 'react';
import { authApi } from '../services/api';

/** ローカルストレージから認証情報を読み込む */
function loadAuthState() {
  return {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    displayName: localStorage.getItem('displayName'),
    role: localStorage.getItem('role'),
  };
}

/** 認証状態管理フック */
export function useAuth() {
  const [authState, setAuthState] = useState(loadAuthState);

  /** ログイン処理 */
  const login = useCallback(async (username: string, password: string) => {
    const response = await authApi.login({ username, password });

    // ローカルストレージに保存
    localStorage.setItem('token', response.token);
    localStorage.setItem('username', response.username);
    localStorage.setItem('displayName', response.displayName);
    localStorage.setItem('role', response.role);

    setAuthState({
      token: response.token,
      username: response.username,
      displayName: response.displayName,
      role: response.role,
    });
  }, []);

  /** ログアウト処理 */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('displayName');
    localStorage.removeItem('role');

    setAuthState({
      token: null,
      username: null,
      displayName: null,
      role: null,
    });
  }, []);

  /** 認証済みかどうか */
  const isAuthenticated = authState.token !== null;

  return {
    ...authState,
    isAuthenticated,
    login,
    logout,
  };
}
