# Playwright CLI リファレンスドキュメント

> Playwright の全コマンド、設定、API を網羅的にまとめたリファレンス。
> 対象バージョン: Playwright v1.x 系

---

## 目次

1. [Playwright CLI コマンド一覧](#1-playwright-cli-コマンド一覧)
2. [playwright.config.ts 設定リファレンス](#2-playwrightconfigts-設定リファレンス)
3. [組み込みフィクスチャ](#3-組み込みフィクスチャ)
4. [組み込みアサーション](#4-組み込みアサーション)
5. [Auto-waiting（自動待機）](#5-auto-waiting自動待機)
6. [Network Interception](#6-network-interception)
7. [Visual Comparison](#7-visual-comparison)
8. [Trace Recording](#8-trace-recording)
9. [テストライフサイクル](#9-テストライフサイクル)
10. [Playwright Inspector](#10-playwright-inspector)
11. [ロケーター選択ベストプラクティス](#11-ロケーター選択ベストプラクティス)
12. [CI/CD 設定](#12-cicd-設定)
13. [ベストプラクティス](#13-ベストプラクティス)

---

## 1. Playwright CLI コマンド一覧

### 1.1 `npx playwright test` — テスト実行

テストランナーの中核コマンド。豊富なフラグで実行を制御する。

#### 基本的な使い方

```bash
# すべてのテストを実行
npx playwright test

# 特定のファイルを実行
npx playwright test tests/login.spec.ts

# 特定のディレクトリ配下のテストを実行
npx playwright test tests/auth/

# 複数ファイルを指定
npx playwright test tests/login.spec.ts tests/signup.spec.ts
```

#### 主要フラグ一覧

| フラグ | 説明 | 例 |
|--------|------|-----|
| `--ui` | UIモードで起動（テストのウォッチ・再実行が可能） | `npx playwright test --ui` |
| `--headed` | ブラウザを表示して実行 | `npx playwright test --headed` |
| `--debug` | Playwright Inspector を起動してデバッグ | `npx playwright test --debug` |
| `--grep <regex>` | テスト名を正規表現でフィルタ | `npx playwright test --grep "ログイン"` |
| `--grep-invert <regex>` | 正規表現にマッチしないテストを実行 | `npx playwright test --grep-invert "slow"` |
| `--project <name>` | 特定のプロジェクトのみ実行 | `npx playwright test --project chromium` |
| `--workers <num>` | 並列ワーカー数を指定 | `npx playwright test --workers 4` |
| `--retries <num>` | 失敗時のリトライ回数 | `npx playwright test --retries 2` |
| `--last-failed` | 前回失敗したテストのみ再実行 | `npx playwright test --last-failed` |
| `--shard <index>/<total>` | テストを分割して実行（CI向け） | `npx playwright test --shard 1/3` |
| `--reporter <name>` | レポーター指定 | `npx playwright test --reporter html` |
| `--stop-on-failure` | 最初の失敗で停止 | `npx playwright test --stop-on-failure` |
| `--repeat-each <num>` | 各テストを N 回繰り返す | `npx playwright test --repeat-each 3` |
| `--timeout <ms>` | テストタイムアウト（ミリ秒） | `npx playwright test --timeout 60000` |
| `--output <dir>` | テスト成果物の出力先 | `npx playwright test --output ./results` |
| `--config <path>` | 設定ファイルのパス | `npx playwright test --config custom.config.ts` |
| `--global-timeout <ms>` | テストスイート全体のタイムアウト | `npx playwright test --global-timeout 600000` |
| `--list` | テストを実行せず一覧表示 | `npx playwright test --list` |
| `--pass-with-no-tests` | テストが0件でもエラーにしない | `npx playwright test --pass-with-no-tests` |
| `--update-snapshots` | スナップショットを更新 | `npx playwright test --update-snapshots` |
| `--forbid-only` | `.only` が残っていたらエラー（CI向け） | `npx playwright test --forbid-only` |
| `--fully-parallel` | すべてのテストを並列実行 | `npx playwright test --fully-parallel` |
| `--ignore-snapshots` | スナップショット比較をスキップ | `npx playwright test --ignore-snapshots` |
| `--quiet` | 出力を最小限に | `npx playwright test --quiet` |

#### 実用的なコマンド例

```bash
# UIモードで特定のテストファイルをデバッグ
npx playwright test tests/login.spec.ts --ui

# Chromium のみ、ヘッドレスモード解除で実行
npx playwright test --project chromium --headed

# 「認証」を含むテスト名を grep して、リトライ2回で実行
npx playwright test --grep "認証" --retries 2

# CI でシャーディング（3分割の1番目）
npx playwright test --shard 1/3 --reporter blob

# 前回失敗したテストのみリトライ
npx playwright test --last-failed

# ワーカー1つで逐次実行（デバッグ時に便利）
npx playwright test --workers 1

# テスト一覧だけを確認
npx playwright test --list

# 各テストを5回繰り返して Flaky テストを検出
npx playwright test --repeat-each 5
```

---

### 1.2 `npx playwright codegen` — コード生成

ブラウザ操作を記録して、テストコードを自動生成する。

#### 基本的な使い方

```bash
# デフォルトで Chromium が起動
npx playwright codegen

# 特定の URL を開いて記録開始
npx playwright codegen https://example.com
```

#### 主要フラグ一覧

| フラグ | 説明 | 例 |
|--------|------|-----|
| `--target <lang>` | 出力言語を指定 | `--target javascript` / `--target python` |
| `--device <name>` | デバイスエミュレーション | `--device "iPhone 14"` |
| `--color-scheme <scheme>` | カラースキーム | `--color-scheme dark` |
| `--viewport-size <WxH>` | ビューポートサイズ | `--viewport-size 1280x720` |
| `--timezone <tz>` | タイムゾーン | `--timezone "Asia/Tokyo"` |
| `--geolocation <lat,lng>` | 位置情報 | `--geolocation "35.6762,139.6503"` |
| `--lang <locale>` | ブラウザ言語 | `--lang ja-JP` |
| `--save-storage <path>` | 認証状態を保存 | `--save-storage auth.json` |
| `--load-storage <path>` | 認証状態を読み込み | `--load-storage auth.json` |
| `--browser <name>` | ブラウザ指定 | `--browser firefox` |
| `--block-service-workers` | ServiceWorker をブロック | `--block-service-workers` |
| `--proxy-server <url>` | プロキシサーバー | `--proxy-server http://proxy:8080` |
| `--ignore-https-errors` | HTTPS エラーを無視 | `--ignore-https-errors` |

#### 実用的なコマンド例

```bash
# iPhone 14 エミュレーションでコード生成
npx playwright codegen --device "iPhone 14" https://example.com

# ダークモード + 日本語ロケールで記録
npx playwright codegen --color-scheme dark --lang ja-JP https://example.com

# 認証状態を保存して後で再利用
npx playwright codegen --save-storage auth.json https://example.com/login
npx playwright codegen --load-storage auth.json https://example.com/dashboard

# Python 向けコードを生成
npx playwright codegen --target python https://example.com

# 特定のビューポートサイズでモバイル表示を確認
npx playwright codegen --viewport-size 375x812 https://example.com
```

---

### 1.3 `npx playwright show-report` — HTMLレポート表示

テスト結果の HTML レポートをローカルサーバーで開く。

```bash
# デフォルト（playwright-report ディレクトリ）
npx playwright show-report

# カスタムディレクトリを指定
npx playwright show-report ./my-report

# ポートを指定
npx playwright show-report --port 9323

# ホストを指定（外部からアクセス可能にする場合）
npx playwright show-report --host 0.0.0.0
```

---

### 1.4 `npx playwright show-trace` — トレース表示

トレースファイルをビューアで表示する。

```bash
# ローカルのトレースファイルを開く
npx playwright show-trace trace.zip

# リモートの URL からトレースを開く
npx playwright show-trace https://example.com/trace.zip

# 複数のトレースファイルを比較
npx playwright show-trace trace1.zip trace2.zip
```

> **ヒント**: `https://trace.playwright.dev` にトレースファイルをドラッグ＆ドロップしても確認できる。

---

### 1.5 `npx playwright install` — ブラウザのインストール

```bash
# すべてのブラウザをインストール
npx playwright install

# 特定のブラウザのみインストール
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit

# OS の依存パッケージも一緒にインストール（Linux向け）
npx playwright install --with-deps

# 特定のブラウザ + 依存パッケージ
npx playwright install chromium --with-deps

# 強制的に再インストール
npx playwright install --force

# 依存パッケージのみインストール（ブラウザはスキップ）
npx playwright install-deps
```

---

### 1.6 `npx playwright open` — ブラウザ手動起動

Playwright が管理するブラウザを手動で起動する。

```bash
# Chromium を起動
npx playwright open

# 特定のURLを開いて起動
npx playwright open https://example.com

# デバイスエミュレーション付きで起動
npx playwright open --device "iPhone 14" https://example.com
```

---

### 1.7 `npx playwright merge-reports` — 分散テスト結果の統合

シャーディングなどで分散実行した blob レポートを1つに統合する。

```bash
# blob レポートのディレクトリを指定して統合
npx playwright merge-reports ./blob-reports

# 統合後に HTML レポートとして出力
npx playwright merge-reports --reporter html ./blob-reports

# 複数のレポーターに同時出力
npx playwright merge-reports --reporter html,json ./blob-reports
```

#### シャーディングとの連携例

```bash
# 各シャードで blob レポーターを使用して実行
npx playwright test --shard 1/3 --reporter blob
npx playwright test --shard 2/3 --reporter blob
npx playwright test --shard 3/3 --reporter blob

# 結果を統合して HTML レポートを生成
npx playwright merge-reports --reporter html ./blob-reports
```

---

### 1.8 `npx playwright clear-cache` — キャッシュクリア

Playwright のブラウザキャッシュを削除する。

```bash
npx playwright clear-cache
```

> ブラウザバイナリの再ダウンロードが必要になる場合がある。トラブルシューティング時に使用する。

---

## 2. playwright.config.ts 設定リファレンス

### 2.1 基本構造

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // --- 基本設定 ---
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  testIgnore: ['**/helpers/**', '**/fixtures/**'],

  // --- 並列実行 ---
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,

  // --- リトライ・タイムアウト ---
  retries: process.env.CI ? 2 : 0,
  timeout: 30_000,
  globalTimeout: 600_000,

  // --- CI専用 ---
  forbidOnly: !!process.env.CI,

  // --- 出力 ---
  outputDir: './test-results',

  // --- レポーター ---
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
  ],

  // --- グローバル設定 ---
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  // --- 共通 use オプション ---
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // --- プロジェクト ---
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // --- 開発サーバー ---
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

---

### 2.2 全設定項目の詳細

#### テストファイル制御

| 設定項目 | 型 | デフォルト | 説明 |
|----------|-----|------------|------|
| `testDir` | `string` | 設定ファイルのディレクトリ | テストファイルの検索ディレクトリ |
| `testMatch` | `string \| RegExp \| (string \| RegExp)[]` | `**/*.@(spec\|test).?(c\|m)[jt]s?(x)` | テストファイルのパターン |
| `testIgnore` | `string \| RegExp \| (string \| RegExp)[]` | `**/node_modules/**` | 除外するファイルパターン |

```typescript
export default defineConfig({
  testDir: './e2e/tests',
  testMatch: /.*\.e2e\.ts/,
  testIgnore: ['**/helpers/**', '**/node_modules/**'],
});
```

#### 並列実行

| 設定項目 | 型 | デフォルト | 説明 |
|----------|-----|------------|------|
| `fullyParallel` | `boolean` | `false` | `true` で全テストを並列実行 |
| `workers` | `number \| string` | `'50%'` | 並列ワーカー数。CPU の割合（`'50%'`）も可 |

```typescript
export default defineConfig({
  fullyParallel: true,
  // CPUコア数の50%を使用（デフォルト）
  workers: process.env.CI ? 1 : '50%',
});
```

#### リトライ・タイムアウト

| 設定項目 | 型 | デフォルト | 説明 |
|----------|-----|------------|------|
| `retries` | `number` | `0` | 失敗テストのリトライ回数 |
| `timeout` | `number` | `30000` | 各テストのタイムアウト（ms） |
| `globalTimeout` | `number` | `0`（無制限） | テストスイート全体のタイムアウト（ms） |
| `forbidOnly` | `boolean` | `false` | `.only` を禁止する（CI向け） |

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  timeout: 30_000,
  globalTimeout: 600_000,
  forbidOnly: !!process.env.CI,
});
```

#### 出力

| 設定項目 | 型 | デフォルト | 説明 |
|----------|-----|------------|------|
| `outputDir` | `string` | `'test-results'` | テスト成果物（スクリーンショット、動画等）の出力先 |
| `snapshotDir` | `string` | `testDir` の隣 | スナップショットの保存先 |
| `snapshotPathTemplate` | `string` | - | スナップショットパスのテンプレート |

```typescript
export default defineConfig({
  outputDir: './test-results',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
});
```

---

### 2.3 reporter（レポーター）

Playwright は複数のレポーターを同時に使用できる。

| レポーター | 説明 | 用途 |
|------------|------|------|
| `list` | テスト一覧をリアルタイム表示 | ローカル開発 |
| `line` | 1行ずつ進捗表示 | ローカル開発 |
| `dot` | ドットで進捗表示 | CI（最小出力） |
| `html` | HTMLレポートを生成 | 結果の詳細確認 |
| `json` | JSONファイルを出力 | 外部ツール連携 |
| `junit` | JUnit XML を出力 | CI 統合（Jenkins等） |
| `blob` | バイナリレポートを出力 | シャーディング時の中間結果 |
| `github` | GitHub Actions アノテーション | GitHub Actions |

```typescript
export default defineConfig({
  reporter: [
    // ローカルではリスト表示 + HTML
    ['list'],
    ['html', { open: 'never', outputFolder: './playwright-report' }],

    // JSON 出力
    ['json', { outputFile: './test-results/results.json' }],

    // JUnit 出力（CI向け）
    ['junit', { outputFile: './test-results/junit.xml' }],
  ],
});
```

#### カスタムレポーターの作成

```typescript
// my-reporter.ts
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

class MyReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    console.log(`テスト開始: ${suite.allTests().length} 件`);
  }

  onTestBegin(test: TestCase) {
    console.log(`実行中: ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`完了: ${test.title} - ${result.status}`);
  }

  onEnd(result: FullResult) {
    console.log(`全テスト完了: ${result.status}`);
  }
}

export default MyReporter;
```

```typescript
// playwright.config.ts で使用
export default defineConfig({
  reporter: [['./my-reporter.ts']],
});
```

---

### 2.4 use オプション全一覧

`use` オプションはブラウザコンテキストの共通設定を定義する。グローバルとプロジェクトごとに設定可能。

#### ネットワーク関連

| オプション | 型 | デフォルト | 説明 |
|------------|-----|------------|------|
| `baseURL` | `string` | - | `page.goto('/')` などの相対URLの基準 |
| `httpCredentials` | `{ username: string, password: string }` | - | HTTP Basic 認証の資格情報 |
| `ignoreHTTPSErrors` | `boolean` | `false` | HTTPS エラーを無視 |
| `offline` | `boolean` | `false` | オフラインモードのエミュレーション |
| `bypassCSP` | `boolean` | `false` | Content-Security-Policy をバイパス |
| `extraHTTPHeaders` | `Record<string, string>` | - | すべてのリクエストに追加するヘッダー |
| `proxy` | `{ server: string, bypass?: string, username?: string, password?: string }` | - | プロキシ設定 |

#### タイムアウト関連

| オプション | 型 | デフォルト | 説明 |
|------------|-----|------------|------|
| `actionTimeout` | `number` | `0`（無制限） | `click()` 等のアクションのタイムアウト（ms） |
| `navigationTimeout` | `number` | `0`（無制限） | ナビゲーションのタイムアウト（ms） |

#### 記録・デバッグ

| オプション | 型 | デフォルト | 説明 |
|------------|-----|------------|------|
| `trace` | `'off' \| 'on' \| 'retain-on-failure' \| 'on-first-retry'` | `'off'` | トレース記録 |
| `screenshot` | `'off' \| 'on' \| 'only-on-failure'` | `'off'` | スクリーンショット |
| `video` | `'off' \| 'on' \| 'retain-on-failure' \| 'on-first-retry'` | `'off'` | 動画記録 |

#### デバイスエミュレーション

| オプション | 型 | デフォルト | 説明 |
|------------|-----|------------|------|
| `viewport` | `{ width: number, height: number } \| null` | `{ width: 1280, height: 720 }` | ビューポートサイズ |
| `locale` | `string` | システムロケール | ブラウザロケール |
| `timezoneId` | `string` | システムタイムゾーン | タイムゾーン |
| `geolocation` | `{ latitude: number, longitude: number, accuracy?: number }` | - | 位置情報 |
| `permissions` | `string[]` | - | 付与するパーミッション |
| `colorScheme` | `'light' \| 'dark' \| 'no-preference'` | `'light'` | カラースキーム |
| `userAgent` | `string` | ブラウザのデフォルト | User-Agent 文字列 |
| `deviceScaleFactor` | `number` | `1` | デバイスピクセル比 |
| `isMobile` | `boolean` | `false` | モバイルデバイスのエミュレーション |
| `hasTouch` | `boolean` | `false` | タッチイベントのサポート |
| `javaScriptEnabled` | `boolean` | `true` | JavaScript の有効/無効 |
| `acceptDownloads` | `boolean` | `true` | ダウンロードを自動受け入れ |
| `serviceWorkers` | `'allow' \| 'block'` | `'allow'` | ServiceWorker の許可/ブロック |

#### use オプションの設定例

```typescript
export default defineConfig({
  use: {
    // ネットワーク
    baseURL: 'http://localhost:3000',
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'X-Custom-Header': 'value',
    },

    // タイムアウト
    actionTimeout: 10_000,
    navigationTimeout: 30_000,

    // 記録・デバッグ
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // エミュレーション
    viewport: { width: 1280, height: 720 },
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    colorScheme: 'light',
    geolocation: { latitude: 35.6762, longitude: 139.6503 },
    permissions: ['geolocation'],

    // 認証
    httpCredentials: {
      username: 'user',
      password: 'pass',
    },
  },
});
```

---

### 2.5 projects 設定

複数のブラウザやデバイスでテストを実行するための設定。

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // デスクトップブラウザ
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // モバイルデバイス
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },

    // タブレット
    {
      name: 'tablet',
      use: { ...devices['iPad (gen 7)'] },
    },

    // ブランデッドブラウザ
    {
      name: 'google-chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'microsoft-edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
});
```

#### プロジェクト間の依存関係（setup / teardown）

```typescript
export default defineConfig({
  projects: [
    // setup プロジェクト（認証状態を準備）
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // setup の結果に依存するプロジェクト
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

---

### 2.6 webServer 設定

テスト実行前にローカルサーバーを自動起動する。

#### 単一サーバー

```typescript
export default defineConfig({
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      NODE_ENV: 'test',
    },
  },
});
```

#### 複数サーバー（フロントエンド + バックエンド）

```typescript
export default defineConfig({
  webServer: [
    {
      command: 'npm run start:backend',
      url: 'http://localhost:8080/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run start:frontend',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

| オプション | 型 | 説明 |
|------------|-----|------|
| `command` | `string` | 起動コマンド |
| `url` | `string` | サーバーの準備完了を確認するURL |
| `port` | `number` | ポートの準備完了を確認（`url` の代替） |
| `reuseExistingServer` | `boolean` | 既に起動中のサーバーを再利用するか |
| `timeout` | `number` | サーバー起動のタイムアウト（ms） |
| `cwd` | `string` | 作業ディレクトリ |
| `env` | `Record<string, string>` | 環境変数 |
| `stdout` | `'pipe' \| 'ignore'` | 標準出力の扱い |
| `stderr` | `'pipe' \| 'ignore'` | 標準エラー出力の扱い |

---

### 2.7 globalSetup / globalTeardown

テストスイート全体の前後に1度だけ実行する処理。

```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});
```

```typescript
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // 例: 認証トークンの取得やDBのシード投入
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('メールアドレス').fill('admin@example.com');
  await page.getByLabel('パスワード').fill('password');
  await page.getByRole('button', { name: 'ログイン' }).click();
  await page.context().storageState({ path: 'playwright/.auth/admin.json' });
  await browser.close();
}

export default globalSetup;
```

```typescript
// global-teardown.ts
import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  // 例: テストデータのクリーンアップ
  console.log('グローバル後処理を実行中...');
}

export default globalTeardown;
```

---

### 2.8 expect 設定

```typescript
export default defineConfig({
  expect: {
    // expect() のデフォルトタイムアウト（ms）
    timeout: 10_000,

    // toHaveScreenshot() のオプション
    toHaveScreenshot: {
      // ピクセル差分の最大許容率（0〜1）
      maxDiffPixelRatio: 0.05,
      // 最大差分ピクセル数
      maxDiffPixels: 100,
      // ピクセルごとの色差閾値（0〜255）
      threshold: 0.2,
      // アニメーション処理
      animations: 'disabled',
    },

    // toMatchSnapshot() のオプション
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.05,
    },
  },
});
```

---

## 3. 組み込みフィクスチャ

Playwright Test は依存性注入の仕組みとしてフィクスチャを提供する。テスト関数の引数で必要なフィクスチャを宣言するだけで自動的にセットアップ・クリーンアップされる。

### 3.1 page

各テストに対して独立したブラウザページを提供する。最も使用頻度が高いフィクスチャ。

```typescript
import { test, expect } from '@playwright/test';

test('ページタイトルを確認する', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('タスクボード');
});
```

### 3.2 context

ブラウザコンテキスト。1つのテストで複数のページ（タブ）を操作する場合に使用する。

```typescript
test('複数タブで操作する', async ({ context }) => {
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto('/tasks');
  await page2.goto('/notifications');

  // page1 でタスクを作成すると page2 に通知が表示される
  await page1.getByRole('button', { name: 'タスク作成' }).click();
  await expect(page2.getByText('新しいタスクが作成されました')).toBeVisible();
});
```

### 3.3 browser

ブラウザインスタンス。カスタムコンテキストを作成する場合に使用する。

```typescript
test('異なるユーザーで同時操作する', async ({ browser }) => {
  // 管理者コンテキスト
  const adminContext = await browser.newContext({
    storageState: 'playwright/.auth/admin.json',
  });
  const adminPage = await adminContext.newPage();

  // 一般ユーザーコンテキスト
  const userContext = await browser.newContext({
    storageState: 'playwright/.auth/user.json',
  });
  const userPage = await userContext.newPage();

  // 管理者がタスクを割り当て
  await adminPage.goto('/admin/tasks');
  // ...

  // ユーザー側で確認
  await userPage.goto('/my-tasks');
  // ...

  await adminContext.close();
  await userContext.close();
});
```

### 3.4 browserName

現在のブラウザ名（`'chromium'`, `'firefox'`, `'webkit'`）を取得する。ブラウザ固有の処理分岐に使用する。

```typescript
test('ブラウザ固有の処理', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit では未対応');

  await page.goto('/');
  // ...
});
```

### 3.5 request

ブラウザを使わない API テスト用のリクエストコンテキスト。

```typescript
test('API エンドポイントをテストする', async ({ request }) => {
  // GET リクエスト
  const response = await request.get('/api/tasks');
  expect(response.ok()).toBeTruthy();

  const tasks = await response.json();
  expect(tasks.length).toBeGreaterThan(0);

  // POST リクエスト
  const createResponse = await request.post('/api/tasks', {
    data: {
      title: '新しいタスク',
      description: 'テスト用タスク',
    },
  });
  expect(createResponse.status()).toBe(201);

  // DELETE リクエスト
  const task = await createResponse.json();
  const deleteResponse = await request.delete(`/api/tasks/${task.id}`);
  expect(deleteResponse.ok()).toBeTruthy();
});
```

---

## 4. 組み込みアサーション

### 4.1 自動再試行アサーション（Web-first Assertions）

条件が満たされるまで自動でリトライする。Playwright の最大の強みの一つ。`expect` のデフォルトタイムアウト（5秒）まで再試行する。

#### ロケーター関連

| アサーション | 説明 |
|-------------|------|
| `await expect(locator).toBeVisible()` | 要素が表示されている |
| `await expect(locator).toBeHidden()` | 要素が非表示 |
| `await expect(locator).toBeEnabled()` | 要素が有効 |
| `await expect(locator).toBeDisabled()` | 要素が無効 |
| `await expect(locator).toBeChecked()` | チェックボックスがON |
| `await expect(locator).toBeEditable()` | 要素が編集可能 |
| `await expect(locator).toBeFocused()` | 要素にフォーカスがある |
| `await expect(locator).toBeEmpty()` | 要素が空 |
| `await expect(locator).toBeAttached()` | 要素がDOMに存在 |
| `await expect(locator).toBeInViewport()` | 要素がビューポート内 |
| `await expect(locator).toHaveText(text)` | テキスト内容が一致 |
| `await expect(locator).toContainText(text)` | テキストを含む |
| `await expect(locator).toHaveValue(value)` | input の値が一致 |
| `await expect(locator).toHaveValues(values)` | select の複数値が一致 |
| `await expect(locator).toHaveAttribute(name, value)` | 属性値が一致 |
| `await expect(locator).toHaveClass(class)` | CSS クラスが一致 |
| `await expect(locator).toHaveCSS(property, value)` | CSS プロパティが一致 |
| `await expect(locator).toHaveId(id)` | id 属性が一致 |
| `await expect(locator).toHaveCount(count)` | 要素数が一致 |
| `await expect(locator).toHaveScreenshot()` | スクリーンショットが一致 |

#### ページ関連

| アサーション | 説明 |
|-------------|------|
| `await expect(page).toHaveTitle(title)` | ページタイトルが一致 |
| `await expect(page).toHaveURL(url)` | ページURLが一致 |
| `await expect(page).toHaveScreenshot()` | ページのスクリーンショットが一致 |

#### レスポンス関連

| アサーション | 説明 |
|-------------|------|
| `expect(response).toBeOK()` | ステータスコード 200-299 |

#### 使用例

```typescript
import { test, expect } from '@playwright/test';

test('アサーションの使用例', async ({ page }) => {
  await page.goto('/tasks');

  // ロケーター関連
  const heading = page.getByRole('heading', { name: 'タスク一覧' });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText('タスク一覧');

  // テキストを含むか
  const taskItem = page.getByTestId('task-item').first();
  await expect(taskItem).toContainText('未完了');

  // 要素数の確認
  await expect(page.getByTestId('task-item')).toHaveCount(5);

  // フォーム要素
  const input = page.getByLabel('タスク名');
  await expect(input).toBeEditable();
  await input.fill('新しいタスク');
  await expect(input).toHaveValue('新しいタスク');

  // チェックボックス
  const checkbox = page.getByRole('checkbox', { name: '完了' });
  await checkbox.check();
  await expect(checkbox).toBeChecked();

  // ページ関連
  await expect(page).toHaveTitle(/タスクボード/);
  await expect(page).toHaveURL(/\/tasks/);

  // 否定
  await expect(page.getByText('エラー')).not.toBeVisible();
});
```

### 4.2 標準アサーション（即時評価、リトライなし）

```typescript
test('標準アサーション', async ({ page }) => {
  const text = await page.textContent('.status');

  // 値の比較
  expect(text).toBe('完了');
  expect(text).not.toBe('未完了');

  // 部分一致
  expect(text).toContain('完');

  // 正規表現
  expect(text).toMatch(/完了|未完了/);

  // 真偽値
  expect(true).toBeTruthy();
  expect(false).toBeFalsy();

  // 数値
  expect(5).toBeGreaterThan(3);
  expect(5).toBeLessThanOrEqual(5);
  expect(0.1 + 0.2).toBeCloseTo(0.3);

  // 配列・オブジェクト
  expect([1, 2, 3]).toContain(2);
  expect({ name: 'テスト' }).toEqual({ name: 'テスト' });
  expect({ name: 'テスト', id: 1 }).toMatchObject({ name: 'テスト' });

  // 型チェック
  expect(typeof text).toBe('string');

  // 例外
  expect(() => { throw new Error('エラー'); }).toThrow('エラー');
});
```

### 4.3 ソフトアサーション

失敗してもテストを即座に中断せず、すべてのアサーションを実行してから結果を報告する。

```typescript
test('ソフトアサーション', async ({ page }) => {
  await page.goto('/profile');

  // 1つ失敗しても他のアサーションも実行される
  await expect.soft(page.getByTestId('name')).toHaveText('山田太郎');
  await expect.soft(page.getByTestId('email')).toHaveText('yamada@example.com');
  await expect.soft(page.getByTestId('role')).toHaveText('管理者');
});
```

---

## 5. Auto-waiting（自動待機）

### 5.1 仕組み

Playwright はアクション実行前に、対象要素が操作可能な状態になるまで自動で待機する。これにより `sleep()` や `waitForTimeout()` を明示的に書く必要がない。

```typescript
// Playwright は以下を自動で行う:
// 1. ボタンがDOMに存在するまで待つ
// 2. ボタンが表示されるまで待つ
// 3. ボタンが有効になるまで待つ
// 4. ボタンがアニメーション完了するまで待つ
// 5. ボタンがビューポート内にスクロールされるまで待つ
// 6. ボタンがクリック可能な位置にあるまで待つ（他の要素に隠れていないか）
// 7. クリックを実行
await page.getByRole('button', { name: '送信' }).click();
```

### 5.2 Actionability Checks（操作可能性チェック）

各アクションは実行前に以下のチェックを行う。

| チェック項目 | 説明 | 対象アクション |
|-------------|------|---------------|
| Attached | 要素がDOMに存在する | すべて |
| Visible | 要素が表示されている | `click`, `fill`, `hover` 等 |
| Stable | 要素の位置が安定している（アニメーション完了） | `click`, `hover` 等 |
| Enabled | 要素が有効（`disabled` でない） | `click`, `fill`, `selectOption` 等 |
| Editable | 要素が編集可能 | `fill`, `selectOption`, `type` 等 |
| Receives Events | 要素が他の要素に隠れていない | `click`, `hover` 等 |

#### アクション別チェック一覧

| アクション | Attached | Visible | Stable | Enabled | Editable | Receives Events |
|-----------|----------|---------|--------|---------|----------|-----------------|
| `click()` | ○ | ○ | ○ | ○ | - | ○ |
| `fill()` | ○ | ○ | - | ○ | ○ | - |
| `check()` | ○ | ○ | ○ | ○ | - | ○ |
| `hover()` | ○ | ○ | ○ | - | - | ○ |
| `selectOption()` | ○ | ○ | - | ○ | - | - |
| `textContent()` | ○ | - | - | - | - | - |
| `isVisible()` | - | - | - | - | - | - |

### 5.3 `waitForTimeout()` を使ってはいけない理由

```typescript
// アンチパターン: 固定時間の待機
await page.waitForTimeout(3000); // テストが遅く、不安定になる

// 正しいアプローチ: 条件ベースの待機
await expect(page.getByText('読み込み完了')).toBeVisible();
```

**固定待機が問題になる理由:**

1. **テストが遅くなる** — 実際には1秒で完了する処理にも3秒待つ
2. **テストが不安定になる** — CI 環境では3秒で足りない場合がある
3. **Playwright の設計思想に反する** — 自動待機があるため不要

#### 条件ベースの待機パターン

```typescript
// 要素が表示されるまで待つ
await expect(page.getByText('完了')).toBeVisible();

// ナビゲーション完了を待つ
await page.waitForURL('**/dashboard');

// ネットワークリクエスト完了を待つ
await page.waitForResponse(resp =>
  resp.url().includes('/api/tasks') && resp.status() === 200
);

// 特定の要素が消えるまで待つ
await expect(page.getByText('読み込み中...')).toBeHidden();

// DOMの状態変化を待つ
await page.waitForSelector('.loaded', { state: 'attached' });

// ロードステートを待つ
await page.waitForLoadState('networkidle');
```

---

## 6. Network Interception

### 6.1 route.fulfill() — レスポンスのモック

```typescript
test('API レスポンスをモックする', async ({ page }) => {
  // JSON レスポンスをモック
  await page.route('**/api/tasks', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, title: 'モックタスク1', completed: false },
        { id: 2, title: 'モックタスク2', completed: true },
      ]),
    });
  });

  await page.goto('/tasks');
  await expect(page.getByText('モックタスク1')).toBeVisible();
});
```

```typescript
test('エラーレスポンスをモックする', async ({ page }) => {
  await page.route('**/api/tasks', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'サーバーエラー' }),
    });
  });

  await page.goto('/tasks');
  await expect(page.getByText('エラーが発生しました')).toBeVisible();
});
```

### 6.2 route.continue() — リクエストの変更

```typescript
test('リクエストヘッダーを追加する', async ({ page }) => {
  await page.route('**/api/**', async (route) => {
    const headers = {
      ...route.request().headers(),
      'X-Custom-Header': 'test-value',
    };
    await route.continue({ headers });
  });

  await page.goto('/');
});
```

```typescript
test('リクエストボディを変更する', async ({ page }) => {
  await page.route('**/api/tasks', async (route) => {
    if (route.request().method() === 'POST') {
      const postData = route.request().postDataJSON();
      postData.source = 'e2e-test';
      await route.continue({ postData: JSON.stringify(postData) });
    } else {
      await route.continue();
    }
  });

  await page.goto('/tasks');
});
```

### 6.3 route.abort() — リクエストのブロック

```typescript
test('画像の読み込みをブロックする', async ({ page }) => {
  // 画像リクエストをブロック（パフォーマンステスト向け）
  await page.route('**/*.{png,jpg,jpeg,gif,svg}', (route) => route.abort());

  await page.goto('/');
});
```

```typescript
test('外部リソースをブロックする', async ({ page }) => {
  await page.route('**/analytics/**', (route) => route.abort());
  await page.route('**/ads/**', (route) => route.abort());

  await page.goto('/');
});
```

### 6.4 HAR ファイルの記録・再生

HAR（HTTP Archive）ファイルでネットワークリクエストを記録・再生する。

#### 記録

```typescript
test('HAR ファイルを記録する', async ({ page }) => {
  // HAR ファイルの記録を開始
  await page.routeFromHAR('tests/fixtures/api.har', {
    update: true, // true で記録モード
    url: '**/api/**',
  });

  await page.goto('/tasks');
  // この時点で実際の API が呼ばれ、レスポンスが HAR に記録される

  // テスト終了時に HAR ファイルが保存される
});
```

#### 再生

```typescript
test('HAR ファイルからレスポンスを再生する', async ({ page }) => {
  // HAR ファイルからレスポンスを再生（update: false または省略）
  await page.routeFromHAR('tests/fixtures/api.har', {
    url: '**/api/**',
    notFound: 'abort', // HAR にないリクエストはブロック
  });

  await page.goto('/tasks');
  await expect(page.getByText('タスク一覧')).toBeVisible();
});
```

#### CLI でのHAR記録

```bash
# コマンドラインから HAR を記録
npx playwright open --save-har=network.har https://example.com
```

### 6.5 リクエストの監視

```typescript
test('APIリクエストを監視する', async ({ page }) => {
  // リクエストの監視
  const requestPromise = page.waitForRequest('**/api/tasks');
  const responsePromise = page.waitForResponse('**/api/tasks');

  await page.getByRole('button', { name: '読み込み' }).click();

  const request = await requestPromise;
  console.log('リクエストURL:', request.url());
  console.log('メソッド:', request.method());

  const response = await responsePromise;
  console.log('ステータス:', response.status());
  const body = await response.json();
  console.log('レスポンスボディ:', body);
});
```

---

## 7. Visual Comparison

### 7.1 toHaveScreenshot() の使い方

```typescript
test('ページ全体のスクリーンショットを比較する', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot();
});

