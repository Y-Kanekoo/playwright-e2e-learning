import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';
import { Header } from './components/common/Header';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { TaskBoardPage } from './pages/TaskBoardPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { UserListPage } from './pages/UserListPage';

/** 認証済みユーザー用レイアウト */
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{children}</main>
    </div>
  );
}

/** アプリケーションのルート */
function AppRoutes() {
  return (
    <Routes>
      {/* ログインページ（認証不要） */}
      <Route path="/login" element={<LoginPage />} />

      {/* 保護されたルート */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <TaskBoardPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <TaskDetailPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <UserListPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* ルートパスはタスクボードにリダイレクト */}
      <Route path="/" element={<Navigate to="/tasks" replace />} />

      {/* 不明なパスはタスクボードにリダイレクト */}
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}

/** アプリケーションコンポーネント */
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
