import { type Page, type Locator } from '@playwright/test';

/**
 * ログインページの Page Object
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginForm = page.getByTestId('login-form');
    this.usernameInput = page.getByTestId('input-username');
    this.passwordInput = page.getByTestId('input-password');
    this.loginButton = page.getByTestId('btn-login');
    this.errorMessage = page.getByTestId('error-message');
  }

  /** ログインページに遷移 */
  async goto() {
    await this.page.goto('/login');
  }

  /** ユーザー名とパスワードでログイン */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** エラーメッセージのテキストを取得 */
  async getErrorText(): Promise<string> {
    return await this.errorMessage.innerText();
  }
}