test('特定要素のスクリーンショットを比較する', async ({ page }) => {
  await page.goto('/tasks');
  const taskList = page.getByTestId('task-list');
  await expect(taskList).toHaveScreenshot();
});

test('スクリーンショットに名前をつける', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### 7.2 オプション

```typescript
test('オプション付きスクリーンショット比較', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveScreenshot('homepage.png', {
    // ピクセル差分の最大許容率（0〜1）
    maxDiffPixelRatio: 0.05,

    // 最大差分ピクセル数
    maxDiffPixels: 100,

    // ピクセルごとの色差閾値（0〜255）
    threshold: 0.2,

    // アニメーションを無効化して安定させる
    animations: 'disabled',

    // 比較から除外する領域
    mask: [page.getByTestId('timestamp')],

    // マスクの色
    maskColor: '#FF00FF',

    // フルページスクリーンショット
    fullPage: true,

    // 画像の倍率
    scale: 'css',

    // 背景色を省略しない
    omitBackground: false,
  });
});
```

### 7.3 スナップショット保存場所

デフォルトでは、スナップショットはテストファイルと同じディレクトリに保存される。

```
tests/
  login.spec.ts
  login.spec.ts-snapshots/
    homepage-chromium-darwin.png    # 初回実行で生成
    homepage-chromium-linux.png     # OS ごとに別ファイル
```

#### スナップショットパスのカスタマイズ

```typescript
export default defineConfig({
  snapshotPathTemplate:
    '{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}{ext}',
});
```

テンプレートで使える変数:

| 変数 | 説明 |
|------|------|
| `{testDir}` | テストディレクトリ |
| `{testFileDir}` | テストファイルのディレクトリ |
| `{testFileName}` | テストファイル名 |
| `{testFilePath}` | テストファイルのパス（testDir からの相対） |
| `{testName}` | テスト名 |
| `{arg}` | スクリーンショットの名前引数 |
| `{projectName}` | プロジェクト名 |
| `{platform}` | OS（darwin, linux, win32） |
| `{ext}` | ファイル拡張子 |

### 7.4 スナップショットの更新

```bash
# すべてのスナップショットを更新
npx playwright test --update-snapshots

# 特定のテストのスナップショットのみ更新
npx playwright test tests/visual.spec.ts --update-snapshots
```

---

## 8. Trace Recording

### 8.1 trace オプション

| 値 | 説明 |
|----|------|
| `'off'` | トレースを記録しない（デフォルト） |
| `'on'` | 常にトレースを記録 |
| `'retain-on-failure'` | すべてのテストでトレースを記録するが、失敗したテストのトレースのみ保持 |
| `'on-first-retry'` | 最初のリトライ時のみトレースを記録（推奨） |

```typescript
export default defineConfig({
  use: {
    // リトライ時のみトレースを記録（CI向け推奨）
    trace: 'on-first-retry',
  },
  retries: 2,
});
```

#### テスト内でトレースを手動制御

```typescript
test('手動トレース', async ({ page, context }) => {
  // トレース記録開始
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  await page.goto('/');
  // ... テスト操作 ...

  // トレース記録停止・保存
  await context.tracing.stop({ path: 'trace.zip' });
});
```

### 8.2 show-trace の使い方

```bash
# ローカルファイルを開く
npx playwright show-trace trace.zip

# test-results ディレクトリから開く
npx playwright show-trace test-results/login-テスト名/trace.zip
```

### 8.3 トレースに含まれる情報

トレースビューアは以下の情報をタイムラインで確認できる。

| 情報 | 説明 |
|------|------|
| **アクションログ** | 各アクション（click, fill 等）の実行順序と時間 |
| **DOM スナップショット** | 各アクション前後のDOMの状態（操作可能） |
| **スクリーンショット** | 各アクション時のページのスクリーンショット |
| **ネットワークログ** | すべてのネットワークリクエスト・レスポンス |
| **コンソールログ** | ブラウザの console.log 出力 |
| **ソースコード** | テストコードの該当行 |
| **メタデータ** | ブラウザ名、ビューポート、テスト名等 |

### 8.4 オンラインのトレースビューア

ブラウザで `https://trace.playwright.dev` にアクセスし、トレースファイルをドラッグ＆ドロップするだけで確認できる。ファイルはローカルで処理され、サーバーにアップロードされない。

---

## 9. テストライフサイクル

### 9.1 基本構造

```typescript
import { test, expect } from '@playwright/test';

test.describe('タスク管理', () => {
  test.beforeAll(async () => {
    // describe ブロック内の全テスト実行前に1回だけ実行
    console.log('テストスイート開始');
  });

  test.afterAll(async () => {
    // describe ブロック内の全テスト実行後に1回だけ実行
    console.log('テストスイート終了');
  });

  test.beforeEach(async ({ page }) => {
    // 各テストの前に毎回実行
    await page.goto('/tasks');
  });

  test.afterEach(async ({ page }) => {
    // 各テストの後に毎回実行（成功・失敗問わず）
    console.log('テスト完了');
  });

  test('タスクを作成する', async ({ page }) => {
    // beforeEach で /tasks に遷移済み
    await page.getByRole('button', { name: '新規作成' }).click();
    // ...
  });

  test('タスクを削除する', async ({ page }) => {
    // beforeEach で /tasks に遷移済み
    await page.getByRole('button', { name: '削除' }).first().click();
    // ...
  });
});
```

### 9.2 describe.configure — 実行モード設定

```typescript
// 逐次実行（serial モード）
test.describe.configure({ mode: 'serial' });

test.describe('ユーザー登録フロー', () => {
  // serial モードではテストが順番に実行され、
  // 1つ失敗すると残りはスキップされる
  test('ステップ1: 情報入力', async ({ page }) => {
    // ...
  });

  test('ステップ2: 確認画面', async ({ page }) => {
    // ...
  });

  test('ステップ3: 完了', async ({ page }) => {
    // ...
  });
});
```

```typescript
// 並列実行（parallel モード）
test.describe.configure({ mode: 'parallel' });

test.describe('独立したテスト群', () => {
  test('テストA', async ({ page }) => { /* ... */ });
  test('テストB', async ({ page }) => { /* ... */ });
  test('テストC', async ({ page }) => { /* ... */ });
});
```

### 9.3 describe のネスト

```typescript
test.describe('認証', () => {
  test.describe('ログイン', () => {
    test('正常ログイン', async ({ page }) => { /* ... */ });
    test('パスワード誤り', async ({ page }) => { /* ... */ });
  });

  test.describe('ログアウト', () => {
    test('正常ログアウト', async ({ page }) => { /* ... */ });
  });
});
```

### 9.4 パラメータ化テスト（forEach パターン）

```typescript
const testCases = [
  { role: '管理者', email: 'admin@example.com', expectedPage: '/admin' },
  { role: '一般ユーザー', email: 'user@example.com', expectedPage: '/dashboard' },
  { role: 'ゲスト', email: 'guest@example.com', expectedPage: '/limited' },
];

for (const { role, email, expectedPage } of testCases) {
  test(`${role}でログインすると${expectedPage}にリダイレクトされる`, async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('メールアドレス').fill(email);
    await page.getByLabel('パスワード').fill('password');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page).toHaveURL(expectedPage);
  });
}
```

```typescript
// ブラウザサイズのパラメータ化
const viewports = [
  { name: 'モバイル', width: 375, height: 812 },
  { name: 'タブレット', width: 768, height: 1024 },
  { name: 'デスクトップ', width: 1920, height: 1080 },
];

for (const vp of viewports) {
  test(`${vp.name}表示でレイアウトが正しい`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    await expect(page).toHaveScreenshot(`layout-${vp.name}.png`);
  });
}
```

### 9.5 テストのスキップ・条件付き実行

```typescript
// テストをスキップ
test.skip('未実装の機能', async ({ page }) => {
  // このテストは実行されない
});

// 条件付きスキップ
test('Linux のみで実行', async ({ page, browserName }) => {
  test.skip(process.platform !== 'linux', 'Linux 環境でのみ実行');
  // ...
});

// slow マーク（タイムアウトを3倍に）
test('時間のかかるテスト', async ({ page }) => {
  test.slow();
  // ...
});

// fixme マーク（既知の不具合、スキップ扱い）
test.fixme('既知のバグ #123', async ({ page }) => {
  // ...
});

// fail マーク（失敗することを期待）
test.fail('バグ修正後に外す', async ({ page }) => {
  // テストが失敗すればパス、成功すれば不合格
});

// .only（デバッグ用、CI では forbidOnly で禁止推奨）
test.only('このテストだけ実行', async ({ page }) => {
  // ...
});
```

### 9.6 テストへのアノテーション

```typescript
test('機能テスト', async ({ page }) => {
  test.info().annotations.push({
    type: 'issue',
    description: 'https://github.com/org/repo/issues/123',
  });

  // ...
});

// タグ付け
test('ログイン @smoke', async ({ page }) => {
  // --grep "@smoke" で実行可能
});

// test.describe にもタグ付け可能
test.describe('認証 @auth', () => {
  test('ログイン', async ({ page }) => { /* ... */ });
});
```

---

## 10. Playwright Inspector

### 10.1 起動方法

```bash
# --debug フラグで起動
npx playwright test --debug

# 特定のテストをデバッグ
npx playwright test tests/login.spec.ts --debug

# 環境変数で起動
PWDEBUG=1 npx playwright test

# console モード（ブラウザの DevTools コンソールで操作可能）
PWDEBUG=console npx playwright test
```

### 10.2 Inspector の機能

| 機能 | 説明 |
|------|------|
| **ステップ実行** | テストコードを1行ずつ実行 |
| **Resume** | 次の `page.pause()` またはテスト終了まで実行 |
| **Locator Picker** | ページ上の要素をクリックしてロケーターを取得 |
| **ロケーターのハイライト** | コード内のロケーターに対応する要素をブラウザ上でハイライト |
| **Record** | ブラウザ操作を記録してコード生成 |

### 10.3 page.pause() の使い方

テストコード内にブレークポイントを設置する。

```typescript
test('デバッグ用テスト', async ({ page }) => {
  await page.goto('/tasks');

  // ここで Inspector が停止する
  await page.pause();

  // Inspector で要素を確認した後、Resume で続行
  await page.getByRole('button', { name: '作成' }).click();

  // 再び停止
  await page.pause();
});
```

> **注意**: `page.pause()` はデバッグ専用。コミット前に必ず削除すること。

### 10.4 UIモードでのデバッグ

```bash
npx playwright test --ui
```

UIモードの機能:

- テスト一覧のツリー表示
- テストのウォッチモード（ファイル保存時に自動再実行）
- タイムラインビュー（各アクションの前後のDOMを確認可能）
- フィルタリング（テスト名、ステータス）
- ネットワークログ
- テストソースコードの表示

---

## 11. ロケーター選択ベストプラクティス

### 11.1 推奨順位

#### 1. `getByTestId()` — 最も安定

テスト専用の属性を使うため、UIの変更に影響されない。

```typescript
// HTML: <button data-testid="submit-btn">送信</button>
await page.getByTestId('submit-btn').click();
```

```typescript
// カスタム属性名の変更（playwright.config.ts）
export default defineConfig({
  use: {
    testIdAttribute: 'data-test-id', // デフォルトは 'data-testid'
  },
});
```

#### 2. `getByRole()` — ユーザー視点

ARIAロールに基づく。ユーザーが実際に認識する方法でアクセスする。アクセシビリティの向上にも寄与する。

```typescript
// ボタン
await page.getByRole('button', { name: '送信' }).click();

// リンク
await page.getByRole('link', { name: 'ホーム' }).click();

// 見出し
await page.getByRole('heading', { name: 'タスク一覧', level: 1 });

// テキストボックス
await page.getByRole('textbox', { name: 'メールアドレス' }).fill('test@example.com');

// チェックボックス
await page.getByRole('checkbox', { name: '利用規約に同意する' }).check();

// ラジオボタン
await page.getByRole('radio', { name: '高優先度' }).check();

// セレクトボックス
await page.getByRole('combobox', { name: 'カテゴリ' }).selectOption('重要');

// ナビゲーション
await page.getByRole('navigation').getByRole('link', { name: '設定' }).click();

// ダイアログ
await page.getByRole('dialog').getByRole('button', { name: '確認' }).click();

// タブ
await page.getByRole('tab', { name: '詳細' }).click();
```

#### 3. `getByLabel()` — フォーム要素

`<label>` と関連付けられたフォーム要素にアクセスする。

```typescript
await page.getByLabel('メールアドレス').fill('user@example.com');
await page.getByLabel('パスワード').fill('password123');
await page.getByLabel('ログイン状態を保持する').check();
```

#### 4. `getByPlaceholder()` — フォーム要素

プレースホルダーテキストで要素を見つける。

```typescript
await page.getByPlaceholder('タスク名を入力').fill('新しいタスク');
await page.getByPlaceholder('検索...').fill('キーワード');
```

#### 5. `getByText()` — テキストベース

表示テキストで要素を見つける。

```typescript
// 完全一致
await page.getByText('タスクを作成しました', { exact: true }).click();

// 部分一致（デフォルト）
await page.getByText('タスクを作成');

// 正規表現
await page.getByText(/\d+件のタスク/);
```

#### 6. `getByAltText()` — 画像要素

```typescript
await page.getByAltText('プロフィール画像').click();
```

#### 7. `getByTitle()` — title 属性

```typescript
await page.getByTitle('削除').click();
```

### 11.2 避けるべきロケーター

```typescript
// CSS セレクタ（構造変更に弱い）
await page.locator('.btn-primary').click();           // 避ける
await page.locator('#submit-button').click();          // 避ける
await page.locator('div > form > button').click();     // 避ける

// XPath（可読性が低い、壊れやすい）
await page.locator('//div[@class="container"]//button').click(); // 避ける
```

### 11.3 ロケーターのチェーン・フィルタ

```typescript
// チェーン
await page.getByRole('listitem')
  .filter({ hasText: '重要' })
  .getByRole('button', { name: '編集' })
  .click();

// 複数条件のフィルタ
await page.getByRole('listitem')
  .filter({ has: page.getByText('未完了') })
  .filter({ has: page.getByTestId('high-priority') })
  .first()
  .click();

// nth() で特定のインデックス
await page.getByRole('listitem').nth(2).click();

// first() / last()
await page.getByRole('listitem').first().click();
await page.getByRole('listitem').last().click();
```

---

## 12. CI/CD 設定

### 12.1 推奨 playwright.config.ts（CI 用）

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,

  // CI 専用設定
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['html', { open: 'on-failure' }]],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

