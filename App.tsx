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
      const payload = {
        userInfo: { name, birth },
        targetDate: new Date().toISOString().slice(0, 10),
      };

      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || `API Error (${res.status})`);
      }

      setResult(data);
    } catch (e: any) {
      setError(e?.message || "通信エラー");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 12 }}>🔮 個人占い</h1>

        <input
          placeholder="お名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
          }}
        />

        <input
          placeholder="生年月日（例: 1990-01-01）"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
          }}
        />

        <button
          onClick={onSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "鑑定中…" : "鑑定する"}
        </button>

        <div style={{ marginTop: 16 }}>
          {error && (
            <div
              style={{
                background: "#2a0000",
                border: "1px solid #ff6b6b",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>エラー</div>
              <div>{error}</div>
            </div>
          )}

          {result && (
            <div
              style={{
                background: "#0b0b0b",
                border: "1px solid #333",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>結果</div>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  color: "#fff",
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {!error && !result && !loading && (
            <div style={{ opacity: 0.7, marginTop: 10 }}>
              名前と生年月日を入れて「鑑定する」を押してください。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
