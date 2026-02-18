# Playwright MCP リファレンスガイド

> 本ドキュメントは Playwright MCP Server（`@playwright/mcp`）の包括的なリファレンスです。
> 対象バージョン: `@playwright/mcp@latest`（2026年2月時点）

---

## 目次

1. [Playwright MCP とは](#1-playwright-mcp-とは)
2. [セットアップ方法](#2-セットアップ方法)
3. [MCP Server ツール一覧](#3-mcp-server-ツール一覧)
4. [動作モード](#4-動作モード)
5. [設定オプション](#5-設定オプション)
6. [Playwright Test Agents](#6-playwright-test-agents)
7. [実践ワークフロー](#7-実践ワークフロー)
8. [コンテキストコストに関する注意](#8-コンテキストコストに関する注意)
9. [トラブルシューティング](#9-トラブルシューティング)

---

## 1. Playwright MCP とは

### MCP (Model Context Protocol) の概念

**MCP（Model Context Protocol）** は、LLM（大規模言語モデル）が外部ツールやサービスと標準化されたインターフェースで通信するためのプロトコルである。Anthropic が提唱し、AIエージェントが「目」と「手」を持つための基盤として急速に普及している。

```
┌──────────────┐     MCP プロトコル     ┌──────────────────┐
│   LLM        │ ◄──────────────────► │  MCP Server      │
│  (Claude等)  │   JSON-RPC over      │ (Playwright等)   │
│              │   stdio / SSE        │                  │
└──────────────┘                      └──────────────────┘
```

MCP の核心は **ツール定義の標準化** にある。MCP Server が「どんなツールを持っているか」「各ツールのパラメータは何か」をJSON Schema で宣言し、LLM がその定義に基づいてツールを呼び出す。

### Playwright MCP Server の役割

**Playwright MCP Server** は、Microsoft が公式に提供する MCP Server 実装である。LLM にブラウザ操作能力を付与し、以下を実現する:

- **Webページの閲覧・操作**: ナビゲーション、クリック、テキスト入力、フォーム送信
- **ページ情報の取得**: アクセシビリティスナップショット、スクリーンショット、コンソールログ、ネットワークリクエスト
- **タブ管理**: 複数タブの作成・切り替え・閉じる
- **テスト支援**: テストコード生成、要素検証、トレース記録

### アクセシビリティスナップショットベースの動作原理

Playwright MCP の最大の特徴は、**スクリーンショット（ピクセル）ではなく、アクセシビリティツリー（構造化データ）を使ってページを理解する** ことである。

```
従来のアプローチ:
  ブラウザ → スクリーンショット(画像) → Vision モデル → 座標推定 → クリック
  問題: 遅い、不正確、ビジョンモデルが必要

Playwright MCP のアプローチ:
  ブラウザ → アクセシビリティツリー(構造化データ) → LLM → ref指定 → クリック
  利点: 高速、正確、ビジョンモデル不要
```

アクセシビリティツリーとは、ブラウザがスクリーンリーダー等の支援技術のために生成する**意味的な構造情報**である。各要素の「役割（role）」「名前（name）」「状態（state）」がツリー形式で表現される。

```
# アクセシビリティスナップショットの例
- navigation "メインナビゲーション"
  - link "ホーム" [ref=1]
  - link "タスク一覧" [ref=2]
  - link "設定" [ref=3]
- main
  - heading "タスク一覧" [level=1]
  - textbox "タスクを検索..." [ref=4]
  - button "検索" [ref=5]
  - list "タスク"
    - listitem
      - checkbox "買い物に行く" [checked=false] [ref=6]
      - button "編集" [ref=7]
      - button "削除" [ref=8]
```

LLM はこの構造化データから `ref` 番号を使って要素を特定し、操作を指示する。ピクセル座標の推測が不要なため、**決定論的で再現性が高い**。

---

## 2. セットアップ方法

### Claude Code

最もシンプルな方法。ターミナルで以下を実行する:

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

ヘッドレスモードで起動する場合:

```bash
claude mcp add playwright npx @playwright/mcp@latest --headless
```

特定のブラウザを指定する場合:

```bash
claude mcp add playwright npx @playwright/mcp@latest --browser firefox
```

Vision モード等のオプション機能を有効にする場合:

```bash
claude mcp add playwright npx @playwright/mcp@latest --caps vision,pdf
```

### VS Code

ワンライナーで追加:

```bash
code --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp@latest"]}'
```

または `settings.json` に直接記述:

```json
{
  "mcp": {
    "servers": {
      "playwright": {
        "command": "npx",
        "args": ["@playwright/mcp@latest"]
      }
    }
  }
}
```

ヘッドレスモードの例:

```json
{
  "mcp": {
    "servers": {
      "playwright": {
        "command": "npx",
        "args": ["@playwright/mcp@latest", "--headless"]
      }
    }
  }
}
```

### Cursor

1. **Settings** → **MCP** を開く
2. **「+ Add new MCP Server」** をクリック
3. 以下を設定:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### Claude Desktop

`claude_desktop_config.json` に追加する:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

設定ファイルの場所:

| OS | パス |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

### プロジェクトスコープ（.mcp.json）

プロジェクトルートに `.mcp.json` を配置すると、プロジェクト固有の MCP 設定を共有できる:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

headless + Vision + PDF を有効にした実践的な例:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--headless",
        "--caps", "vision,pdf"
      ]
    }
  }
}
```

---

## 3. MCP Server ツール一覧

Playwright MCP Server は、複数の **capability グループ** に分類されたツールを提供する。

### コアブラウザ操作（常に有効）

| ツール | 機能 | 主なパラメータ |
|--------|------|---------------|
| `browser_navigate` | 指定URLへ遷移する | `url` |
| `browser_navigate_back` | ブラウザの戻るボタンと同等 | なし |
| `browser_snapshot` | アクセシビリティスナップショットを取得する | なし |
| `browser_click` | 要素をクリックする | `element`, `ref`, `doubleClick?`, `button?`, `modifiers?` |
| `browser_type` | テキストを入力する | `element`, `ref`, `text`, `submit?`, `slowly?` |
| `browser_select_option` | セレクトボックスの値を選択する | `element`, `ref`, `values[]` |
| `browser_press_key` | キーボードキーを押す | `key` |
| `browser_handle_dialog` | alert/confirm/prompt ダイアログを処理する | `accept`, `promptText?` |
| `browser_wait_for` | 条件を満たすまで待機する | `time?`, `text?`, `textGone?` |
| `browser_file_upload` | ファイルをアップロードする | `paths[]` |

#### 使用例: 基本的なページ操作

```
# 1. ページに遷移する
browser_navigate({ url: "http://localhost:3000/login" })

# 2. アクセシビリティスナップショットを取得してページ構造を確認する
browser_snapshot()
# → textbox "メールアドレス" [ref=3]
# → textbox "パスワード" [ref=4]
# → button "ログイン" [ref=5]

# 3. メールアドレスを入力する
browser_type({ element: "メールアドレス入力欄", ref: 3, text: "user@example.com" })

# 4. パスワードを入力する
browser_type({ element: "パスワード入力欄", ref: 4, text: "password123" })

# 5. ログインボタンをクリックする
browser_click({ element: "ログインボタン", ref: 5 })

# 6. ページ遷移を待機する
browser_wait_for({ text: "ダッシュボード" })
```

#### 使用例: キー操作

```
# Enter キーを押す
browser_press_key({ key: "Enter" })

# Ctrl+A で全選択する
browser_press_key({ key: "Control+a" })

# Escape キーを押す
browser_press_key({ key: "Escape" })

# Tab キーでフォーカス移動する
browser_press_key({ key: "Tab" })
```

#### 使用例: ダイアログ処理

```
# confirm ダイアログで「OK」を押す
browser_handle_dialog({ accept: true })

# confirm ダイアログで「キャンセル」を押す
browser_handle_dialog({ accept: false })

# prompt ダイアログにテキストを入力して「OK」を押す
browser_handle_dialog({ accept: true, promptText: "入力値" })
```

#### 使用例: 条件待機

```
# 特定テキストが表示されるまで待機する
browser_wait_for({ text: "保存しました" })

# 特定テキストが消えるまで待機する
browser_wait_for({ textGone: "読み込み中..." })

# 指定時間（ミリ秒）待機する
browser_wait_for({ time: 3000 })
```

### 高度な操作（常に有効）

| ツール | 機能 | 主なパラメータ |
|--------|------|---------------|
| `browser_hover` | 要素にマウスホバーする | `element`, `ref` |
| `browser_drag` | ドラッグ&ドロップする | `startElement`, `startRef`, `endElement`, `endRef` |
| `browser_resize` | ブラウザウィンドウをリサイズする | `width`, `height` |

#### 使用例: 高度な操作

```
# ツールチップを表示するためにホバーする
browser_hover({ element: "ヘルプアイコン", ref: 12 })

# ドラッグ&ドロップする
browser_drag({
  startElement: "タスクカード",
  startRef: 15,
  endElement: "完了カラム",
  endRef: 20
})

# モバイルビューポートにリサイズする
browser_resize({ width: 375, height: 812 })
```

### ページ情報取得

| ツール | 機能 | 主なパラメータ | 必要な capability |
|--------|------|---------------|------------------|
| `browser_console_messages` | コンソールログを取得する | `level?` | core（常に有効） |
| `browser_network_requests` | ネットワークリクエスト一覧を取得する | `includeStatic?` | core（常に有効） |
| `browser_take_screenshot` | スクリーンショットを撮影する | `type?`, `filename?`, `element?`, `ref?`, `fullPage?` | core（常に有効） |
| `browser_pdf_save` | ページをPDFとして保存する | `filename?` | `pdf`（要有効化） |

#### 使用例: デバッグ情報の取得

```
# コンソールのエラーメッセージのみ取得する
browser_console_messages({ level: "error" })

# ネットワークリクエスト一覧を取得する（静的アセットを除外する）
browser_network_requests({ includeStatic: false })

# ページ全体のスクリーンショットを撮影する
browser_take_screenshot({ fullPage: true })

# 特定要素のスクリーンショットを撮影する
browser_take_screenshot({ element: "タスクリスト", ref: 10 })

# PDFとして保存する（--caps pdf が必要）
browser_pdf_save({ filename: "report.pdf" })
```

### タブ管理（常に有効）

| ツール | 機能 | 主なパラメータ |
|--------|------|---------------|
| `browser_tab_list` | 開いているタブの一覧を取得する | なし |
| `browser_tab_new` | 新しいタブを開く | `url?` |
| `browser_tab_select` | 指定タブに切り替える | `index` |
| `browser_tab_close` | タブを閉じる | `index?` |

#### 使用例: タブ管理

```
# 新しいタブでURLを開く
browser_tab_new({ url: "http://localhost:3000/settings" })

# タブ一覧を確認する
browser_tab_list()
# → [0] http://localhost:3000/dashboard
# → [1] http://localhost:3000/settings  (active)

# 最初のタブに切り替える
browser_tab_select({ index: 0 })

# 現在のタブを閉じる
browser_tab_close()
```

### JavaScript 実行

| ツール | 機能 | 主なパラメータ |
|--------|------|---------------|
| `browser_evaluate` | ページ上でJavaScriptを実行する | `function`, `element?`, `ref?` |

#### 使用例: JavaScript 実行

```
# ローカルストレージの値を取得する
browser_evaluate({ function: "() => localStorage.getItem('token')" })

# スクロール位置を変更する
browser_evaluate({ function: "() => window.scrollTo(0, document.body.scrollHeight)" })

# 特定要素のプロパティを取得する
browser_evaluate({
  function: "(el) => el.value",
  element: "入力フィールド",
  ref: 5
})
```

### Vision モード専用ツール（`--caps vision` で有効化）

| ツール | 機能 | 主なパラメータ |
|--------|------|---------------|
| `browser_mouse_click_xy` | 座標指定でクリックする | `x`, `y`, `button?`, `doubleClick?` |
| `browser_mouse_move_xy` | 座標指定でマウスを移動する | `x`, `y` |
| `browser_mouse_drag_xy` | 座標間でドラッグする | `startX`, `startY`, `endX`, `endY` |

#### 使用例: 座標ベースの操作

```
# Canvas 上の特定座標をクリックする
browser_mouse_click_xy({ x: 400, y: 300 })

# 座標間でドラッグする
browser_mouse_drag_xy({ startX: 100, startY: 200, endX: 500, endY: 200 })
```

### テスト検証ツール（`--caps testing` で有効化）

| ツール | 機能 | 主なパラメータ |
|--------|------|---------------|
| `browser_verify_element_visible` | 要素の表示を検証する | `element`, `ref` |
| `browser_verify_text_visible` | テキストの表示を検証する | `text` |
| `browser_verify_list_visible` | リスト項目の表示を検証する | `items[]` |
| `browser_verify_value` | 要素の値を検証する | `element`, `ref`, `expected` |
| `browser_generate_locator` | Playwright ロケータを生成する | `element`, `ref` |

### トレース記録ツール（`--caps tracing` で有効化）

| ツール | 機能 | 主なパラメータ |
|--------|------|---------------|
| `browser_start_tracing` | トレース記録を開始する | なし |
| `browser_stop_tracing` | トレース記録を停止する | `filename?` |

### その他

| ツール | 機能 | 主なパラメータ |
|--------|------|---------------|
| `browser_close` | ブラウザを閉じる | なし |
| `browser_install` | ブラウザバイナリをインストールする | `browser?` |

---

## 4. 動作モード

Playwright MCP には 2 つの主要な動作モードがある。

### Snapshot モード（デフォルト）

**アクセシビリティツリーベース** の操作モード。デフォルトで有効であり、追加設定不要。

**特徴:**

| 項目 | 詳細 |
|------|------|
| 動作方式 | ブラウザのアクセシビリティツリーを読み取り、`ref` 番号で要素を特定する |
| ビジョンモデル | 不要 |
| 速度 | 高速（テキストデータのみを処理する） |
| 精度 | 高い（決定論的な要素特定） |
| 適用シーン | セマンティックなHTML、一般的なWebアプリケーション |

**動作フロー:**

```
1. browser_snapshot() を呼び出す
2. アクセシビリティツリーを受け取る:
   - button "送信" [ref=5]
   - textbox "ユーザー名" [ref=3]
3. ref 番号を使って操作する:
   browser_click({ element: "送信ボタン", ref: 5 })
```

**利点:**
- ビジョンモデル（GPT-4V等）が不要なため、**トークンコストが低い**
- テキストベースのため **レスポンスが高速**
- 要素が `ref` 番号で一意に特定されるため **再現性が高い**
- セマンティックHTML であれば **ほぼ完璧に動作する**

### Vision モード（`--caps vision` で有効化）

**スクリーンショットベース** の操作モード。座標指定でマウス操作を行う。

**有効化方法:**

```bash
# Claude Code の場合
claude mcp add playwright npx @playwright/mcp@latest --caps vision

# .mcp.json の場合
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--caps", "vision"]
    }
  }
}
```

**特徴:**

| 項目 | 詳細 |
|------|------|
| 動作方式 | スクリーンショットを撮影し、座標指定で操作する |
| ビジョンモデル | 必要（LLM が座標を解析する） |
| 速度 | 低速（画像処理が入る） |
| 精度 | ケースによる（座標推定の精度に依存する） |
| 適用シーン | Canvas、カスタムUI、アクセシビリティ情報が不十分な要素 |

**動作フロー:**

```
1. browser_take_screenshot() を呼び出す
2. スクリーンショット画像を受け取る
3. LLM が画像から座標を特定する
4. 座標指定で操作する:
   browser_mouse_click_xy({ x: 400, y: 300 })
```

### どちらを使うべきかの判断基準

```
                         開始
                          │
                 ページにアクセシビリティ
                 情報は十分にあるか？
                       /      \
                     Yes       No
                      │         │
              Snapshot モード   Vision モード
              (デフォルト)     (--caps vision)
```

| 判断基準 | Snapshot モード | Vision モード |
|---------|---------------|-------------|
| 一般的なWebアプリ（フォーム、ボタン、リンク等） | **推奨** | 不要 |
| Canvas ベースのアプリ（グラフ描画、ゲーム等） | 不十分 | **推奨** |
| カスタム描画のUI（SVG、WebGL等） | 不十分 | **推奨** |
| セマンティックHTMLで構成されたページ | **推奨** | 不要 |
| アクセシビリティ属性が欠如しているページ | 動作困難 | **推奨** |
| 高速な操作が求められる場合 | **推奨** | 低速 |
| トークンコストを抑えたい場合 | **推奨** | コスト高 |

**推奨: まず Snapshot モードを試し、うまく動作しない場合にのみ Vision モードを使う。**

---

## 5. 設定オプション

### コマンドライン引数

```bash
npx @playwright/mcp@latest [オプション]
```

#### ブラウザ設定

| オプション | 説明 | デフォルト値 |
|-----------|------|-------------|
| `--browser <name>` | 使用するブラウザ（`chromium`, `firefox`, `webkit`, `chrome`, `msedge`） | `chromium` |
| `--headless` | ヘッドレスモードで実行する | `false` |
| `--viewport-size <WxH>` | ビューポートサイズ（例: `1280x720`） | ブラウザデフォルト |
| `--device <name>` | デバイスエミュレーション（例: `"iPhone 15"`） | なし |

#### プロファイル設定

| オプション | 説明 | デフォルト値 |
|-----------|------|-------------|
| `--user-data-dir <path>` | ブラウザプロファイルの保存先ディレクトリ | OS デフォルト |
| `--isolated` | 隔離モード（セッションごとに独立環境、永続化なし） | `false` |
| `--storage-state <path>` | クッキー/ローカルストレージの初期状態を指定する | なし |

#### ネットワーク設定

| オプション | 説明 |
|-----------|------|
| `--proxy-server <url>` | プロキシサーバーを指定する |
| `--ignore-https-errors` | HTTPS証明書エラーを無視する |
| `--allowed-origins <list>` | 許可するオリジンのリスト |

#### サーバー設定

| オプション | 説明 |
|-----------|------|
| `--port <number>` | HTTP/SSE モードのポート番号 |
| `--host <name>` | サーバーのホスト名 |

#### 機能制御

| オプション | 説明 |
|-----------|------|
| `--caps <list>` | 追加 capability をカンマ区切りで指定する（`vision`, `pdf`, `testing`, `tracing`） |

#### タイムアウト設定

| オプション | 説明 | デフォルト値 |
|-----------|------|-------------|
| `--timeout-action <ms>` | アクション実行のタイムアウト | `5000` |
| `--timeout-navigation <ms>` | ナビゲーションのタイムアウト | `60000` |

#### 初期化設定

| オプション | 説明 |
|-----------|------|
| `--init-page <path>` | ページ初期化用 TypeScript ファイル |
| `--init-script <path>` | 初期化スクリプト用 JavaScript ファイル |
| `--config <path>` | JSON 設定ファイルのパス |

### JSON 設定ファイル（`--config`）

`--config` オプションで指定する JSON ファイルにより、詳細な設定を一元管理できる:

```json
{
  "browser": {
    "browserName": "chromium",
    "launchOptions": {
      "headless": true,
      "args": ["--disable-gpu", "--no-sandbox"]
    },
    "contextOptions": {
      "viewport": { "width": 1280, "height": 720 },
      "locale": "ja-JP",
      "timezoneId": "Asia/Tokyo",
      "geolocation": { "latitude": 35.6762, "longitude": 139.6503 },
      "permissions": ["geolocation"]
    },
    "userDataDir": "/path/to/profile"
  },
  "server": {
    "port": 3100,
    "host": "localhost"
  },
  "network": {
    "allowedOrigins": ["http://localhost:*", "https://example.com"],
    "blockedOrigins": ["https://ads.example.com"]
  },
  "capabilities": ["pdf", "testing"]
}
```

### 実用的な設定例

#### CI環境向けの設定（ヘッドレス + 隔離モード）

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--headless",
        "--isolated",
        "--browser", "chromium",
        "--viewport-size", "1280x720"
      ]
    }
  }
}
```

#### 開発環境向けの設定（GUI + プロファイル永続化）

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--browser", "chrome",
        "--user-data-dir", "./tmp/playwright-profile"
      ]
    }
  }
}
```

#### フル機能の設定

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--caps", "vision,pdf,testing,tracing",
        "--viewport-size", "1920x1080",
        "--timeout-action", "10000",
        "--timeout-navigation", "30000"
      ]
    }
  }
}
```

