import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { mockAuth } from "~/lib/amplify-mock";

export function meta() {
  return [
    { title: "Login (開発モード) - Agile Studio" },
    { name: "description", content: "開発用ログイン画面" },
  ];
}

export default function LoginMock() {
  const [email, setEmail] = useState("dev@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mockAuth.signIn({ username: email, password });
      // Cookieを設定（サーバーサイドでも認証状態を確認できるように）
      document.cookie = "mockAuthToken=mock-token; path=/; max-age=86400"; // 24時間有効
      navigate("/");
    } catch (err) {
      setError("ログインに失敗しました");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">開発用ログイン</h1>
          <p className="text-sm text-muted-foreground">
            AWS環境なしで開発を進めるためのモックログインです
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              メールアドレス
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dev@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              パスワード（任意）
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="任意のパスワード"
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          <Button type="submit" className="w-full">
            ログイン
          </Button>
        </form>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-xs text-yellow-800">
            <strong>開発モード:</strong> 任意の認証情報でログインできます。
            本番環境では実際のAWS Cognitoが使用されます。
          </p>
        </div>
      </div>
    </div>
  );
}