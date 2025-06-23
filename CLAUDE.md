# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

AWS Amplify Gen2とReact Router v7を使用したモダンな人材管理システム。
React 19、TypeScript、Tailwind CSS、shadcn/uiを使用し、SSRが有効化されている。

## 開発コマンド

```bash
# 開発サーバー起動 (http://localhost:5173)
npm run dev

# プロダクションビルド
npm run build

# 型チェック
npm run typecheck

# リント実行
npm run lint

# フォーマット実行
npm run format

# テスト実行
npm run test
```

## アーキテクチャ構成

### フロントエンド構造

- `app/root.tsx` - Amplify設定を含むアプリケーションルート
- `app/routes.ts` - React Router v7のネストルーティング定義
- `app/routes/protected/layout.tsx` - 認証保護されたレイアウト
- `app/components/` - shadcn/uiを含む再利用可能コンポーネント
- `app/lib/amplify-client.ts` - Amplifyクライアント設定

### バックエンド構造

- `amplify/backend.ts` - Amplifyバックエンド設定
- `amplify/data/resource.ts` - GraphQLスキーマとデータモデル
- `amplify/auth/resource.ts` - 認証設定

### データモデル

- **Account**: 従業員プロフィール（名前、メール、所属、居住地）
- **Project**: プロジェクト情報（期間、概要）
- **ProjectTechnology**: 技術カタログ
- **ProjectAssignment**: アカウント-プロジェクト間の多対多関係
- **ProjectTechnologyLink**: プロジェクト-技術間の多対多関係

## 重要な設定

- **認証**: AWS Cognito（メールベース）
- **データベース**: DynamoDB（Amplify管理）
- **権限**: 所有者ベース + 管理者グループ
- **SSR**: React Router v7で有効化
- **スタイル**: Tailwind CSS v4 + shadcn/ui（New Yorkスタイル）

## 主要機能

1. **アカウント管理**: CRUD操作 + CSV一括インポート
2. **プロジェクト管理**: プロジェクト情報とアサインメント管理
3. **技術管理**: プロジェクト技術カタログ
4. **認証**: 保護されたルートとロールベースアクセス

## 開発パターン

- ファイルベースルーティング（React Router v7）
- コンポーネント合成（shadcn/ui使用）
- 型安全なデータ操作（Amplify生成型使用）
- カスタムフック活用
- サーバーサイドレンダリング対応

## 設計書の参照・更新

### 設計書の場所

- `docs/design/システム設計書.md` - システム全体の設計概要
- `docs/design/技術アーキテクチャ.md` - 技術スタック・アーキテクチャ詳細
- `docs/design/データベース設計書.md` - DynamoDB設計・データモデル
- `docs/design/API設計書.md` - GraphQL API・型定義

### 開発時のルール

1. **機能追加・変更前**: 必ず関連する設計書を参照し、既存設計との整合性を確認
2. **実装後**: 設計に影響がある変更の場合は対応する設計書を更新
3. **新機能**: 新しいエンティティやAPIを追加する場合は設計書に追記
4. **アーキテクチャ変更**: 技術スタックや構成に変更がある場合は設計書を更新

### 設計書更新のタイミング

- データモデル変更時（amplify/data/resource.ts変更）
- 新しいページ・機能追加時
- 認証・認可ルール変更時
- 技術スタック変更時（package.json、設定ファイル変更）
- パフォーマンス最適化実装時
