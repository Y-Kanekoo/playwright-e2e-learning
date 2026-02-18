import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/AuthContext';

/** ヘッダーコンポーネント */
export function Header() {
  const { displayName, logout } = useAuthContext();
  const navigate = useNavigate();

  /** ログアウト処理 */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      data-testid="header"
      className="bg-indigo-600 text-white shadow-lg"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ロゴ・タイトル */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold sm:text-xl">タスクボード</h1>
          </div>

          {/* ナビゲーション */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/tasks"
              data-testid="nav-tasks"
              className="text-sm font-medium text-indigo-100 transition-colors hover:text-white sm:text-base"
            >
              タスクボード
            </Link>
            <Link
              to="/users"
              data-testid="nav-users"
              className="text-sm font-medium text-indigo-100 transition-colors hover:text-white sm:text-base"
            >
              ユーザー一覧
            </Link>
          </nav>

          {/* ユーザー情報・ログアウト */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden text-sm text-indigo-100 sm:inline">
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              data-testid="btn-logout"
              className="rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
