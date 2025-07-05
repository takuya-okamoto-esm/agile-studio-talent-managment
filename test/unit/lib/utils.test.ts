import { describe, it, expect } from 'vitest';
import { cn } from '~/lib/utils';

describe('cn関数', () => {
  it('単一のクラス名を処理する', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('複数のクラス名を結合する', () => {
    expect(cn('text-red-500', 'bg-blue-100')).toBe('text-red-500 bg-blue-100');
  });

  it('条件付きクラス名を処理する', () => {
    expect(cn('base-class', true && 'conditional-class')).toBe('base-class conditional-class');
    expect(cn('base-class', false && 'conditional-class')).toBe('base-class');
  });

  it('Tailwind CSS のクラス競合を解決する', () => {
    // より具体的なクラスが優先される
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('配列形式のクラス名を処理する', () => {
    expect(cn(['text-red-500', 'bg-blue-100'])).toBe('text-red-500 bg-blue-100');
  });

  it('オブジェクト形式のクラス名を処理する', () => {
    expect(cn({
      'text-red-500': true,
      'bg-blue-100': false,
      'font-bold': true
    })).toBe('text-red-500 font-bold');
  });

  it('undefinedやnullを無視する', () => {
    expect(cn('text-red-500', undefined, null, 'bg-blue-100')).toBe('text-red-500 bg-blue-100');
  });

  it('空文字列を無視する', () => {
    expect(cn('text-red-500', '', 'bg-blue-100')).toBe('text-red-500 bg-blue-100');
  });

  it('複雑な組み合わせを処理する', () => {
    const isActive = true;
    const isDisabled = false;
    
    expect(cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class',
      { 'hover:bg-gray-100': !isDisabled },
      ['text-sm', 'font-medium']
    )).toBe('base-class active-class hover:bg-gray-100 text-sm font-medium');
  });

  it('引数なしの場合は空文字列を返す', () => {
    expect(cn()).toBe('');
  });

  it('レスポンシブクラスの競合を解決する', () => {
    expect(cn('text-sm', 'md:text-base', 'lg:text-lg')).toBe('text-sm md:text-base lg:text-lg');
    expect(cn('p-2', 'sm:p-4', 'p-6')).toBe('sm:p-4 p-6');
  });
});