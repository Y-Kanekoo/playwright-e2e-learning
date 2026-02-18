import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskApi, userApi } from '../services/api';
import type { Task, TaskStatus, TaskPriority, User, UpdateTaskRequest } from '../types';

/** タスク詳細ページ */
export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 編集フォームの状態
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /** タスク詳細を取得 */
  const fetchTask = useCallback(async () => {
    if (!id) return;
    try {
      const data = await taskApi.getById(Number(id));
      setTask(data);
      // フォームに値をセット
      setTitle(data.title);
      setDescription(data.description);
      setStatus(data.status);
      setPriority(data.priority);
      setAssigneeId(data.assignee ? String(data.assignee.id) : '');
      setDueDate(data.dueDate ?? '');
    } catch {
      setError('タスクの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

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
    fetchTask();
    fetchUsers();
  }, [fetchTask, fetchUsers]);

  /** タスクを更新 */
  const handleSave = async () => {
    if (!id) return;

    if (!title.trim()) {
      setFormError('タイトルを入力してください');
      return;
    }

    setIsSaving(true);
    setFormError('');
    setSuccessMessage('');

    try {
      const request: UpdateTaskRequest = {
        title,
        description,
        status,
        priority,
        assigneeId: assigneeId ? Number(assigneeId) : undefined,
        dueDate: dueDate || undefined,
      };
      const updated = await taskApi.update(Number(id), request);
      setTask(updated);
      setSuccessMessage('タスクを更新しました');
      // 3秒後にメッセージを消す
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setFormError('タスクの更新に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  /** タスクを削除 */
  const handleDelete = async () => {
    if (!id) return;

    try {
      await taskApi.delete(Number(id));
      navigate('/tasks', { replace: true });
    } catch {
      setFormError('タスクの削除に失敗しました');
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error || 'タスクが見つかりません'}</p>
          <button
            onClick={() => navigate('/tasks')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            タスクボードに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="task-detail"
      className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* 戻るリンク */}
      <button
        onClick={() => navigate('/tasks')}
        className="mb-4 text-sm text-indigo-600 hover:text-indigo-500"
      >
        &larr; タスクボードに戻る
      </button>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-bold text-gray-900">タスク詳細</h2>

        {/* 成功メッセージ */}
        {successMessage && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* エラーメッセージ */}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-title"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* 説明 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-description"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              rows={4}
            />
          </div>

          {/* ステータスと優先度 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                ステータス
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                data-testid="select-status"
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
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                data-testid="select-priority"
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
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              data-testid="select-assignee"
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
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              data-testid="input-duedate"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* メタ情報 */}
          <div className="rounded-md bg-gray-50 p-4">
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-500 sm:grid-cols-2">
              <p>作成者: {task.creator.displayName}</p>
              <p>作成日: {task.createdAt}</p>
              <p>更新日: {task.updatedAt}</p>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            data-testid="btn-delete"
            className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
          >
            削除
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            data-testid="btn-save"
            className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {/* 削除確認ダイアログ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              タスクの削除
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              「{task.title}」を削除しますか？この操作は取り消せません。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                data-testid="btn-delete-cancel"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                data-testid="btn-delete-confirm"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
