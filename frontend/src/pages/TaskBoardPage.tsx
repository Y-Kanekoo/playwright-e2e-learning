import { useState, useEffect, useCallback } from 'react';
import { taskApi, userApi } from '../services/api';
import type { Task, TaskStatus, TaskPriority, User, CreateTaskRequest } from '../types';

/** 優先度のラベルと色を返す */
function getPriorityBadge(priority: TaskPriority) {
  switch (priority) {
    case 'HIGH':
      return { label: '高', className: 'bg-red-100 text-red-700' };
    case 'MEDIUM':
      return { label: '中', className: 'bg-yellow-100 text-yellow-700' };
    case 'LOW':
      return { label: '低', className: 'bg-green-100 text-green-700' };
  }
}

/** ステータスのラベルを返す */
function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case 'TODO':
      return '未着手';
    case 'IN_PROGRESS':
      return '進行中';
    case 'DONE':
      return '完了';
  }
}

/** カラムの背景色を返す */
function getColumnColor(status: TaskStatus): string {
  switch (status) {
    case 'TODO':
      return 'bg-gray-100';
    case 'IN_PROGRESS':
      return 'bg-blue-50';
    case 'DONE':
      return 'bg-green-50';
  }
}

/** カラムのdata-testidを返す */
function getColumnTestId(status: TaskStatus): string {
  switch (status) {
    case 'TODO':
      return 'column-todo';
    case 'IN_PROGRESS':
      return 'column-in-progress';
    case 'DONE':
      return 'column-done';
  }
}

/** タスクボードページ */
export function TaskBoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 新規タスクフォームの状態
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<TaskStatus>('TODO');
  const [newPriority, setNewPriority] = useState<TaskPriority>('MEDIUM');
  const [newAssigneeId, setNewAssigneeId] = useState<string>('');
  const [newDueDate, setNewDueDate] = useState('');
  const [formError, setFormError] = useState('');

  /** タスク一覧を取得 */
  const fetchTasks = useCallback(async () => {
    try {
      const data = await taskApi.getAll();
      setTasks(data);
    } catch {
      setError('タスクの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** ユーザー一覧を取得 */
  const fetchUsers = useCallback(async () => {
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch {
      // ユーザー取得失敗は致命的ではないため無視
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  /** ステータスごとにタスクをフィルタリング */
  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter((task) => task.status === status);
  };

  /** モーダルを開く */
  const openModal = () => {
    setNewTitle('');
    setNewDescription('');
    setNewStatus('TODO');
    setNewPriority('MEDIUM');
    setNewAssigneeId('');
    setNewDueDate('');
    setFormError('');
    setIsModalOpen(true);
  };

  /** モーダルを閉じる */
  const closeModal = () => {
    setIsModalOpen(false);
  };

  /** タスクを作成 */
  const handleCreateTask = async () => {
    if (!newTitle.trim()) {
      setFormError('タイトルを入力してください');
      return;
    }

    try {
      const request: CreateTaskRequest = {
        title: newTitle,
        description: newDescription,
        status: newStatus,
        priority: newPriority,
        assigneeId: newAssigneeId ? Number(newAssigneeId) : undefined,
        dueDate: newDueDate || undefined,
      };
      await taskApi.create(request);
      setIsModalOpen(false);
      await fetchTasks();
    } catch {
      setFormError('タスクの作成に失敗しました');
    }
  };

  /** タスクカードをクリックして詳細ページへ遷移 */
  const handleTaskClick = (taskId: number) => {
    window.location.href = `/tasks/${taskId}`;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

  return (
    <div data-testid="task-board" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ヘッダー部分 */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">タスクボード</h2>
        <button
          onClick={openModal}
          data-testid="btn-add-task"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          + 新規タスク
        </button>
      </div>

      {/* カンバンボード */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statuses.map((status) => (
          <div
            key={status}
            data-testid={getColumnTestId(status)}
            className={`rounded-lg p-4 ${getColumnColor(status)}`}
          >
            {/* カラムヘッダー */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {getStatusLabel(status)}
              </h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-600">
                {getTasksByStatus(status).length}
              </span>
            </div>

            {/* タスクカード一覧 */}
            <div className="space-y-3">
              {getTasksByStatus(status).map((task) => {
                const badge = getPriorityBadge(task.priority);
                return (
                  <div
                    key={task.id}
                    data-testid={`task-card-${task.id}`}
                    onClick={() => handleTaskClick(task.id)}
                    className="cursor-pointer rounded-md bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* タイトル */}
                    <h4 className="mb-2 text-sm font-medium text-gray-900">
                      {task.title}
                    </h4>

                    {/* 優先度バッジ・担当者 */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      {task.assignee && (
                        <span className="text-xs text-gray-500">
                          {task.assignee.displayName}
                        </span>
                      )}
                    </div>

                    {/* 期限 */}
                    {task.dueDate && (
                      <p className="mt-2 text-xs text-gray-400">
                        期限: {task.dueDate}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* タスクがない場合 */}
              {getTasksByStatus(status).length === 0 && (
                <p className="py-4 text-center text-sm text-gray-400">
                  タスクはありません
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 新規タスク作成モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              新規タスク作成
            </h3>

            {/* フォームエラー */}
            {formError && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              {/* タイトル */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  タイトル
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  data-testid="modal-input-title"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="タスクタイトル"
                />
              </div>

              {/* 説明 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  説明
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  data-testid="modal-input-description"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  rows={3}
                  placeholder="タスクの説明"
                />
              </div>

              {/* ステータスと優先度 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    ステータス
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                    data-testid="modal-select-status"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="TODO">未着手</option>
                    <option value="IN_PROGRESS">進行中</option>
                    <option value="DONE">完了</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    優先度
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    data-testid="modal-select-priority"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="LOW">低</option>
                    <option value="MEDIUM">中</option>
                    <option value="HIGH">高</option>
                  </select>
                </div>
              </div>

              {/* 担当者 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  担当者
                </label>
                <select
                  value={newAssigneeId}
                  onChange={(e) => setNewAssigneeId(e.target.value)}
                  data-testid="modal-select-assignee"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">未割り当て</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName}
                    </option>
                  ))}
                </select>
              </div>

              {/* 期限 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  期限
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  data-testid="modal-input-duedate"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* ボタン */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                data-testid="modal-btn-cancel"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleCreateTask}
                data-testid="modal-btn-create"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                作成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
