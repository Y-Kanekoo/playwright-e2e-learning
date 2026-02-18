import { type Page, type Locator } from '@playwright/test';

/**
 * ユーザー一覧ページの Page Object
 */
export class UserListPage {
  readonly page: Page;
  readonly userList: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userList = page.getByTestId('user-list');
    this.searchInput = page.getByTestId('search-input');
  }

  /** ユーザー一覧ページに遷移 */
  async goto() {
    await this.page.goto('/users');
  }

  /** 特定IDのユーザー行を取得 */
  getUserRow(userId: number): Locator {
    return this.page.getByTestId(`user-row-${userId}`);
  }

  /** ユーザーを検索 */
  async search(query: string) {
    await this.searchInput.fill(query);
  }

  /** 表示されているユーザー数を取得 */
  async getUserCount(): Promise<number> {
    return await this.userList.getByTestId(/^user-row-/).count();
  }
}