### 12.2 GitHub Actions YAML サンプル

#### 基本的なワークフロー

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: 依存パッケージをインストール
        run: npm ci

      - name: Playwright ブラウザをインストール
        run: npx playwright install --with-deps

      - name: テストを実行
        run: npx playwright test

      - name: テストレポートをアップロード
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

#### シャーディング（分散実行）

```yaml
name: Playwright Tests (Sharded)
on:
  push:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: 依存パッケージをインストール
        run: npm ci

      - name: Playwright ブラウザをインストール
        run: npx playwright install --with-deps

      - name: テストを実行（シャード ${{ matrix.shardIndex }}/${{ matrix.shardTotal }}）
        run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

      - name: blob レポートをアップロード
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: blob-report-${{ matrix.shardIndex }}
          path: blob-report/
          retention-days: 1

  merge-reports:
    if: ${{ !cancelled() }}
    needs: [test]
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: 依存パッケージをインストール
        run: npm ci

      - name: blob レポートをダウンロード
        uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true

      - name: レポートを統合
        run: npx playwright merge-reports --reporter html ./all-blob-reports

      - name: HTML レポートをアップロード
        uses: actions/upload-artifact@v4
        with:
          name: html-report--attempt-${{ github.run_attempt }}
          path: playwright-report/
          retention-days: 14
```