### init-page によるページ初期化

`--init-page` で TypeScript ファイルを指定し、各ページのロード時に初期化処理を実行できる:

```typescript
// init-page.ts
import { Page } from '@playwright/test';

export default async ({ page }: { page: Page }) => {
  // 位置情報のパーミッションを許可する
  await page.context().grantPermissions(['geolocation']);

  // ビューポートサイズを設定する
  await page.setViewportSize({ width: 1280, height: 720 });

  // カスタムヘッダーを追加する
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ja-JP',
  });
};
```

```bash
npx @playwright/mcp@latest --init-page ./init-page.ts
```

---

## 6. Playwright Test Agents

Playwright v1.56 以降で導入された **AI 駆動のテスト自動化エージェント** である。3 つのエージェントが連携してテストのライフサイクル全体をカバーする。

### 初期セットアップ

```bash
# VS Code 向け
npx playwright init-agents --loop=vscode

# Claude Code 向け
npx playwright init-agents --loop=claude
```

このコマンドにより、以下のディレクトリ構造が生成される:

```
repo/
├── .github/               # エージェント定義ファイル
├── specs/                  # テスト計画（Markdown）
│   └── basic-operations.md
├── tests/                  # 生成されたテスト
│   ├── seed.spec.ts        # シードテスト（初期化用）
│   └── add-valid-todo.spec.ts
└── playwright.config.ts
```

