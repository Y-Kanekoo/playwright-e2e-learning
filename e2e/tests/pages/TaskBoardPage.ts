import { type Page, type Locator } from '@playwright/test';

/**
 * タスクボードページの Page Object
 */
export class TaskBoardPage {
  readonly page: Page;
  readonly board: Locator;
  readonly columnTodo: Locator;
  readonly columnInProgress: Locator;
  readonly columnDone: Locator;
  readonly addTaskButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.board = page.getByTestId('task-board');
    this.columnTodo = page.getByTestId('column-todo');
    this.columnInProgress = page.getByTestId('column-in-progress');
    this.columnDone = page.getByTestId('column-done');
    this.addTaskButton = page.getByTestId('btn-add-task');
  }

  /** タスクボードページに遷移 */
  async goto() {
    await this.page.goto('/tasks');
  }

  /** 特定IDのタスクカードを取得 */
  getTaskCard(taskId: number): Locator {
    return this.page.getByTestId(`task-card-${taskId}`);
  }

  /** 新規タスク追加ボタンをクリック */
  async clickAddTask() {
    await this.addTaskButton.click();
  }

  /** 各カラムのタスク数を取得 */
  async getColumnTaskCounts(): Promise<{ todo: number; inProgress: number; done: number }> {
    const todo = await this.columnTodo.getByTestId(/^task-card-/).count();
    const inProgress = await this.columnInProgress.getByTestId(/^task-card-/).count();
    const done = await this.columnDone.getByTestId(/^task-card-/).count();
    return { todo, inProgress, done };
  }
}