#### コンテナを使った実行

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.50.0-noble

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: 依存パッケージをインストール
        run: npm ci

      - name: テストを実行
        run: npx playwright test
        env:
          HOME: /root
```

---

## 13. ベストプラクティス

### 13.1 Flaky Test 対策

Flaky test（不安定なテスト）はCI/CDの信頼性を損なう。以下の対策を行う。

#### リトライの設定

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
});
```

#### 固定待機を避ける

```typescript
// 悪い例
await page.waitForTimeout(3000);

// 良い例: 条件ベースで待機
await expect(page.getByText('読み込み完了')).toBeVisible();
await page.waitForLoadState('networkidle');
```

#### アニメーションを無効化

```typescript
export default defineConfig({
  use: {
    // アニメーションを無効化
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
    },
  },
});
```

#### タイムスタンプや動的コンテンツのマスキング

```typescript
await expect(page).toHaveScreenshot({
  mask: [
    page.getByTestId('timestamp'),
    page.getByTestId('random-avatar'),
  ],
});
```

#### Flaky テストの特定

```bash
# 同じテストを10回繰り返して不安定さを検出
npx playwright test --repeat-each 10

# 前回失敗したテストだけ再実行
npx playwright test --last-failed
```

### 13.2 テスト分離

各テストは完全に独立して実行できるようにする。

