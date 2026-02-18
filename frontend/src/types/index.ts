/** ユーザーのロール */
export type UserRole = 'ADMIN' | 'USER';

/** タスクのステータス */
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

/** タスクの優先度 */
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

/** ユーザー型 */
export interface User {
  id: number;
  username: string;
  displayName: string;
  role: UserRole;
}

/** タスク型 */
export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  creator: User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

/** 認証レスポンス */
export interface AuthResponse {
  token: string;
  username: string;
  displayName: string;
  role: string;
}

/** ログインリクエスト */
export interface LoginRequest {
  username: string;
  password: string;
}

/** ユーザー登録リクエスト */
export interface RegisterRequest {
  username: string;
  password: string;
  displayName: string;
}

/** タスク作成リクエスト */
export interface CreateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: number;
  dueDate?: string;
}

/** タスク更新リクエスト */
export interface UpdateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: number;
  dueDate?: string;
}

/** 認証コンテキストの型 */
export interface AuthContextType {
  token: string | null;
  username: string | null;
  displayName: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
