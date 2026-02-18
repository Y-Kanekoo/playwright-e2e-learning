# Playwright E2E Learning Project

## 技術スタック
- **バックエンド**: Spring Boot 3.x + Java 21 + Gradle + H2/PostgreSQL
- **フロントエンド**: React 19 + TypeScript + Vite
- **E2Eテスト**: Playwright (TypeScript版) - 独立プロジェクト
- **インフラ**: Docker Compose

## プロジェクト構成
- `backend/` - Spring Boot REST API
- `frontend/` - React + TypeScript SPA
- `e2e/` - Playwright E2Eテスト（独立）
- `docs/` - 学習ドキュメント

## 言語設定
- 回答・コメント・ログ: 日本語
- 変数名・関数名: 英語
- コミットメッセージ: 日本語

## 重要な制約
- TypeScriptでは `any` 禁止
- `.env` はコミット禁止
- 機密情報のハードコード禁止
- フロントエンドコンポーネントには `data-testid` 属性を必ず付与（Playwright用）
