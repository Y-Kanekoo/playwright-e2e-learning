import { test, expect } from '../../fixtures/index';

test.describe('ログイン機能', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('正しい認証情報でログインできる', async ({ loginPage, page }) => {
    await loginPage.login('user', 'user123');

    // タスクボードページに遷移することを確認
    await expect(page).toHaveURL('/tasks');
    await expect(page.getByTestId('task-board')).toBeVisible();
  });

  test('間違ったパスワードでエラーが表示される', async ({ loginPage }) => {
    await loginPage.login('user', 'wrong-password');

    // エラーメッセージが表示されることを確認
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('ユーザー名が空の場合エラーが表示される', async ({ loginPage }) => {
    await loginPage.login('', 'password');

    // バリデーションエラーが表示されることを確認
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('パスワードが空の場合エラーが表示される', async ({ loginPage }) => {
    await loginPage.login('user', '');

    // バリデーションエラーが表示されることを確認
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('ログインフォームが正しく表示される', async ({ loginPage }) => {
    await expect(loginPage.loginForm).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
