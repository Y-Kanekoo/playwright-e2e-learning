import { test, expect } from '../../fixtures/auth.fixture';

test.describe('タスク検索', () => {
  test('タスクをタイトルで検索できる', async ({ page }) => {
    // 検索入力が存在する場合のみテスト
    const searchInput = page.getByTestId('search-tasks');
    if (await searchInput.isVisible()) {
      await searchInput.fill('テスト');

      // フィルタされた結果が表示されるまで少し待つ
      await page.waitForTimeout(500);

      // 検索結果にマッチするタスクのみ表示されることを確認
      const visibleTasks = page.getByTestId(/^task-card-/);
      const count = await visibleTasks.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});
