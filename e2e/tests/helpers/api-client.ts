import type { APIRequestContext } from '@playwright/test';

const BASE_URL = 'http://localhost:8080/api';

/**
 * テストデータ操作用APIクライアント
 * テストのセットアップ/クリーンアップでAPI経由でデータを操作
 */
export class ApiClient {
  private request: APIRequestContext;
  private token: string = '';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /** 認証トークンを取得 */
  async authenticate(username: string = 'admin', password: string = 'admin123') {
    const response = await this.request.post(`${BASE_URL}/auth/login`, {
      data: { username, password },
    });
    const body = await response.json();
    this.token = body.token;
  }

  /** タスクを作成 */
  async createTask(data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
  }) {
    const response = await this.request.post(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: {
        title: data.title,
        description: data.description ?? '',
        status: data.status ?? 'TODO',
        priority: data.priority ?? 'MEDIUM',
      },
    });
    return response.json();
  }

  /** タスクを削除 */
  async deleteTask(taskId: number) {
    await this.request.delete(`${BASE_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  /** 全タスクを取得 */
  async getTasks() {
    const response = await this.request.get(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return response.json();
  }
}