### Planner Agent（計画立案エージェント）

**役割:** アプリケーションを探索し、自然言語の指示からテスト計画（Markdown）を生成する。

**入力:**
- 自然言語のテスト要求（例: 「ログイン機能をテストする」）
- シードテスト（`seed.spec.ts`）による環境初期化
- オプション: 製品要件ドキュメント

**出力:**
- `specs/` ディレクトリに Markdown 形式のテスト計画を保存する

**使用例:**

```bash
# VS Code のチャットから実行する
# 「ゲストチェックアウトのテスト計画を生成して」

# 生成されるテスト計画の例: specs/guest-checkout.md
```

**生成されるテスト計画の例:**

```markdown
# ゲストチェックアウト テスト計画

## 前提条件
- 商品が1つ以上カートに入っている状態

## テストケース

### TC-1: 正常系 - ゲストチェックアウト完了
1. カートページに遷移する
2. 「ゲストとして購入」ボタンをクリックする
3. 配送先情報を入力する
   - 氏名: テスト太郎
   - 住所: 東京都渋谷区...
   - 電話番号: 03-1234-5678
4. 「次へ」をクリックする
5. 支払い方法を選択する
6. 「注文確定」をクリックする
7. 注文完了ページが表示されることを確認する

### TC-2: 異常系 - 必須項目未入力
1. カートページに遷移する
2. 「ゲストとして購入」ボタンをクリックする
3. 必須項目を空のまま「次へ」をクリックする
4. バリデーションエラーが表示されることを確認する
```

