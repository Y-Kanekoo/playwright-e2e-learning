import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../services/api';
import type { User } from '../types';

/** ユーザー一覧ページ */
export function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  /** ユーザー一覧を取得 */
  const fetchUsers = useCallback(async () => {
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch {
      setError('ユーザーの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /** 検索フィルター適用後のユーザー一覧 */
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) ||
      user.displayName.toLowerCase().includes(query)
    );
  });

  /** ロールの日本語表示 */
  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'ADMIN':
        return '管理者';
      case 'USER':
        return 'ユーザー';
      default:
        return role;
    }
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

  return (
    <div
      data-testid="user-list"
      className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* ヘッダー部分 */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          ユーザー一覧
        </h2>

        {/* 検索フィルター */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="search-input"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            placeholder="ユーザーを検索..."
          />
        </div>
      </div>

      {/* ユーザーテーブル */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ユーザー名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                表示名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ロール
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                data-testid={`user-row-${user.id}`}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                  {user.displayName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </td>
              </tr>
            ))}

            {/* 結果がない場合 */}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-gray-400"
                >
                  {searchQuery
                    ? '検索条件に一致するユーザーが見つかりません'
                    : 'ユーザーがいません'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 件数表示 */}
      <div className="mt-4 text-right text-sm text-gray-500">
        {filteredUsers.length} / {users.length} 件
      </div>
    </div>
  );
}
