import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "~/hooks/use-mobile";

// window.matchMediaのモック
const mockMatchMedia = vi.fn();

// window.innerWidthのモック
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

// matchMediaのモック実装
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

describe("useIsMobile", () => {
  beforeEach(() => {
    // matchMediaのモックを設定
    mockMatchMedia.mockReturnValue({
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      matches: false,
    });

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });

    // モック関数をクリア
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
    mockMatchMedia.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態では isMobile が false を返す（デスクトップサイズ）", () => {
    window.innerWidth = 1024;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("モバイルサイズ（767px以下）では isMobile が true を返す", () => {
    window.innerWidth = 767;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("ちょうど768pxでは isMobile が false を返す（ブレークポイント境界）", () => {
    window.innerWidth = 768;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("matchMediaが正しいクエリで呼ばれる", () => {
    renderHook(() => useIsMobile());

    expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 767px)");
  });

  it("イベントリスナーが正しく設定される", () => {
    renderHook(() => useIsMobile());

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("アンマウント時にイベントリスナーが削除される", () => {
    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("ウィンドウサイズ変更時にisMobileが更新される", () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());

    // 初期状態：デスクトップ
    expect(result.current).toBe(false);

    // ウィンドウサイズを変更
    act(() => {
      window.innerWidth = 500;
      // changeイベントをシミュレート
      const changeHandler = mockAddEventListener.mock.calls[0][1];
      changeHandler();
    });

    expect(result.current).toBe(true);
  });

  it("複数回のサイズ変更に対応する", () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());

    // デスクトップ → モバイル
    act(() => {
      window.innerWidth = 600;
      const changeHandler = mockAddEventListener.mock.calls[0][1];
      changeHandler();
    });
    expect(result.current).toBe(true);

    // モバイル → デスクトップ
    act(() => {
      window.innerWidth = 1200;
      const changeHandler = mockAddEventListener.mock.calls[0][1];
      changeHandler();
    });
    expect(result.current).toBe(false);

    // デスクトップ → モバイル（再度）
    act(() => {
      window.innerWidth = 400;
      const changeHandler = mockAddEventListener.mock.calls[0][1];
      changeHandler();
    });
    expect(result.current).toBe(true);
  });

  it("境界値でのテスト（766px, 767px, 768px, 769px）", () => {
    const testCases = [
      { width: 766, expected: true },
      { width: 767, expected: true },
      { width: 768, expected: false },
      { width: 769, expected: false },
    ];

    testCases.forEach(({ width, expected }) => {
      window.innerWidth = width;
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(expected);
    });
  });
});
