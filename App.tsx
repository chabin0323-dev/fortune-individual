import React, { useState } from "react";

type FortuneResult = {
  luck: number;
  text: string;
};

function App() {
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        userInfo: { name, birth },
        targetDate: new Date().toISOString(),
      };

      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      // 🔴 ここが今回の致命的バグ修正ポイント
      if (!data || typeof data.luck !== "number") {
        setError("鑑定結果を取得できませんでした");
        return;
      }

      setResult(data);
    } catch (e: any) {
      setError(e?.message || "通信エラー");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>AI Fortune Teller</h1>

      <input
        placeholder="名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        placeholder="生年月日"
        value={birth}
        onChange={(e) => setBirth(e.target.value)}
      />
      <br />
      <button onClick={onSubmit} disabled={loading}>
        鑑定する
      </button>

      {loading && <p>鑑定中...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h2>運勢</h2>
          <p>Luck: {result.luck}</p>
          <p>{result.text}</p>
        </div>
      )}
    </div>
  );
}

export default App;
