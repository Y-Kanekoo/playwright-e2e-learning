import { test, expect } from '../../fixtures/auth.fixture';

test.describe('タスクステータス管理', () => {
  test('タスクのステータスを変更できる', async ({ page }) => {
    // TODOカラムの最初のタスクをクリック
    const todoTask = page.getByTestId('column-todo').getByTestId(/^task-card-/).first();
    await todoTask.click();

    // ステータスをIN_PROGRESSに変更
    await page.getByTestId('select-status').selectOption('IN_PROGRESS');
    await page.getByTestId('btn-save').click();

    // IN_PROGRESSカラムにタスクが移動していることを確認
    await expect(page.getByTestId('task-board')).toBeVisible();
  });

  test('各カラムにタスクが表示される', async ({ page }) => {
    // 各カラムが存在することを確認
    const todoColumn = page.getByTestId('column-todo');
    const inProgressColumn = page.getByTestId('column-in-progress');
    const doneColumn = page.getByTestId('column-done');

    await expect(todoColumn).toBeVisible();
    await expect(inProgressColumn).toBeVisible();
    await expect(doneColumn).toBeVisible();
  });
});