```typescript
// 悪い例: テスト間で状態を共有
let taskId: string;

test('タスクを作成する', async ({ page }) => {
  // タスクを作成して taskId を保存
  taskId = '123';
});

test('タスクを更新する', async ({ page }) => {
  // taskId に依存 — 上のテストが失敗すると壊れる
  await page.goto(`/tasks/${taskId}`);
});
```

```typescript
// 良い例: 各テストが独立
test('タスクを作成する', async ({ page }) => {
  await page.goto('/tasks');
  await page.getByRole('button', { name: '新規作成' }).click();
  await page.getByLabel('タスク名').fill('テストタスク');
  await page.getByRole('button', { name: '保存' }).click();
  await expect(page.getByText('テストタスク')).toBeVisible();
});

test('タスクを更新する', async ({ page, request }) => {
  // API でテストデータを事前準備
  const response = await request.post('/api/tasks', {
    data: { title: '更新対象タスク' },
  });
  const task = await response.json();

  await page.goto(`/tasks/${task.id}`);
  await page.getByLabel('タスク名').fill('更新後タスク');
  await page.getByRole('button', { name: '保存' }).click();
  await expect(page.getByText('更新後タスク')).toBeVisible();
});
```

### 13.3 安定した待機戦略

```typescript
// ネットワークリクエスト完了を待つ
const responsePromise = page.waitForResponse('**/api/tasks');
await page.getByRole('button', { name: '読み込み' }).click();
await responsePromise;

// URL 変化を待つ
await page.getByRole('link', { name: 'ダッシュボード' }).click();
await page.waitForURL('**/dashboard');

// 要素の状態変化を待つ
await expect(page.getByRole('button', { name: '送信' })).toBeEnabled();

// ローディングの消失を待つ
await expect(page.getByTestId('loading-spinner')).toBeHidden();

// 複数の条件が同時に満たされるのを待つ
await Promise.all([
  expect(page.getByText('保存完了')).toBeVisible(),
  expect(page.getByRole('button', { name: '保存' })).toBeEnabled(),
]);
```

