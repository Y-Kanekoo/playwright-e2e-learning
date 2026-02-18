import { test, expect } from '../../fixtures/auth.fixture';

test.describe('ログアウト機能', () => {
  test('ログアウトするとログインページに遷移する', async ({ page }) => {
    // ログアウトボタンをクリック
    await page.getByTestId('btn-logout').click();

    // ログインページに遷移することを確認
    await expect(page).toHaveURL('/login');
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('ログアウト後にタスクページにアクセスするとログインページにリダイレクトされる', async ({ page }) => {
    // ログアウト
    await page.getByTestId('btn-logout').click();
    await expect(page).toHaveURL('/login');

    // タスクページに直接アクセス
    await page.goto('/tasks');

    // ログインページにリダイレクトされることを確認
    await expect(page).toHaveURL('/login');
  });
});
