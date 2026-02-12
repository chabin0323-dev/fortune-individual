import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInfo: {
            name,
            birth,
          },
          targetDate: new Date().toISOString().slice(0, 10),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "API error");
      }

      setResult(data);
    } catch (e: any) {
      setError(e.message || "通信エラー");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 480, margin: "0 auto" }}>
      <h1>🔮 個人占い</h1>

      <input
        placeholder="お名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <input
        placeholder="生年月日（例: 1990-01-01）"
        value={birth}
        onChange={(e) => setBirth(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <button onClick={onSubmit} disabled={loading}>
        {loading ? "鑑定中…" : "鑑定する"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 16 }}>
          <h2>結果</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