### 13.4 診断情報の収集

テスト失敗時に原因を特定しやすくするための設定。

```typescript
export default defineConfig({
  use: {
    // リトライ時にトレースを記録
    trace: 'on-first-retry',

    // 失敗時のみスクリーンショットを取得
    screenshot: 'only-on-failure',

    // 失敗時のみ動画を保持
    video: 'retain-on-failure',
  },
});
```

#### テスト内でのデバッグ情報追加

```typescript
test('デバッグ情報付きテスト', async ({ page }) => {
  // テスト情報にメタデータを追加
  test.info().annotations.push({
    type: 'description',
    description: 'タスク作成フローの正常系テスト',
  });

  await page.goto('/tasks');

  // テスト成果物としてスクリーンショットを添付
  await test.info().attach('タスク一覧のスクリーンショット', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  // ログを添付
  const logs = await page.evaluate(() => {
    return JSON.stringify(performance.getEntriesByType('navigation'));
  });
  await test.info().attach('パフォーマンスログ', {
    body: logs,
    contentType: 'application/json',
  });
});
```

#### コンソールログの収集

```typescript
test.beforeEach(async ({ page }) => {
  // ブラウザのコンソールログを収集
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`ブラウザエラー: ${msg.text()}`);
    }
  });

  // 未処理のページエラーを検出
  page.on('pageerror', (error) => {
    console.log(`ページエラー: ${error.message}`);
  });
});
```