### Generator Agent（テスト生成エージェント）

**役割:** Planner が生成したテスト計画（Markdown）を、実行可能な Playwright テストコードに変換する。

**入力:**
- `specs/` フォルダ内の Markdown テスト計画

**出力:**
- `tests/` ディレクトリに TypeScript の Playwright テストを生成する

**使用例:**

```bash
# VS Code のチャットから実行する
# 「specs/guest-checkout.md のテスト計画からテストコードを生成して」
```

**生成されるテストコードの例:**

```typescript
// tests/guest-checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('ゲストチェックアウト', () => {
  test.beforeEach(async ({ page }) => {
    // 商品をカートに追加する前準備
    await page.goto('/products/1');
    await page.getByRole('button', { name: 'カートに追加' }).click();
  });

  test('正常系 - ゲストチェックアウト完了', async ({ page }) => {
    await page.goto('/cart');
    await page.getByRole('button', { name: 'ゲストとして購入' }).click();

    // 配送先情報を入力する
    await page.getByLabel('氏名').fill('テスト太郎');
    await page.getByLabel('住所').fill('東京都渋谷区...');
    await page.getByLabel('電話番号').fill('03-1234-5678');

    await page.getByRole('button', { name: '次へ' }).click();

    // 支払い方法を選択する
    await page.getByLabel('クレジットカード').check();

    await page.getByRole('button', { name: '注文確定' }).click();

    // 注文完了を確認する
    await expect(page.getByText('ご注文ありがとうございます')).toBeVisible();
  });

  test('異常系 - 必須項目未入力', async ({ page }) => {
    await page.goto('/cart');
    await page.getByRole('button', { name: 'ゲストとして購入' }).click();

    // 必須項目を空のまま送信する
    await page.getByRole('button', { name: '次へ' }).click();

    // バリデーションエラーを確認する
    await expect(page.getByText('氏名は必須です')).toBeVisible();
    await expect(page.getByText('住所は必須です')).toBeVisible();
  });
});
```

