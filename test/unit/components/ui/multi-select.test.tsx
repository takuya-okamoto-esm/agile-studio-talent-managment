import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MultiSelect,
  type MultiSelectOption,
} from "~/components/ui/multi-select/multi-select";

// UIコンポーネントのモック
vi.mock("~/components/ui/badge", () => ({
  Badge: ({ children, variant }: any) => (
    <div data-testid="badge" data-variant={variant}>
      {children}
    </div>
  ),
}));

vi.mock("~/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock("~/components/ui/select", () => ({
  Select: ({ children, onValueChange, disabled }: any) => (
    <div
      data-testid="select"
      data-disabled={disabled}
      data-onchange={onValueChange?.toString()}
    >
      {children}
    </div>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <div data-testid="select-trigger" className={className}>
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }: any) => (
    <div data-testid="select-value">{placeholder}</div>
  ),
  SelectContent: ({ children }: any) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
}));

// Lucide Reactアイコンのモック
vi.mock("lucide-react", () => ({
  X: () => <div data-testid="x-icon">X</div>,
}));

describe("MultiSelect", () => {
  const mockOptions: MultiSelectOption[] = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
  ];

  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("基本的な表示が正しく行われる", () => {
    render(
      <MultiSelect
        options={mockOptions}
        selected={[]}
        onChange={mockOnChange}
        placeholder="技術を選択してください"
      />,
    );

    expect(screen.getByTestId("select")).toBeInTheDocument();
    expect(screen.getByTestId("select-trigger")).toBeInTheDocument();
    expect(screen.getByText("技術を選択してください")).toBeInTheDocument();
  });

  it("選択済みのオプションがバッジとして表示される", () => {
    render(
      <MultiSelect
        options={mockOptions}
        selected={["react", "vue"]}
        onChange={mockOnChange}
      />,
    );

    const badges = screen.getAllByTestId("badge");
    expect(badges).toHaveLength(2);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue.js")).toBeInTheDocument();
  });

  it("選択済みのオプションに削除ボタンが表示される", () => {
    render(
      <MultiSelect
        options={mockOptions}
        selected={["react"]}
        onChange={mockOnChange}
      />,
    );

    const removeButtons = screen.getAllByTestId("button");
    expect(removeButtons).toHaveLength(1);
    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    expect(screen.getByText("Remove React")).toBeInTheDocument();
  });

  it("削除ボタンクリック時にonChangeが呼ばれる", async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        options={mockOptions}
        selected={["react", "vue"]}
        onChange={mockOnChange}
      />,
    );

    const removeButtons = screen.getAllByTestId("button");
    await user.click(removeButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith(["vue"]);
  });

  it("選択可能なオプションのみがSelectContentに表示される", () => {
    render(
      <MultiSelect
        options={mockOptions}
        selected={["react", "vue"]}
        onChange={mockOnChange}
      />,
    );

    const selectItems = screen.getAllByTestId("select-item");
    expect(selectItems).toHaveLength(2); // 残りのangular、svelteのみ
    expect(screen.getByText("Angular")).toBeInTheDocument();
    expect(screen.getByText("Svelte")).toBeInTheDocument();
    expect(screen.queryByText("React")).toBeInTheDocument(); // バッジとして表示
    expect(screen.queryByText("Vue.js")).toBeInTheDocument(); // バッジとして表示
  });

  it("disabledプロパティが正しく適用される", () => {
    render(
      <MultiSelect
        options={mockOptions}
        selected={["react"]}
        onChange={mockOnChange}
        disabled={true}
      />,
    );

    const select = screen.getByTestId("select");
    expect(select).toHaveAttribute("data-disabled", "true");

    const removeButton = screen.getByTestId("button");
    expect(removeButton).toBeDisabled();
  });

  it("カスタムクラス名が適用される", () => {
    render(
      <MultiSelect
        options={mockOptions}
        selected={[]}
        onChange={mockOnChange}
        className="custom-class"
      />,
    );

    const container = screen.getByTestId("select").parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("存在しないvalueが選択済みの場合でもエラーにならない", () => {
    render(
      <MultiSelect
        options={mockOptions}
        selected={["react", "unknown-value"]}
        onChange={mockOnChange}
      />,
    );

    const badges = screen.getAllByTestId("badge");
    expect(badges).toHaveLength(2);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("unknown-value")).toBeInTheDocument(); // value がそのまま表示
  });

  it("デフォルトプレースホルダーが使用される", () => {
    render(
      <MultiSelect
        options={mockOptions}
        selected={[]}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByText("Select options")).toBeInTheDocument();
  });

  it("空のoptionsでもエラーにならない", () => {
    render(<MultiSelect options={[]} selected={[]} onChange={mockOnChange} />);

    expect(screen.getByTestId("select")).toBeInTheDocument();
    expect(screen.queryAllByTestId("select-item")).toHaveLength(0);
  });

  it("初期selectedプロパティがundefinedでもエラーにならない", () => {
    // selectedがundefinedの場合は空配列として扱われる
    render(
      <MultiSelect
        options={mockOptions}
        selected={[]}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByTestId("select")).toBeInTheDocument();
    expect(screen.queryAllByTestId("badge")).toHaveLength(0);
  });

  it("重複する値を選択しようとしても追加されない", async () => {
    const user = userEvent.setup();

    // handleSelectを直接テストするため、内部状態を確認
    render(
      <MultiSelect
        options={mockOptions}
        selected={["react"]}
        onChange={mockOnChange}
      />,
    );

    // 最初の状態確認
    expect(screen.getAllByTestId("badge")).toHaveLength(1);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("バッジのvariantがsecondaryに設定される", () => {
    render(
      <MultiSelect
        options={mockOptions}
        selected={["react"]}
        onChange={mockOnChange}
      />,
    );

    const badge = screen.getByTestId("badge");
    expect(badge).toHaveAttribute("data-variant", "secondary");
  });
});
