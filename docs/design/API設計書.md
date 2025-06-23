# API設計書

## 1. API概要

### 1.1 API仕様
- **プロトコル**: GraphQL over HTTPS
- **エンドポイント**: AWS Amplify Gen2 Managed GraphQL API
- **認証**: AWS Cognito JWT Token
- **データ形式**: JSON

### 1.2 設計原則
- **Type Safety**: TypeScript完全対応
- **Efficient Queries**: 必要なデータのみ取得
- **Consistent Naming**: 統一された命名規則
- **Error Handling**: 詳細なエラー情報提供
- **Authorization**: 細かい権限制御

## 2. GraphQL Schema

### 2.1 Type定義

#### 2.1.1 Account型
```graphql
type Account @model @auth(rules: [
  { allow: public, operations: [read] },
  { allow: owner, operations: [create, update, delete] },
  { allow: groups, groups: ["Admin"] }
]) {
  id: ID!
  name: String!
  email: AWSEmail! @index(name: "byEmail")
  photo: String
  organizationLine: String!
  residence: String!
  owner: String
  projects: [ProjectAssignment] @hasMany(indexName: "byAccount", fields: ["id"])
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

#### 2.1.2 Project型
```graphql
type Project @model @auth(rules: [
  { allow: public, operations: [read] },
  { allow: groups, groups: ["Admin"], operations: [create, update, delete] }
]) {
  id: ID!
  name: String!
  clientName: String!
  overview: String!
  startDate: AWSDate!
  endDate: AWSDate
  assignments: [ProjectAssignment] @hasMany(indexName: "byProject", fields: ["id"])
  technologies: [ProjectTechnologyLink] @hasMany(indexName: "byProject", fields: ["id"])
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

#### 2.1.3 ProjectTechnology型
```graphql
type ProjectTechnology @model @auth(rules: [
  { allow: public }
]) {
  id: ID!
  name: String!
  description: String
  projects: [ProjectTechnologyLink] @hasMany(indexName: "byTechnology", fields: ["id"])
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

#### 2.1.4 ProjectAssignment型
```graphql
type ProjectAssignment @model @auth(rules: [
  { allow: public, operations: [read] },
  { allow: groups, groups: ["Admin"], operations: [create, update, delete] }
]) {
  id: ID!
  projectId: ID! @index(name: "byProject")
  accountId: ID! @index(name: "byAccount")
  startDate: AWSDate!
  endDate: AWSDate
  project: Project @belongsTo(fields: ["projectId"])
  account: Account @belongsTo(fields: ["accountId"])
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

#### 2.1.5 ProjectTechnologyLink型
```graphql
type ProjectTechnologyLink @model @auth(rules: [
  { allow: public, operations: [read] },
  { allow: groups, groups: ["Admin"], operations: [create, update, delete] }
]) {
  id: ID!
  projectId: ID! @index(name: "byProject")
  technologyId: ID! @index(name: "byTechnology")
  project: Project @belongsTo(fields: ["projectId"])
  technology: ProjectTechnology @belongsTo(fields: ["technologyId"])
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

### 2.2 Query操作

#### 2.2.1 単一レコード取得
```graphql
# Account取得
query GetAccount($id: ID!) {
  getAccount(id: $id) {
    id
    name
    email
    photo
    organizationLine
    residence
    projects {
      items {
        id
        startDate
        endDate
        project {
          name
          clientName
        }
      }
    }
  }
}

# Project取得
query GetProject($id: ID!) {
  getProject(id: $id) {
    id
    name
    clientName
    overview
    startDate
    endDate
    assignments {
      items {
        id
        startDate
        endDate
        account {
          name
          email
        }
      }
    }
    technologies {
      items {
        id
        technology {
          name
          description
        }
      }
    }
  }
}
```

#### 2.2.2 リスト取得
```graphql
# 全Account取得
query ListAccounts(
  $filter: ModelAccountFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      email
      organizationLine
      residence
      createdAt
      updatedAt
    }
    nextToken
  }
}

# 全Project取得
query ListProjects(
  $filter: ModelProjectFilterInput
  $limit: Int
  $nextToken: String
) {
  listProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      clientName
      startDate
      endDate
      createdAt
      updatedAt
    }
    nextToken
  }
}