### Healer Agent（修復エージェント）

**役割:** 失敗したテストを自動的に修復する。UIの変更（セレクタ変更、レイアウト変更等）を検出し、テストコードを更新する。

**入力:**
- 失敗したテストファイル

**出力:**
- 修復されたテストコード、またはスキップマーク（機能自体が壊れている場合）

**修復フロー:**

```
1. 失敗したテストのステップを再実行する
2. 現在のUI状態を検査する
3. 失敗原因を特定する:
   - セレクタの変更 → 新しいセレクタに更新する
   - タイミングの問題 → 待機処理を追加する
   - 要素の移動 → ロケータを修正する
4. パッチを適用する
5. テストを再実行して成功を確認する
6. 修復不可能な場合はテストをスキップとしてマークする
```

**使用例:**

```bash
# VS Code のチャットから実行する
# 「tests/guest-checkout.spec.ts が失敗しているので修復して」
```

**修復前（失敗するテスト）:**

```typescript
// ボタンのテキストが「購入する」から「注文を確定する」に変更された
await page.getByRole('button', { name: '購入する' }).click();
```

**修復後:**

```typescript
// Healer が新しいボタンテキストを検出して更新する
await page.getByRole('button', { name: '注文を確定する' }).click();
```

### シードテスト（seed.spec.ts）の役割

