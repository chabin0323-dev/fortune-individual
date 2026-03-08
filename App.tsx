import React, { useState, useEffect } from 'react';
import { Fortune, UserInfo } from './types';
import { BLOOD_TYPES, ZODIAC_SIGNS, ETO } from './constants';
import { getFortune } from './services/geminiService';
import { FortuneResultDisplay } from './components/FortuneResultDisplay';
import { FortuneForm } from './components/FortuneForm';
import { Loader } from './components/Loader';
import { Logo } from './components/Logo';
import { Manual } from './components/Manual';

const App: React.FC = () => {
  const initialInfo: UserInfo = {
    name: 'あなた',
    year: '1990',
    month: '1',
    day: '1',
    bloodType: BLOOD_TYPES[0],
    zodiacSign: ZODIAC_SIGNS[0],
    eto: ETO[0],
  };

  const USER_INFO_STORAGE_KEY = 'fortune_user_info';
  const FORTUNE_STORAGE_KEY = 'fortune_latest_result';
  const USAGE_STORAGE_KEY = 'fortune_usage';
  const MAX_USAGE = 5;

  const [userInfo, setUserInfo] = useState<UserInfo>(initialInfo);
  const [targetDateType, setTargetDateType] = useState<'today' | 'tomorrow'>('today');
  const [isLocked, setIsLocked] = useState(false);
  const [isFortuneForOthers, setIsFortuneForOthers] = useState(false);

  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [displayDate, setDisplayDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | null>(null);
  const [usageCount, setUsageCount] = useState(0);

  const loadUsageCount = () => {
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
        localStorage.setItem(
          USAGE_STORAGE_KEY,
          JSON.stringify({
            date: today,
            count: 0,
          })
        );
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

  const saveUsageCount = (count: number) => {
    const today = new Date().toLocaleDateString();
    localStorage.setItem(
      USAGE_STORAGE_KEY,
      JSON.stringify({
        date: today,
        count,
      })
    );
  };

  const persistFortune = (result: Fortune, label: string, name: string) => {
    try {
      setAutoSaveStatus('saving');

      localStorage.setItem(
        FORTUNE_STORAGE_KEY,
        JSON.stringify({
          fortune: result,
          displayDate: label,
          name,
          savedAt: new Date().toISOString(),
        })
      );

      setAutoSaveStatus('saved');
    } catch {
      setAutoSaveStatus(null);
    }
  };

  // 初回ロード
  useEffect(() => {
    try {
      const savedUserInfo = localStorage.getItem(USER_INFO_STORAGE_KEY);
      if (savedUserInfo) {
        const parsed = JSON.parse(savedUserInfo);
        setUserInfo({
          ...initialInfo,
          ...parsed,
        });
      }
    } catch {
      // 何もしない
    }

    try {
      const savedFortune = localStorage.getItem(FORTUNE_STORAGE_KEY);
      if (savedFortune) {
        const parsed = JSON.parse(savedFortune);
        if (parsed?.fortune) {
          setFortune(parsed.fortune);
        }
        if (parsed?.displayDate) {
          setDisplayDate(parsed.displayDate);
        }
      }
    } catch {
      // 何もしない
    }

    loadUsageCount();
  }, []);

  // userInfo 自動保存
  useEffect(() => {
    try {
      localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(userInfo));
    } catch {
      // 何もしない
    }
  }, [userInfo]);

  // タブ復帰・画面再表示で利用回数を再読込
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadUsageCount();
      }
    };

    const handleFocus = () => {
      loadUsageCount();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // 読み込み中だけ画面遷移防止
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isLoading) return;
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentCount = loadUsageCount();

    if (currentCount >= MAX_USAGE) {
      setError('本日の利用回数上限に達しました。');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAutoSaveStatus(null);
    setFortune(null);

    try {
      const date = new Date();

      if (targetDateType === 'tomorrow') {
        date.setDate(date.getDate() + 1);
      }

      const dateStr = date.toLocaleDateString('ja-JP');
      const label = `${dateStr} (${targetDateType === 'today' ? '今日' : '明日'})`;

      const result = await getFortune(userInfo, targetDateType);

      setFortune(result);
      setDisplayDate(label);

      persistFortune(result, label, userInfo.name);

      const newCount = currentCount + 1;
      setUsageCount(newCount);
      saveUsageCount(newCount);
    } catch (err: any) {
      console.error('Fortune telling error:', err);
      setFortune(null);
      setError(err?.message || '占いに失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const remainingCount = Math.max(0, MAX_USAGE - usageCount);

  return (
    <div className="min-h-screen bg-black text-white">
      <Logo />

      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="mb-4 text-center text-sm text-zinc-300">
          本日の残り回数: {remainingCount} / {MAX_USAGE}
        </div>

        <FortuneForm
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          targetDateType={targetDateType}
          setTargetDateType={setTargetDateType}
          isLocked={isLocked}
          isFortuneForOthers={isFortuneForOthers}
          setIsFortuneForOthers={setIsFortuneForOthers}
          onSubmit={handleSubmit}
        />

        {isLoading && (
          <div className="mt-6">
            <Loader />
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-400 text-center whitespace-pre-line">
            {error}
          </div>
        )}

        {autoSaveStatus === 'saved' && !isLoading && fortune && (
          <div className="mt-4 text-emerald-400 text-center text-sm">
            鑑定結果を保存しました
          </div>
        )}

        {fortune && !isLoading && (
          <div className="mt-6">
            {displayDate && (
              <div className="mb-4 text-center text-zinc-400 text-sm">
                {displayDate}
              </div>
            )}
            <FortuneResultDisplay fortune={fortune} />
          </div>
        )}

        {!fortune && !isLoading && (
          <div className="mt-6">
            <Manual />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
