import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TaskBoardPage } from '../pages/TaskBoardPage';
import { TaskDetailPage } from '../pages/TaskDetailPage';
import { UserListPage } from '../pages/UserListPage';

/**
 * カスタムフィクスチャ定義
 * 各Page Objectを自動的にインスタンス化して提供
 */
interface PageFixtures {
  loginPage: LoginPage;
  taskBoardPage: TaskBoardPage;
  taskDetailPage: TaskDetailPage;
  userListPage: UserListPage;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  taskBoardPage: async ({ page }, use) => {
    await use(new TaskBoardPage(page));
  },
  taskDetailPage: async ({ page }, use) => {
    await use(new TaskDetailPage(page));
  },
  userListPage: async ({ page }, use) => {
    await use(new UserListPage(page));
  },
});

export { expect } from '@playwright/test';