シードテストは、他のエージェントが参照する **テンプレート** および **環境初期化** の役割を持つ:

```typescript
// tests/seed.spec.ts
import { test, expect } from '@playwright/test';

test('アプリケーションが起動すること', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/タスクボード/);
});
```

- Planner はシードテストを実行してアプリの初期状態を把握する
- Generator はシードテストのパターン（import、fixture の使い方等）を参考にする
- Healer はシードテストの成功を前提条件として検証する

### エージェント定義の更新

Playwright のバージョンアップ時にエージェント定義を再生成することが推奨される:

```bash
npx playwright init-agents --loop=claude
```

新しいツールや改善された指示が反映される。

---

## 7. 実践ワークフロー

### ワークフロー1: テスト新規作成（MCP + Claude Code）

Claude Code に自然言語で指示し、MCP 経由でブラウザを操作しながらテストを生成するフロー。

```
ユーザー: 「タスク作成機能のE2Eテストを作って」

Claude Code の処理:
  1. MCP: browser_navigate({ url: "http://localhost:3000" })
     → ログインページが表示される

  2. MCP: browser_snapshot()
     → ページ構造を把握する
     → textbox "メールアドレス" [ref=3]
     → textbox "パスワード" [ref=4]
     → button "ログイン" [ref=5]

  3. MCP: browser_type({ ref: 3, text: "test@example.com" })
  4. MCP: browser_type({ ref: 4, text: "password" })
  5. MCP: browser_click({ ref: 5 })
  6. MCP: browser_wait_for({ text: "ダッシュボード" })

  7. MCP: browser_snapshot()
     → button "タスクを追加" [ref=10]

  8. MCP: browser_click({ ref: 10 })
  9. MCP: browser_snapshot()
     → dialog が表示される
     → textbox "タスク名" [ref=15]
     → textarea "説明" [ref=16]
     → button "保存" [ref=17]

  10. MCP: browser_type({ ref: 15, text: "テストタスク" })
  11. MCP: browser_type({ ref: 16, text: "テスト用の説明文" })
  12. MCP: browser_click({ ref: 17 })
  13. MCP: browser_wait_for({ text: "テストタスク" })

  → Claude: 上記操作をもとにテストコードを生成する
```

**生成されるテストコード:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('タスク作成', () => {
  test.beforeEach(async ({ page }) => {
    // ログインする
    await page.goto('http://localhost:3000');
    await page.getByRole('textbox', { name: 'メールアドレス' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'パスワード' }).fill('password');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page.getByText('ダッシュボード')).toBeVisible();
  });

  test('新しいタスクを作成できること', async ({ page }) => {
    // タスク追加ボタンをクリックする
    await page.getByRole('button', { name: 'タスクを追加' }).click();

    // タスク情報を入力する
    await page.getByRole('textbox', { name: 'タスク名' }).fill('テストタスク');
    await page.getByRole('textbox', { name: '説明' }).fill('テスト用の説明文');

    // 保存する
    await page.getByRole('button', { name: '保存' }).click();

    // タスクが一覧に表示されることを確認する
    await expect(page.getByText('テストタスク')).toBeVisible();
  });
});
```

### ワークフロー2: テスト失敗デバッグ

テストが失敗した際に、MCP を使って原因を調査するフロー。

```
ユーザー: 「タスク作成のテストが失敗している。原因を調べて」

Claude Code の処理:
  1. テストを実行してエラーメッセージを確認する
     → "Timeout waiting for selector: button[name='保存']"

  2. MCP: browser_navigate({ url: "http://localhost:3000" })
  3. MCP: browser_snapshot()
     → ページ構造を確認する

  4. MCP 経由でテストと同じ操作を再現する
     → タスク追加ダイアログを開く

  5. MCP: browser_snapshot()
     → ダイアログの構造を確認する
     → button "保存する" [ref=17]  ← テキストが変わっている！

  6. MCP: browser_console_messages({ level: "error" })
     → コンソールエラーの有無を確認する

  7. MCP: browser_network_requests()
     → APIリクエストの状態を確認する

  → Claude: 原因を特定する
     「ボタンのテキストが '保存' から '保存する' に変更されています。
      テストの該当行を更新してください。」