### 13.5 Page Object Model（POM）パターン

テストコードの再利用性と保守性を高めるためのパターン。

```typescript
// pages/login-page.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('メールアドレス');
    this.passwordInput = page.getByLabel('パスワード');
    this.loginButton = page.getByRole('button', { name: 'ログイン' });
    this.errorMessage = page.getByTestId('error-message');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toHaveText(message);
  }
}
```

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('ログイン機能', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('正常にログインできる', async ({ page }) => {
    await loginPage.login('user@example.com', 'password');
    await expect(page).toHaveURL('/dashboard');
  });

  test('パスワードが間違っている場合エラーが表示される', async () => {
    await loginPage.login('user@example.com', 'wrong');
    await loginPage.expectError('メールアドレスまたはパスワードが正しくありません');
  });
});
```

### 13.6 カスタムフィクスチャ

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/login-page';
import { TaskPage } from './pages/task-page';

// カスタムフィクスチャの型定義
type MyFixtures = {
  loginPage: LoginPage;
  taskPage: TaskPage;
  authenticatedPage: void;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  taskPage: async ({ page }, use) => {
    const taskPage = new TaskPage(page);
    await use(taskPage);
  },

  // 認証済み状態のフィクスチャ
  authenticatedPage: [async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('メールアドレス').fill('test@example.com');
    await page.getByLabel('パスワード').fill('password');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await page.waitForURL('/dashboard');
    await use();
  }, { auto: true }], // auto: true で自動適用
});

export { expect } from '@playwright/test';
```

```typescript
// テストでカスタムフィクスチャを使用
import { test, expect } from './fixtures';

test('タスクを作成する', async ({ taskPage }) => {
  // authenticatedPage が自動適用され、ログイン済み
  await taskPage.goto();
  await taskPage.createTask('新しいタスク');
});
```

---

> **参考リンク**
>
> - [Playwright 公式ドキュメント](https://playwright.dev/docs/intro)
> - [Playwright API リファレンス](https://playwright.dev/docs/api/class-playwright)
> - [Playwright GitHub リポジトリ](https://github.com/microsoft/playwright)
