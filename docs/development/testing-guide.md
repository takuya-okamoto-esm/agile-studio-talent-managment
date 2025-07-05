# 開発時のテスト・検証ガイド

## 概要

このドキュメントは、Agile Studio Talent Management Systemの開発時におけるテスト実行と検証手順をまとめたものです。

## テスト環境

### 使用ツール

- **テストランナー**: Vitest 3.x
- **テストライブラリ**: React Testing Library
- **アサーション**: Vitest + @testing-library/jest-dom
- **環境**: jsdom

### セットアップ

```bash
# Node.js v20環境に切り替え
source .autorc
# または
nvm use 20

# 依存関係のインストール
npm ci
```

## テストコマンド

### 基本的なテスト実行

```bash
# 全テストを実行
npm run test

# ウォッチモードでテスト実行（開発中推奨）
npm run test -- --watch

# カバレッジレポート付きでテスト実行
npm run test -- --coverage

# 特定のテストファイルのみ実行
npm run test -- app/routes/home.test.tsx

# 特定のディレクトリのテストのみ実行
npm run test -- test/unit
```

### テスト結果の見方

```
✓ app/routes/home.test.tsx (1 test) 21ms
✓ test/unit/lib/amplify-mock.test.ts (12 tests) 45ms
✓ test/unit/components/nav-user.test.tsx (4 tests) 123ms

Test Files  3 passed (3)
     Tests  17 passed (17)
  Duration  4.70s
```

## テストの書き方

### 1. ユニットテスト（推奨）

**ファイル配置**: `test/unit/` または コンポーネントと同じディレクトリ

**例: モック認証のテスト**

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockAuth, mockUser } from "~/lib/amplify-mock";

describe("モック認証システム", () => {
  beforeEach(() => {
    // テスト前の初期化
    import.meta.env.VITE_USE_MOCK_AUTH = "true";
  });

  it("ログインが成功する", async () => {
    const result = await mockAuth.signIn({
      username: "test@example.com",
      password: "password123",
    });

    expect(result.isSignedIn).toBe(true);
  });
});
```

### 2. コンポーネントテスト

**例: Reactコンポーネントのテスト**

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from '~/components/my-component';

describe('MyComponent', () => {
  it('ボタンクリックで動作する', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    const button = screen.getByRole('button', { name: 'Click me' });
    await user.click(button);

    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### 3. 統合テスト

**ファイル配置**: `test/integration/`

**例: API連携のテスト**

```typescript
describe("Account API統合", () => {
  it("アカウント一覧を取得できる", async () => {
    // モックサーバーの設定
    // APIコールのテスト
    // レスポンスの検証
  });
});
```

## 開発フロー

### TDD（テスト駆動開発）アプローチ

1. **Red**: 失敗するテストを書く
2. **Green**: テストを通す最小限のコードを書く
3. **Refactor**: コードを改善する

```bash
# ウォッチモードで開発
npm run test -- --watch

# 1. 新しいテストを追加（Red）
# 2. 実装を追加（Green）
# 3. リファクタリング（Refactor）
```

### 開発中の検証手順

#### 1. 機能追加前

```bash
# 既存のテストが通ることを確認
npm run test

# 型チェック
npm run typecheck
```

#### 2. 機能実装中

```bash
# ウォッチモードでテスト実行
npm run test -- --watch

# 特定のテストに集中
npm run test -- --watch test/unit/my-feature.test.ts
```

#### 3. 機能実装後

```bash
# 全テストを実行
npm run test

# カバレッジ確認
npm run test -- --coverage

# リント実行
npm run lint

# 型チェック
npm run typecheck
```

## モック戦略

### 1. Amplifyクライアントのモック

```typescript
vi.mock("~/lib/amplify-client", () => ({
  client: {
    models: {
      Account: {
        list: vi.fn(),
        create: vi.fn(),
      },
    },
  },
}));
```

### 2. React Routerのモック

```typescript
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLoaderData: () => ({}),
  };
});
```

### 3. 環境変数のモック

```typescript
beforeEach(() => {
  import.meta.env.VITE_USE_MOCK_AUTH = "true";
});
```

## E2Eテスト

### ブラウザコンソールテスト

```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:5173/login-mock にアクセス
# 開発者ツールのコンソールで以下を実行
runE2ETest()
```

### 手動E2Eテスト

`test/manual/e2e-test-manual.md`の手順に従って実施

## トラブルシューティング

### よくある問題

#### 1. テストが見つからない

```bash
# Vitestの設定を確認
cat vitest.config.ts

# テストファイルの拡張子を確認（.test.ts, .spec.ts）
```

#### 2. import エラー

```bash
# tsconfig.jsonのパスエイリアスを確認
# vitest.config.tsのresolve.aliasを確認
```

#### 3. 環境変数が効かない

```typescript
// テスト内で明示的に設定
import.meta.env.VITE_USE_MOCK_AUTH = "true";
```

## ベストプラクティス

### 1. テストの独立性

- 各テストは他のテストに依存しない
- `beforeEach`で初期化を行う

### 2. 明確な命名

```typescript
// 良い例
describe("認証フロー", () => {
  it("正しい認証情報でログインできる", () => {});
  it("無効な認証情報でエラーが表示される", () => {});
});
```

### 3. AAA パターン

```typescript
it("ユーザーを作成できる", () => {
  // Arrange（準備）
  const userData = { name: "Test User" };

  // Act（実行）
  const result = createUser(userData);

  // Assert（検証）
  expect(result).toHaveProperty("id");
});
```

### 4. データテストID

```tsx
// コンポーネント
<button data-testid="submit-button">Submit</button>;

// テスト
const button = screen.getByTestId("submit-button");
```

## 継続的改善

### カバレッジ目標

- ユニットテスト: 80%以上
- 統合テスト: 主要フローをカバー
- E2Eテスト: クリティカルパスをカバー

### レポート確認

```bash
# カバレッジレポート生成
npm run test -- --coverage

# HTMLレポートを開く
open coverage/index.html
```

## 関連ドキュメント

- [テストディレクトリ構成ガイドライン](../../test/README.md)
- [E2E動作検証マニュアル](../../test/manual/e2e-test-manual.md)
- [モック認証システム実装作業報告](../logs/20250705_モック認証システム実装作業報告.md)

---

最終更新: 2025年7月5日
