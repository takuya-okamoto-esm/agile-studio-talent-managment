# Agile Studio Talent Management System

Devinを導入して作成したWebアプリケーション（Agile Studio のタレントマネジメントシステム）のリポジトリです。

[AIプログラマー「Devin」と挑む新たな開発の可能性 ～ アジャイル開発との親和性](https://www.agile-studio.jp/post/challenge-new-development-with-devin) で紹介しています。

## プロジェクト概要

Agile Studio のメンバーのスキルや経験、プロジェクトアサイン状況などを管理するためのシステムです。React Router と AWS Amplify を使用して構築されています。

## 開発環境セットアップ

### 必要なバージョン

- **Node.js**: v20.x以上（React Router v7要件）
- **npm**: v10.x以上

### Node.js環境切り替え

#### 方法1: 自動設定スクリプト使用

```bash
# プロジェクトディレクトリで実行
source .autorc
```

#### 方法2: nvm使用（推奨）

```bash
# Node.js v20をインストール（未インストールの場合）
nvm install 20

# プロジェクト用Node.js v20使用
nvm use

# 確認
node --version  # v20.x.x が表示されることを確認
```

### 1. 依存関係のインストール

プロジェクトのルートディレクトリで以下のコマンドを実行し、必要なパッケージをインストールします。

```bash
npm ci
```

### 2. 開発サーバーの起動

以下のコマンドで開発サーバーを起動します。ホットリロードが有効になります。

```bash
npm run dev
```

アプリケーションは `http://localhost:5173` で利用可能になります。

### その他の開発コマンド

```bash
# 型チェック（Amplify設定後）
npm run typecheck

# リント実行
npm run lint

# フォーマット実行
npm run format

# テスト実行
npm run test
```

## ビルド

本番用のビルドを作成するには、以下のコマンドを実行します。

```bash
npm run build
```

ビルド成果物は `build/` ディレクトリに出力されますが、Amplify Hosting でのデプロイ時には `amplify.yml` の設定に基づいて自動的にビルドが行われます。

## デプロイ (AWS Amplify Hosting)

このプロジェクトは AWS Amplify Hosting でのデプロイが推奨されます。

1.  **AWS Amplify Console にアクセス:** AWS マネジメントコンソールから Amplify Console を開きます。
2.  **新しいアプリを作成:** 「ウェブアプリをホスト」を選択し、アプリ作成プロセスを開始します。
3.  **リポジトリを接続:** このプロジェクトのリポジトリ（例: GitHub, GitLab, Bitbucket）を Amplify に接続します。
4.  **ブランチを選択:** デプロイしたいブランチを選択します。
5.  **ビルド設定の確認:** Amplify はリポジトリ内の `amplify.yml` を自動的に検出し、ビルド設定を構成します。通常、追加の設定は不要です。
6.  **デプロイ:** 設定を確認し、デプロイを開始します。

デプロイが完了すると、Amplify によって提供される URL でアプリケーションにアクセスできるようになります。CI/CD パイプラインも自動的に設定され、選択したブランチへのプッシュをトリガーに自動でビルドとデプロイが実行されます。

## 📚 ドキュメント

- [CLAUDE.md](./CLAUDE.md) - Claude Code用プロジェクト概要
- [システム設計書](./docs/design/システム設計書.md)
- [技術アーキテクチャ](./docs/design/技術アーキテクチャ.md)
- [データベース設計書](./docs/design/データベース設計書.md)
- [API設計書](./docs/design/API設計書.md)

## ⚠️ 注意事項

- Node.js v20未満では警告が表示されます
- 初回起動時は`amplify_outputs.json`が存在しないため型エラーが出ますが正常です
- Amplify設定後に`npx ampx generate`で型定義を生成してください

---

Built with ❤️ using React Router and AWS Amplify.
