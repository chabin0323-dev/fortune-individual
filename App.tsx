import React, { useState, useEffect } from "react";
import { Fortune, UserInfo } from "./types";
import { getFortune } from "./services/geminiService";
import { FortuneResultDisplay } from "./components/FortuneResultDisplay";

const MAX_USAGE = 5;
const USAGE_STORAGE_KEY = "fortune_usage";

export default function App() {

  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    year: "",
    month: "",
    day: "",
    bloodType: "",
    zodiacSign: "",
    eto: "",
  });

  const loadUsage = () => {
    try {
      const raw = localStorage.getItem(USAGE_STORAGE_KEY);

      if (!raw) {
        setUsageCount(0);
        return 0;
      }

      const parsed = JSON.parse(raw);
      const today = new Date().toLocaleDateString();

      if (!parsed || parsed.date !== today) {
        setUsageCount(0);
        return 0;
      }

      const count = Number(parsed.count) || 0;
      setUsageCount(count);
      return count;

    } catch {
      setUsageCount(0);
      return 0;
    }
  };

  const saveUsage = (count:number) => {
    const today = new Date().toLocaleDateString();

    localStorage.setItem(
      USAGE_STORAGE_KEY,
      JSON.stringify({
        date: today,
        count: count
      })
    );
  };

  useEffect(() => {
    loadUsage();
  }, []);

  const handleFortune = async () => {

    const current = loadUsage();

    if (current >= MAX_USAGE) {
      alert("本日の占い回数は終了しました");
      return;
    }

    setLoading(true);

    try {

      const result = await getFortune(userInfo,"today");

      setFortune(result);

      const newCount = current + 1;

      setUsageCount(newCount);
      saveUsage(newCount);

    } catch (e) {

      alert("占い取得エラー");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div style={{padding:"30px",maxWidth:"600px",margin:"auto"}}>

      <h1>AI Fortune Teller</h1>

      <p>
        本日の残り回数
        {" "}
        {MAX_USAGE - usageCount} / {MAX_USAGE}
      </p>

      <div style={{marginTop:"20px"}}>

        <input
          placeholder="名前"
          value={userInfo.name}
          onChange={(e)=>
            setUserInfo({...userInfo,name:e.target.value})
          }
        />

        <button
          style={{marginLeft:"10px"}}
          onClick={handleFortune}
        >
          占い
        </button>

      </div>

      {loading && <p>鑑定中...</p>}

      {fortune && (
        <div style={{marginTop:"30px"}}>
          <FortuneResultDisplay fortune={fortune}/>
        </div>
      )}

    </div>

  );

}