# 全ProjectTechnology取得
query ListProjectTechnologies(
  $filter: ModelProjectTechnologyFilterInput
  $limit: Int
  $nextToken: String
) {
  listProjectTechnologies(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      projects {
        items {
          project {
            name
          }
        }
      }
      createdAt
      updatedAt
    }
    nextToken
  }
}
```

### 2.3 Mutation操作

#### 2.3.1 作成操作
```graphql
# Account作成
mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    id
    name
    email
    photo
    organizationLine
    residence
    createdAt
    updatedAt
  }
}

# Project作成
mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    name
    clientName
    overview
    startDate
    endDate
    createdAt
    updatedAt
  }
}

# ProjectAssignment作成
mutation CreateProjectAssignment($input: CreateProjectAssignmentInput!) {
  createProjectAssignment(input: $input) {
    id
    projectId
    accountId
    startDate
    endDate
    project {
      name
    }
    account {
      name
    }
    createdAt
    updatedAt
  }
}
```

#### 2.3.2 更新操作
```graphql
# Account更新
mutation UpdateAccount($input: UpdateAccountInput!) {
  updateAccount(input: $input) {
    id
    name
    email
    photo
    organizationLine
    residence
    updatedAt
  }
}

# Project更新
mutation UpdateProject($input: UpdateProjectInput!) {
  updateProject(input: $input) {
    id
    name
    clientName
    overview
    startDate
    endDate
    updatedAt
  }
}
```

#### 2.3.3 削除操作
```graphql
# Account削除
mutation DeleteAccount($input: DeleteAccountInput!) {
  deleteAccount(input: $input) {
    id
    name
    email
  }
}

# Project削除
mutation DeleteProject($input: DeleteProjectInput!) {
  deleteProject(input: $input) {
    id
    name
  }
}
```

## 3. TypeScript型定義

### 3.1 生成型
```typescript
// amplify/data/resource.tsから自動生成
import type { Schema } from "../../amplify/data/resource";

// メイン型定義
export type Account = Schema["Account"]["type"];
export type Project = Schema["Project"]["type"];
export type ProjectTechnology = Schema["ProjectTechnology"]["type"];
export type ProjectAssignment = Schema["ProjectAssignment"]["type"];
export type ProjectTechnologyLink = Schema["ProjectTechnologyLink"]["type"];

// 入力型定義
export type CreateAccountInput = Schema["Account"]["createType"];
export type UpdateAccountInput = Schema["Account"]["updateType"];
export type CreateProjectInput = Schema["Project"]["createType"];
export type UpdateProjectInput = Schema["Project"]["updateType"];
```

### 3.2 カスタム型
```typescript
// フォーム用型定義
export interface AccountFormData {
  name: string;
  email: string;
  organizationLine: string;
  residence: string;
  photo?: string;
}

export interface ProjectFormData {
  name: string;
  clientName: string;
  overview: string;
  startDate: string;
  endDate?: string;
  technologyIds: string[];
}

// API応答型
export interface AccountWithProjects extends Account {
  projects: {
    items: (ProjectAssignment & {
      project: Pick<Project, 'name' | 'clientName'>;
    })[];
  };
}

export interface ProjectWithDetails extends Project {
  assignments: {
    items: (ProjectAssignment & {
      account: Pick<Account, 'name' | 'email'>;
    })[];
  };
  technologies: {
    items: (ProjectTechnologyLink & {
      technology: Pick<ProjectTechnology, 'name' | 'description'>;
    })[];
  };
}
```

## 4. API クライアント実装

### 4.1 クライアント設定
```typescript
// app/lib/amplify-client.ts
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);

export const client = generateClient<Schema>({
  authMode: "userPool",
});
```

### 4.2 CRUD操作の実装

#### 4.2.1 Account操作
```typescript
// Account関連のAPI呼び出し
export class AccountService {
  // 全取得
  static async listAll() {
    const response = await client.models.Account.list();
    return response.data || [];
  }

  // 詳細取得
  static async getById(id: string) {
    const response = await client.models.Account.get(
      { id },
      {
        selectionSet: [
          'id', 'name', 'email', 'photo', 'organizationLine', 'residence',
          'projects.id', 'projects.startDate', 'projects.endDate',
          'projects.project.name', 'projects.project.clientName'
        ]
      }
    );
    return response.data;
  }

