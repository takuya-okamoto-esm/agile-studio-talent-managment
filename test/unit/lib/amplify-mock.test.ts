import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockAuth, mockUser, mockAmplifyConfig } from '~/lib/amplify-mock';

// localStorageのモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// @ts-ignore
global.localStorage = localStorageMock;

describe('モック認証システム', () => {
  beforeEach(() => {
    // 各テスト前にlocalStorageをクリア
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    
    // 環境変数の設定
    import.meta.env.VITE_USE_MOCK_AUTH = 'true';
  });

  describe('mockAmplifyConfig', () => {
    it('モックのAmplify設定を持つ', () => {
      expect(mockAmplifyConfig).toHaveProperty('Auth');
      expect(mockAmplifyConfig.Auth.Cognito).toHaveProperty('userPoolId', 'mock-user-pool');
      expect(mockAmplifyConfig.Auth.Cognito).toHaveProperty('userPoolClientId', 'mock-client-id');
      expect(mockAmplifyConfig.Auth.Cognito).toHaveProperty('identityPoolId', 'mock-identity-pool');
    });
  });

  describe('mockUser', () => {
    it('デフォルトのモックユーザー情報を持つ', () => {
      expect(mockUser).toHaveProperty('userId', 'mock-user-123');
      expect(mockUser).toHaveProperty('username', 'dev@example.com');
      expect(mockUser.signInDetails).toHaveProperty('loginId', 'dev@example.com');
    });
  });

  describe('mockAuth.signIn', () => {
    it('モック認証が有効な場合、ログインが成功する', async () => {
      const credentials = { username: 'test@example.com', password: 'password123' };
      const result = await mockAuth.signIn(credentials);
      
      expect(result).toHaveProperty('isSignedIn', true);
      expect(result.nextStep).toHaveProperty('signInStep', 'DONE');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('mockAuthToken', 'mock-token');
    });

    it('モック認証が無効な場合、エラーがスローされる', async () => {
      import.meta.env.VITE_USE_MOCK_AUTH = 'false';
      
      await expect(mockAuth.signIn({ username: 'test', password: 'pass' }))
        .rejects.toThrow('Mock auth not enabled');
    });
  });

  describe('mockAuth.getCurrentUser', () => {
    it('認証済みの場合、ユーザー情報を返す', async () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      
      const user = await mockAuth.getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    it('未認証の場合、エラーがスローされる', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      await expect(mockAuth.getCurrentUser())
        .rejects.toThrow('Not authenticated');
    });

    it('モック認証が無効な場合、エラーがスローされる', async () => {
      import.meta.env.VITE_USE_MOCK_AUTH = 'false';
      
      await expect(mockAuth.getCurrentUser())
        .rejects.toThrow('Mock auth not enabled');
    });
  });

  describe('mockAuth.signOut', () => {
    it('モック認証が有効な場合、ログアウトが成功する', async () => {
      const result = await mockAuth.signOut();
      
      expect(result).toEqual({});
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('mockAuthToken');
    });

    it('モック認証が無効な場合、エラーがスローされる', async () => {
      import.meta.env.VITE_USE_MOCK_AUTH = 'false';
      
      await expect(mockAuth.signOut())
        .rejects.toThrow('Mock auth not enabled');
    });
  });
});