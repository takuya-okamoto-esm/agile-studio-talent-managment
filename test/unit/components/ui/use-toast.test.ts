import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// テストごとにモジュールを再インポートするため動的import
let useToast: any;
let toast: any;

describe("useToast", () => {
  beforeEach(async () => {
    vi.clearAllTimers();
    vi.resetModules();
    // テストごとに新しいモジュールインスタンスを取得
    const module = await import("~/components/ui/use-toast");
    useToast = module.useToast;
    toast = module.toast;
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("useToast hook", () => {
    it("初期状態では空のトースト配列を返す", () => {
      const { result } = renderHook(() => useToast());

      expect(result.current.toasts).toEqual([]);
    });

    it("toast関数を提供する", () => {
      const { result } = renderHook(() => useToast());

      expect(typeof result.current.toast).toBe("function");
    });

    it("dismiss関数を提供する", () => {
      const { result } = renderHook(() => useToast());

      expect(typeof result.current.dismiss).toBe("function");
    });
  });

  describe("toast function", () => {
    it("新しいトーストを追加できる", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: "テストトースト",
          description: "これはテスト用のトーストです",
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        title: "テストトースト",
        description: "これはテスト用のトーストです",
        open: true,
      });
      expect(result.current.toasts[0].id).toBeDefined();
    });

    it("複数のトーストを追加できる", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "トースト1" });
        result.current.toast({ title: "トースト2" });
        result.current.toast({ title: "トースト3" });
      });

      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts[0].title).toBe("トースト3");
      expect(result.current.toasts[1].title).toBe("トースト2");
      expect(result.current.toasts[2].title).toBe("トースト1");
    });

    it("最大5個のトーストまで保持する", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        for (let i = 1; i <= 7; i++) {
          result.current.toast({ title: `トースト${i}` });
        }
      });

      expect(result.current.toasts).toHaveLength(5);
      expect(result.current.toasts[0].title).toBe("トースト7");
      expect(result.current.toasts[4].title).toBe("トースト3");
    });

    it("トーストにvariantを設定できる", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: "エラートースト",
          variant: "destructive",
        });
      });

      expect(result.current.toasts[0].variant).toBe("destructive");
    });
  });

  describe("dismiss functionality", () => {
    it("特定のトーストをIDで削除できる", () => {
      const { result } = renderHook(() => useToast());
      let toastId: string;

      act(() => {
        const toastResult = result.current.toast({ title: "トースト1" });
        toastId = toastResult.id;
        result.current.toast({ title: "トースト2" });
      });

      act(() => {
        result.current.dismiss(toastId);
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts.find((t) => t.id === toastId)?.open).toBe(
        false,
      );
    });

    it("IDを指定せずに全てのトーストを削除できる", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "トースト1" });
        result.current.toast({ title: "トースト2" });
        result.current.toast({ title: "トースト3" });
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.toasts.every((t) => !t.open)).toBe(true);
    });
  });

  describe("toast return value", () => {
    it("トースト作成時にupdate関数を返す", () => {
      const { result } = renderHook(() => useToast());
      let toastResult: any;

      act(() => {
        toastResult = result.current.toast({ title: "初期タイトル" });
      });

      expect(typeof toastResult.update).toBe("function");

      act(() => {
        toastResult.update({ title: "更新されたタイトル" });
      });

      expect(result.current.toasts[0].title).toBe("更新されたタイトル");
    });

    it("トースト作成時にdismiss関数を返す", () => {
      const { result } = renderHook(() => useToast());
      let toastResult: any;

      act(() => {
        toastResult = result.current.toast({ title: "テストトースト" });
      });

      expect(typeof toastResult.dismiss).toBe("function");

      act(() => {
        toastResult.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    it("トースト作成時にIDを返す", () => {
      const { result } = renderHook(() => useToast());
      let toastResult: any;

      act(() => {
        toastResult = result.current.toast({ title: "テストトースト" });
      });

      expect(typeof toastResult.id).toBe("string");
      expect(result.current.toasts[0].id).toBe(toastResult.id);
    });
  });

  describe("onOpenChange callback", () => {
    it("openがfalseになった時にdismissが呼ばれる", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "テストトースト" });
      });

      const toast = result.current.toasts[0];
      expect(toast.open).toBe(true);

      act(() => {
        toast.onOpenChange?.(false);
      });

      expect(result.current.toasts[0].open).toBe(false);
    });
  });

  describe("action buttons", () => {
    it("actionを含むトーストを作成できる", () => {
      const { result } = renderHook(() => useToast());
      const mockAction = { altText: "アクション" } as any;

      act(() => {
        result.current.toast({
          title: "アクション付きトースト",
          action: mockAction,
        });
      });

      expect(result.current.toasts[0].action).toBe(mockAction);
    });
  });

  describe("独立したtoast関数", () => {
    it("独立したtoast関数でもトーストを追加できる", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ title: "独立したトースト" });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("独立したトースト");
    });
  });
});
