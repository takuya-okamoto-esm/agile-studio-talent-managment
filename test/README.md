# テストディレクトリ構成ガイドライン

## 概要

このドキュメントは、Agile Studio Talent Management Systemのテストファイル整理ルールを定義します。

## ディレクトリ構造

```
test/
├── README.md           # このファイル
├── unit/              # ユニットテスト
├── integration/       # 統合テスト
├── e2e/              # E2E（End-to-End）テスト
├── manual/           # 手動テスト手順書
└── fixtures/         # テスト用フィクスチャデータ（必要に応じて）
```

## 各ディレクトリの役割

### `unit/`
**目的**: 個別のコンポーネント、関数、ユーティリティの単体テスト

**ファイル名規則**: 
- テスト対象と同じ名前 + `.test.ts` または `.spec.ts`
- 例: `auth-utils.test.ts`

**内容例**:
- 純粋関数のテスト
- Reactコンポーネントの単体テスト
- ユーティリティ関数のテスト

### `integration/`
**目的**: 複数のモジュール間の連携テスト

**ファイル名規則**:
- 機能名 + `.integration.test.ts`
- 例: `auth-flow.integration.test.ts`

**内容例**:
- API連携テスト
- データフロー検証
- サービス間の統合テスト

### `e2e/`
**目的**: ブラウザを使用した全体的な動作確認テスト

**ファイル名規則**:
- シナリオ名 + `.e2e.ts` または `.simulation.js`
- 例: `mock-auth.e2e.ts`, `mock-auth-simulation.js`

**内容例**:
- ユーザーシナリオの自動テスト
- Playwright/Cypressテスト
- ブラウザコンソール用シミュレーション

**現在のファイル**:
- `mock-auth-simulation.js`: モック認証のブラウザコンソールテスト

### `manual/`
**目的**: 手動で実行するテストの手順書

**ファイル名規則**:
- 機能名 + `-manual.md`
- 例: `e2e-test-manual.md`

**内容例**:
- 手動テスト手順書
- 検証チェックリスト
- トラブルシューティングガイド

**現在のファイル**:
- `e2e-test-manual.md`: E2E動作検証マニュアル

### `fixtures/`（オプション）
**目的**: テストで使用する共通データやモック

**ファイル名規則**:
- データ種類 + `.fixture.ts/json`
- 例: `users.fixture.json`

**内容例**:
- テストユーザーデータ
- モックレスポンス
- サンプルデータセット

## 命名規則

### ファイル名
1. **小文字とハイフン**を使用（kebab-case）
2. **説明的な名前**を使用
3. **適切な拡張子**を付与
   - TypeScript: `.test.ts`, `.spec.ts`, `.e2e.ts`
   - JavaScript: `.test.js`, `.spec.js`, `.simulation.js`
   - ドキュメント: `.md`

### テスト記述
```typescript
// 良い例
describe('AuthenticationFlow', () => {
  describe('when using mock authentication', () => {
    it('should redirect to login page when not authenticated', () => {
      // テスト内容
    });
  });
});

// 避けるべき例
describe('test1', () => {
  it('works', () => {
    // 不明瞭なテスト
  });
});
```

## テスト作成のベストプラクティス

### 1. テストの独立性
- 各テストは他のテストに依存しない
- テスト順序に関わらず実行可能

### 2. 明確な命名
- テストが何を検証するかを明確に記述
- `should` や `when` を使った説明的な文章

### 3. AAA パターン
```typescript
// Arrange（準備）
const user = { email: 'test@example.com' };

// Act（実行）
const result = login(user);

// Assert（検証）
expect(result).toBe(true);
```

### 4. テストデータ
- 実際のデータを使用しない
- テスト専用のモックデータを使用
- 機密情報を含めない

## テスト実行コマンド

```bash
# ユニットテスト実行
npm run test:unit

# 統合テスト実行
npm run test:integration

# E2Eテスト実行
npm run test:e2e

# 全テスト実行
npm run test
```

※注: 上記コマンドは将来的に`package.json`に追加される予定

## フォルダ追加時の注意

新しいテストカテゴリが必要な場合：
1. このREADMEを更新
2. 適切な命名規則を定義
3. 目的と内容例を明記

## 現在のテストファイル

### E2Eテスト
- `test/e2e/mock-auth-simulation.js`
  - モック認証システムのブラウザコンソールテスト
  - ログインフロー全体の動作確認

### 手動テスト
- `test/manual/e2e-test-manual.md`
  - E2E動作検証の手動実行手順
  - トラブルシューティングガイド付き

## 今後の拡張予定

1. **Playwright E2Eテスト**
   - `test/e2e/mock-auth.playwright.ts`
   - 自動化されたブラウザテスト

2. **Vitest単体テスト**
   - `test/unit/components/*.test.tsx`
   - コンポーネントの単体テスト

3. **API統合テスト**
   - `test/integration/api/*.test.ts`
   - GraphQL APIのテスト

---

最終更新: 2025年7月5日