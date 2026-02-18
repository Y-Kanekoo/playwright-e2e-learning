import { test as base } from './index';

/**
 * 認証済み状態のフィクスチャ
 * テスト前にログインを完了させ、認証状態を保持
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // ログインページに遷移
    await page.goto('/login');

    // デフォルトユーザーでログイン
    await page.getByTestId('input-username').fill('user');
    await page.getByTestId('input-password').fill('user123');
    await page.getByTestId('btn-login').click();

    // タスクボードに遷移するまで待機
    await page.waitForURL('/tasks');

    await use(page);
  },
});

export { expect } from '@playwright/test';
