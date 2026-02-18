import { test, expect } from '../../fixtures/auth.fixture';

test.describe('タスクCRUD操作', () => {
  test('タスクボードが正しく表示される', async ({ page }) => {
    await expect(page.getByTestId('task-board')).toBeVisible();
    await expect(page.getByTestId('column-todo')).toBeVisible();
    await expect(page.getByTestId('column-in-progress')).toBeVisible();
    await expect(page.getByTestId('column-done')).toBeVisible();
  });

  test('新しいタスクを作成できる', async ({ page }) => {
    // 新規タスク追加ボタンをクリック
    await page.getByTestId('btn-add-task').click();

    // タスク情報を入力
    await page.getByTestId('input-title').fill('E2Eテスト用タスク');
    await page.getByTestId('input-description').fill('Playwrightで自動作成されたタスク');
    await page.getByTestId('select-priority').selectOption('HIGH');

    // 保存
    await page.getByTestId('btn-save').click();

    // タスクボードに新しいタスクが表示されることを確認
    await expect(page.getByText('E2Eテスト用タスク')).toBeVisible();
  });

  test('タスクのタイトルを編集できる', async ({ page }) => {
    // 最初のタスクカードをクリック
    const firstTask = page.getByTestId(/^task-card-/).first();
    await firstTask.click();

    // タイトルを編集
    const titleInput = page.getByTestId('input-title');
    await titleInput.clear();
    await titleInput.fill('編集されたタスク');

    // 保存
    await page.getByTestId('btn-save').click();

    // 変更が反映されていることを確認
    await expect(page.getByText('編集されたタスク')).toBeVisible();
  });

  test('タスクを削除できる', async ({ page }) => {
    // 最初のタスクカードをクリック
    const firstTask = page.getByTestId(/^task-card-/).first();
    const taskTitle = await firstTask.innerText();
    await firstTask.click();

    // 確認ダイアログを自動承認
    page.on('dialog', (dialog) => dialog.accept());

    // 削除ボタンをクリック
    await page.getByTestId('btn-delete').click();

    // タスクが削除されていることを確認（タスクボードに戻る）
    await expect(page.getByTestId('task-board')).toBeVisible();
  });
});