```

### ワークフロー3: Healer による自動修復

UI変更に伴うテスト失敗を Healer Agent が自動修復するフロー。

```
前提: UIリファクタリングにより複数のセレクタが変更された

1. テスト実行
   → 3つのテストが失敗する

2. Healer Agent が起動する
   → 失敗テスト1: tests/login.spec.ts
     - 失敗箇所: getByRole('button', { name: 'ログイン' })
     - 現在のUI: button の name が 'サインイン' に変更されている
     - 修復: name を 'サインイン' に更新する
     - テスト再実行 → 成功

   → 失敗テスト2: tests/task-create.spec.ts
     - 失敗箇所: getByLabel('タスク名')
     - 現在のUI: label が 'タイトル' に変更されている
     - 修復: label を 'タイトル' に更新する
     - テスト再実行 → 成功

   → 失敗テスト3: tests/task-delete.spec.ts
     - 失敗箇所: 削除APIが404を返す
     - 現在のUI: 削除機能自体が廃止されている
     - 修復不可: テストを skip としてマークする
     - 警告: 「削除機能が見つかりません。機能が廃止された可能性があります」

3. 結果サマリ
   - 修復成功: 2件
   - スキップ: 1件（要確認）
```

### ワークフロー4: レスポンシブデザインのテスト

MCP の `browser_resize` を活用して、複数のビューポートでテストするフロー。

```
ユーザー: 「タスク一覧ページがモバイルでも正しく表示されるか確認して」

Claude Code の処理:
  1. MCP: browser_navigate({ url: "http://localhost:3000/tasks" })

  2. デスクトップ表示の確認
     MCP: browser_resize({ width: 1920, height: 1080 })
     MCP: browser_snapshot()
     MCP: browser_take_screenshot({ filename: "desktop.png" })

  3. タブレット表示の確認
     MCP: browser_resize({ width: 768, height: 1024 })
     MCP: browser_snapshot()
     MCP: browser_take_screenshot({ filename: "tablet.png" })

  4. モバイル表示の確認
     MCP: browser_resize({ width: 375, height: 812 })
     MCP: browser_snapshot()
     MCP: browser_take_screenshot({ filename: "mobile.png" })

  → Claude: 各ビューポートでのレイアウトの違いを報告する
```

---

## 8. コンテキストコストに関する注意

### ツール定義によるトークン消費

Playwright MCP Server は多数のツールを公開しており、それらの **ツール定義（JSON Schema）自体がコンテキストウィンドウを消費する**。

```
コンテキストウィンドウの内訳（概算）:
┌─────────────────────────────────────────────┐
│ システムプロンプト           5-10%           │
│ MCP ツール定義              15-20%  ← 注意  │
│ 会話履歴                    残り             │
└─────────────────────────────────────────────┘
```

**問題:**
- Playwright MCP だけで **15-20% のコンテキスト** がツール定義に消費される可能性がある
- 複数の MCP Server を同時接続すると、さらにトークン消費が増大する
- 会話が長くなるほど、実際の作業に使えるコンテキストが圧迫される

### ベストプラクティス

**1. 必要な MCP のみ接続する**

```json
// 悪い例: 使わない MCP も含めて全て接続する
{
  "mcpServers": {
    "playwright": { ... },
    "github": { ... },
    "slack": { ... },
    "database": { ... },
    "filesystem": { ... }
  }
}

// 良い例: 作業に必要な MCP のみ接続する
{
  "mcpServers": {
    "playwright": { ... }
  }
}
```

**2. 必要な capability のみ有効にする**

```bash
# 悪い例: 全 capability を有効にする
npx @playwright/mcp@latest --caps vision,pdf,testing,tracing

# 良い例: 必要なものだけ有効にする
npx @playwright/mcp@latest --caps testing
```

**3. セッションを適切に区切る**

長時間の作業では、定期的に新しいセッションを開始することで、会話履歴によるコンテキスト圧迫を回避する。

**4. MCP 接続の切り替え**

Claude Code では、作業フェーズに応じて MCP の接続を切り替えることを検討する:

```bash
# テスト作成フェーズ: Playwright MCP を有効にする
claude mcp add playwright npx @playwright/mcp@latest

# コーディングフェーズ: Playwright MCP を無効にする（不要なトークン消費を回避する）
claude mcp remove playwright
```

---

## 9. トラブルシューティング

### ブラウザが起動しない場合

**症状:** MCP ツールを呼び出してもブラウザが開かない。

**対処法:**

```bash
# 1. Playwright ブラウザがインストールされているか確認する
npx playwright install

# 2. 特定のブラウザのみインストールする
npx playwright install chromium

# 3. 依存パッケージもインストールする（Linux環境）
npx playwright install --with-deps chromium

