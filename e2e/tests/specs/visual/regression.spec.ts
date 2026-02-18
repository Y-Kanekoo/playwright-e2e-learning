import { test, expect } from '../../fixtures/auth.fixture';

test.describe('ビジュアルリグレッション', () => {
  test('ログインページのスクリーンショット', async ({ page }) => {
    // ログアウトしてログインページを表示
    await page.getByTestId('btn-logout').click();
    await expect(page).toHaveURL('/login');

    // スクリーンショット比較
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('タスクボードのスクリーンショット', async ({ page }) => {
    await expect(page.getByTestId('task-board')).toBeVisible();

    // スクリーンショット比較
    await expect(page).toHaveScreenshot('task-board.png', {
      maxDiffPixelRatio: 0.01,
    });
  });
});
