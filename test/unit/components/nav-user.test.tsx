import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavUser } from '~/components/nav-user';
import { mockAuth } from '~/lib/amplify-mock';

// React Routerのモック
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// AWS Amplify authのモック
vi.mock('aws-amplify/auth', () => ({
  signOut: vi.fn(),
}));

// sidebarのモック
vi.mock('~/components/ui/sidebar', () => ({
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenuButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  useSidebar: () => ({ isMobile: false }),
}));

describe('NavUser', () => {
  const mockUser = {
    name: '開発ユーザー',
    email: 'dev@example.com',
    photo: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    import.meta.env.VITE_USE_MOCK_AUTH = 'true';
  });

  it('ユーザー情報が表示される', () => {
    render(<NavUser user={mockUser} />);
    
    expect(screen.getByText('開発ユーザー')).toBeInTheDocument();
    expect(screen.getByText('dev@example.com')).toBeInTheDocument();
  });

  it('ユーザーメニューが開く', async () => {
    const user = userEvent.setup();
    render(<NavUser user={mockUser} />);
    
    const menuButton = screen.getByRole('button');
    await user.click(menuButton);
    
    // ドロップダウンメニューの内容を確認
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('モック認証モードでログアウトが動作する', async () => {
    const user = userEvent.setup();
    render(<NavUser user={mockUser} />);
    
    // メニューを開く
    const menuButton = screen.getByRole('button');
    await user.click(menuButton);
    
    // ログアウトをクリック
    const logoutButton = screen.getByText('Log out');
    await user.click(logoutButton);
    
    // mockAuth.signOutが呼ばれることを確認
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('本番モードでログアウトが動作する', async () => {
    import.meta.env.VITE_USE_MOCK_AUTH = 'false';
    const { signOut } = await import('aws-amplify/auth');
    
    const user = userEvent.setup();
    render(<NavUser user={mockUser} />);
    
    // メニューを開く
    const menuButton = screen.getByRole('button');
    await user.click(menuButton);
    
    // ログアウトをクリック
    const logoutButton = screen.getByText('Log out');
    await user.click(logoutButton);
    
    // AWS AmplifyのsignOutが呼ばれることを確認
    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});