# 4. MCP Server 側でブラウザをインストールする
# MCP ツール: browser_install({ browser: "chromium" })
```

**よくある原因:**

| 原因 | 対処 |
|------|------|
| ブラウザバイナリがない | `npx playwright install` を実行する |
| Node.js バージョンが古い | Node.js 18 以上に更新する |
| パーミッションエラー | `sudo npx playwright install-deps` を実行する（Linux） |
| ポート競合 | 既に起動している MCP Server を終了する |

### headless モードの切り替え

**CI環境ではヘッドレスモードが必須** だが、ローカル開発では GUI モードが便利なことが多い。

```bash
# ヘッドレスモード（CI向け）
npx @playwright/mcp@latest --headless

# GUIモード（ローカル開発向け、デフォルト）
npx @playwright/mcp@latest
```

**Claude Code での切り替え:**

```bash
# ヘッドレスモードに変更する
claude mcp remove playwright
claude mcp add playwright npx @playwright/mcp@latest --headless

# GUIモードに戻す
claude mcp remove playwright
claude mcp add playwright npx @playwright/mcp@latest
```

**リモート環境（SSH接続等）でGUIモードが動作しない場合:**

```bash
# ヘッドレスモードを使用する（ディスプレイがない環境）
npx @playwright/mcp@latest --headless
```

### セッション永続化（userDataDir）

ブラウザのプロファイル（Cookie、ログイン情報、設定等）を永続化する方法。

**永続的なプロファイル（デフォルト動作）:**

```bash
# OS デフォルトのプロファイルディレクトリを使用する
npx @playwright/mcp@latest
# → ブラウザを閉じても次回起動時にログイン状態等が維持される
```

**カスタムプロファイルディレクトリ:**

```bash
# 指定ディレクトリにプロファイルを保存する
npx @playwright/mcp@latest --user-data-dir ./tmp/my-profile
```

**隔離モード（セッション間でデータを共有しない）:**

```bash
# 毎回クリーンな状態で起動する
npx @playwright/mcp@latest --isolated
```

**保存済み状態からの復元:**

```bash
# Cookie やローカルストレージを事前に保存した状態から復元する
npx @playwright/mcp@latest --isolated --storage-state ./auth-state.json
```

`storage-state.json` の作成方法:

```typescript
// 認証状態を保存するスクリプト
import { chromium } from '@playwright/test';

async function saveAuthState() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // ログイン操作を行う
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('メールアドレス').fill('user@example.com');
  await page.getByLabel('パスワード').fill('password');
  await page.getByRole('button', { name: 'ログイン' }).click();
  await page.waitForURL('/dashboard');

  // 認証状態を保存する
  await context.storageState({ path: './auth-state.json' });
  await browser.close();
}

saveAuthState();
```

### タイムアウト対処

**症状:** `Timeout exceeded` エラーが発生する。

**タイムアウト設定の調整:**

```bash
# アクションタイムアウトを10秒に延長する（デフォルト: 5秒）
npx @playwright/mcp@latest --timeout-action 10000

# ナビゲーションタイムアウトを120秒に延長する（デフォルト: 60秒）
npx @playwright/mcp@latest --timeout-navigation 120000
```

**MCP ツール側での待機:**

```
# 明示的にテキストが表示されるまで待機する
browser_wait_for({ text: "読み込み完了" })

# 特定の時間だけ待機する
browser_wait_for({ time: 5000 })

# テキストが消えるまで待機する（ローディング完了を検出する）
browser_wait_for({ textGone: "読み込み中..." })
```

**よくあるタイムアウトの原因と対策:**

| 原因 | 対策 |
|------|------|
| サーバーの応答が遅い | `--timeout-navigation` を延長する |
| 非同期処理の完了を待てていない | `browser_wait_for` で明示的に待機する |
| 要素がまだレンダリングされていない | `browser_wait_for({ text: "..." })` で表示を待つ |
| SPA のルーティングが遅い | ナビゲーション後に `browser_wait_for` を挟む |
| ネットワークリクエストが遅い | `browser_network_requests` でリクエスト状態を確認する |

### MCP Server の接続が切れる場合

**症状:** 操作中に MCP Server との接続が切断される。

**対処法:**

```bash
# 1. プロセスを確認する
ps aux | grep playwright

# 2. 既存プロセスを終了する
pkill -f "@playwright/mcp"

# 3. MCP Server を再登録する
claude mcp remove playwright
claude mcp add playwright npx @playwright/mcp@latest

# 4. Claude Code を再起動する
```

### デバッグ用の情報収集

問題の切り分けのために、以下の情報を収集する:

```
# ページの状態を確認する
browser_snapshot()

# コンソールエラーを確認する
browser_console_messages({ level: "error" })

# ネットワークエラーを確認する
browser_network_requests()

# スクリーンショットを撮影する（視覚的な確認）
browser_take_screenshot({ fullPage: true })
```

---

## 参考リンク

- [Playwright MCP GitHub リポジトリ](https://github.com/microsoft/playwright-mcp)
- [Playwright 公式ドキュメント - Test Agents](https://playwright.dev/docs/test-agents)
- [Playwright MCP npm パッケージ](https://www.npmjs.com/package/@playwright/mcp)
- [Model Context Protocol 仕様](https://modelcontextprotocol.io/)
