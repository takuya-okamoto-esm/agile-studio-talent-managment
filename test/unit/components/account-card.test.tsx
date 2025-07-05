import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountCard } from '~/components/account-card';

describe('AccountCard', () => {
  const mockAccount = {
    id: 'test-account-1',
    name: '山田太郎',
    organizationLine: '開発部 / エンジニアリング課',
    residence: '東京都',
    photo: null,
  };

  it('アカウント情報が正しく表示される', () => {
    render(<AccountCard account={mockAccount} />);
    
    expect(screen.getByText('山田太郎')).toBeInTheDocument();
    expect(screen.getByText('開発部 / エンジニアリング課')).toBeInTheDocument();
    expect(screen.getByText('東京都')).toBeInTheDocument();
  });

  it('写真がない場合、名前の最初の文字がアバターとして表示される', () => {
    render(<AccountCard account={mockAccount} />);
    
    // 写真がない場合のアバター（名前の最初の文字）
    expect(screen.getByText('山')).toBeInTheDocument();
    
    // 写真要素は存在しない
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('写真がある場合、写真が表示される', () => {
    const accountWithPhoto = {
      ...mockAccount,
      photo: 'https://example.com/photo.jpg',
    };
    
    render(<AccountCard account={accountWithPhoto} />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/photo.jpg');
    expect(image).toHaveAttribute('alt', "山田太郎's photo");
    
    // アバター文字は表示されない
    expect(screen.queryByText('山')).not.toBeInTheDocument();
  });

  it('クリックハンドラーが設定されている場合、クリック時に呼ばれる', async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();
    
    render(<AccountCard account={mockAccount} onClick={mockOnClick} />);
    
    // cursor-pointerクラスを持つ要素を取得
    const card = document.querySelector('.cursor-pointer');
    await user.click(card!);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('クリックハンドラーが設定されていない場合でもエラーにならない', async () => {
    const user = userEvent.setup();
    
    render(<AccountCard account={mockAccount} />);
    
    // cursor-pointerクラスを持つ要素を取得
    const card = document.querySelector('.cursor-pointer');
    await user.click(card!);
    
    // エラーが発生しないことを確認
    expect(true).toBe(true);
  });

  it('空の文字列の名前でもアバターが表示される', () => {
    const accountWithEmptyName = {
      ...mockAccount,
      name: '',
    };
    
    render(<AccountCard account={accountWithEmptyName} />);
    
    // アバター部分が存在することを確認（空文字でも div は描画される）
    const avatar = document.querySelector('.w-16.h-16.bg-gray-400.rounded-full');
    expect(avatar).toBeInTheDocument();
  });

  it('英語名でも最初の文字がアバターとして表示される', () => {
    const englishAccount = {
      ...mockAccount,
      name: 'John Doe',
    };
    
    render(<AccountCard account={englishAccount} />);
    
    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('organizationLineとresidenceがnullの場合でもエラーにならない', () => {
    const accountWithNullFields = {
      ...mockAccount,
      organizationLine: null as any,
      residence: null as any,
    };
    
    render(<AccountCard account={accountWithNullFields} />);
    
    expect(screen.getByText('山田太郎')).toBeInTheDocument();
    // null値は空文字として表示される
  });

  it('長い名前でも正しく表示される', () => {
    const longNameAccount = {
      ...mockAccount,
      name: 'とても長い名前の人物です',
    };
    
    render(<AccountCard account={longNameAccount} />);
    
    expect(screen.getByText('とても長い名前の人物です')).toBeInTheDocument();
    expect(screen.getByText('と')).toBeInTheDocument(); // アバター
  });

  it('hover状態でshadow効果が適用される', () => {
    render(<AccountCard account={mockAccount} />);
    
    const card = document.querySelector('.cursor-pointer');
    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('transition-shadow');
  });

  it('cursor-pointerクラスが適用される', () => {
    render(<AccountCard account={mockAccount} />);
    
    const card = document.querySelector('.cursor-pointer');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('画像のalt属性が正しく設定される', () => {
    const accountWithPhoto = {
      ...mockAccount,
      name: 'テストユーザー',
      photo: 'https://example.com/test.jpg',
    };
    
    render(<AccountCard account={accountWithPhoto} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', "テストユーザー's photo");
  });
});