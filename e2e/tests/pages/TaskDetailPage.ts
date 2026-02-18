import { type Page, type Locator } from '@playwright/test';

/**
 * タスク詳細/編集ページの Page Object
 */
export class TaskDetailPage {
  readonly page: Page;
  readonly detail: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly statusSelect: Locator;
  readonly prioritySelect: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.detail = page.getByTestId('task-detail');
    this.titleInput = page.getByTestId('input-title');
    this.descriptionInput = page.getByTestId('input-description');
    this.statusSelect = page.getByTestId('select-status');
    this.prioritySelect = page.getByTestId('select-priority');
    this.saveButton = page.getByTestId('btn-save');
    this.deleteButton = page.getByTestId('btn-delete');
  }

  /** タスク詳細ページに遷移 */
  async goto(taskId: number) {
    await this.page.goto(`/tasks/${taskId}`);
  }

  /** タスクのタイトルを編集 */
  async editTitle(title: string) {
    await this.titleInput.clear();
    await this.titleInput.fill(title);
  }

  /** タスクの説明を編集 */
  async editDescription(description: string) {
    await this.descriptionInput.clear();
    await this.descriptionInput.fill(description);
  }

  /** ステータスを変更 */
  async changeStatus(status: 'TODO' | 'IN_PROGRESS' | 'DONE') {
    await this.statusSelect.selectOption(status);
  }

  /** 優先度を変更 */
  async changePriority(priority: 'LOW' | 'MEDIUM' | 'HIGH') {
    await this.prioritySelect.selectOption(priority);
  }

  /** 保存 */
  async save() {
    await this.saveButton.click();
  }

  /** 削除（確認ダイアログ対応） */
  async deleteTask() {
    this.page.on('dialog', (dialog) => dialog.accept());
    await this.deleteButton.click();
  }
}