  // 作成
  static async create(input: CreateAccountInput) {
    const response = await client.models.Account.create(input);
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    return response.data;
  }

  // 更新
  static async update(input: UpdateAccountInput) {
    const response = await client.models.Account.update(input);
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    return response.data;
  }

  // 削除
  static async delete(id: string) {
    const response = await client.models.Account.delete({ id });
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    return response.data;
  }
}
```

#### 4.2.2 Project操作
```typescript
export class ProjectService {
  static async listAll() {
    const response = await client.models.Project.list();
    return response.data || [];
  }

  static async getById(id: string) {
    const response = await client.models.Project.get(
      { id },
      {
        selectionSet: [
          'id', 'name', 'clientName', 'overview', 'startDate', 'endDate',
          'assignments.id', 'assignments.startDate', 'assignments.endDate',
          'assignments.account.name', 'assignments.account.email',
          'technologies.id', 'technologies.technology.name', 'technologies.technology.description'
        ]
      }
    );
    return response.data;
  }

  static async create(input: CreateProjectInput) {
    const response = await client.models.Project.create(input);
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    return response.data;
  }

  static async update(input: UpdateProjectInput) {
    const response = await client.models.Project.update(input);
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    return response.data;
  }
}
```

## 5. エラーハンドリング

### 5.1 エラー型定義
```typescript
// GraphQLErrors
interface GraphQLError {
  message: string;
  extensions?: {
    code: string;
    argumentName?: string;
    fieldName?: string;
  };
}

// カスタムエラー型
export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public field?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, field: string) {
    super(message, 'VALIDATION_ERROR', field);
    this.name = 'ValidationError';
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'アクセス権限がありません') {
    super(message, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}
```

### 5.2 エラーハンドリング実装
```typescript
// 共通エラーハンドラー
export function handleAPIError(errors: GraphQLError[]): never {
  const error = errors[0];
  
  switch (error.extensions?.code) {
    case 'UNAUTHORIZED':
      throw new AuthorizationError(error.message);
    
    case 'VALIDATION_ERROR':
      throw new ValidationError(
        error.message,
        error.extensions?.fieldName || 'unknown'
      );
    
    default:
      throw new APIError(error.message, error.extensions?.code || 'UNKNOWN_ERROR');
  }
}

// APIサービスでの使用例
export class AccountService {
  static async create(input: CreateAccountInput) {
    const response = await client.models.Account.create(input);
    
    if (response.errors) {
      handleAPIError(response.errors);
    }
    
    return response.data!;
  }
}
```

## 6. React Router統合

### 6.1 Loader実装
```typescript
// app/routes/protected/accounts/_index.tsx
import type { LoaderFunctionArgs } from "react-router";
import { AccountService } from "~/lib/services/account-service";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const accounts = await AccountService.listAll();
    return { accounts };
  } catch (error) {
    console.error('アカウント一覧の取得に失敗しました:', error);
    throw new Response('アカウント一覧の取得に失敗しました', { status: 500 });
  }
}

export default function AccountsIndex() {
  const { accounts } = useLoaderData<typeof loader>();
  
  return (
    <div>
      {accounts.map((account) => (
        <div key={account.id}>
          {account.name} - {account.email}
        </div>
      ))}
    </div>
  );
}
```

### 6.2 Action実装
```typescript
// app/routes/protected/accounts/new.tsx
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { AccountService } from "~/lib/services/account-service";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const accountData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    organizationLine: formData.get("organizationLine") as string,
    residence: formData.get("residence") as string,
    photo: formData.get("photo") as string || undefined,
  };

  try {
    await AccountService.create(accountData);
    return redirect("/accounts");
  } catch (error) {
    console.error('アカウント作成に失敗しました:', error);
    return { error: 'アカウント作成に失敗しました' };
  }
}
```

## 7. 認証・認可

### 7.1 認証ヘッダー
```typescript
// JWT Token自動付与
const client = generateClient<Schema>({
  authMode: "userPool", // Cognito User Pool認証
});

// カスタムヘッダー追加（必要な場合）
const clientWithCustomHeaders = generateClient<Schema>({
  authMode: "userPool",
  headers: async () => {
    const session = await fetchAuthSession();
    return {
      'Custom-Header': 'value',
      'Authorization': `Bearer ${session.tokens.accessToken}`
    };
  }
});
```

### 7.2 権限チェック
```typescript
// フロントエンド権限チェック
export function usePermissions() {
  const { user } = useAuthenticator();
  
  const isAdmin = user?.signInDetails?.loginId?.includes('admin') || false;
  const canManageProjects = isAdmin;
  const canManageAccounts = isAdmin;
  
  return {
    isAdmin,
    canManageProjects,
    canManageAccounts,
    canViewAll: true // 認証済みユーザーは全データ閲覧可能
  };
}

// 使用例
export default function ProjectActions({ projectId }: { projectId: string }) {
  const { canManageProjects } = usePermissions();
  
  if (!canManageProjects) {
    return null;
  }
  
  return (
    <div>
      <button>編集</button>
      <button>削除</button>
    </div>
  );
}
```

## 8. パフォーマンス最適化

### 8.1 効率的なクエリ
```typescript
// 必要なフィールドのみ取得
const efficientQuery = await client.models.Account.list({
  selectionSet: ['id', 'name', 'email'] // 必要最小限のフィールド
});

// 関連データも一度に取得
const accountWithProjects = await client.models.Account.get(
  { id: accountId },
  {
    selectionSet: [
      'id', 'name', 'email',
      'projects.id', 'projects.startDate', 'projects.endDate',
      'projects.project.name'
    ]
  }
);
```

### 8.2 並列処理
```typescript
// 複数API呼び出しの並列実行
export async function loadDashboardData() {
  const [accounts, projects, technologies] = await Promise.all([
    AccountService.listAll(),
    ProjectService.listAll(),
    ProjectTechnologyService.listAll()
  ]);
  
  return { accounts, projects, technologies };
}
```

### 8.3 キャッシュ戦略
```typescript
// React Router Cache
export function shouldRevalidate({ formMethod }: ShouldRevalidateFunctionArgs) {
  // フォーム送信時のみ再検証
  return formMethod != null;
}

// メモ化
const memoizedAccountData = useMemo(() => {
  return accounts.map(account => ({
    ...account,
    projectCount: account.projects?.items?.length || 0
  }));
}, [accounts]);
```

## 9. テスト設計

### 9.1 APIテスト
```typescript
// Vitest + MSW でのAPIテスト
import { describe, it, expect, beforeAll } from 'vitest';
import { AccountService } from '~/lib/services/account-service';

describe('AccountService', () => {
  beforeAll(() => {
    // Mock Amplify client
  });

  it('should create account successfully', async () => {
    const accountData = {
      name: 'テストユーザー',
      email: 'test@example.com',
      organizationLine: 'テスト部署',
      residence: 'テスト地域'
    };

    const result = await AccountService.create(accountData);

    expect(result).toBeDefined();
    expect(result.name).toBe(accountData.name);
    expect(result.email).toBe(accountData.email);
  });

  it('should handle validation errors', async () => {
    const invalidData = {
      name: '', // 必須フィールドが空
      email: 'invalid-email',
      organizationLine: 'テスト部署',
      residence: 'テスト地域'
    };

    await expect(AccountService.create(invalidData))
      .rejects
      .toThrow(ValidationError);
  });
});
```

## 10. 今後の拡張予定

### 10.1 機能拡張
```graphql
# スキル評価機能
type SkillAssessment @model {
  id: ID!
  accountId: ID!
  technologyId: ID!
  level: Int! # 1-5
  assessedAt: AWSDateTime!
  assessedBy: ID!
  account: Account @belongsTo(fields: ["accountId"])
  technology: ProjectTechnology @belongsTo(fields: ["technologyId"])
}

# 通知機能
type Notification @model {
  id: ID!
  recipientId: ID!
  title: String!
  message: String!
  type: NotificationType!
  isRead: Boolean!
  createdAt: AWSDateTime!
}

enum NotificationType {
  PROJECT_ASSIGNMENT
  SKILL_UPDATE
  SYSTEM_NOTIFICATION
}
```

### 10.2 技術拡張
- **GraphQL Subscription**: リアルタイム更新
- **Batch API**: 大量データ処理
- **File Upload**: S3統合によるファイルアップロード
- **Search API**: ElasticSearch統合による高度検索