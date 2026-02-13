import React, { useState, useEffect } from 'react';
import { Fortune, UserInfo } from './types';
import { BLOOD_TYPES, ZODIAC_SIGNS, ETO } from './constants';
import { FortuneResultDisplay } from './components/FortuneResultDisplay';
import { FortuneForm } from './components/FortuneForm';
import { Loader } from './components/Loader';
import { Logo } from './components/Logo';
import { Manual } from './components/Manual';

const App: React.FC = () => {
  // 初期ユーザー情報
  const initialInfo: UserInfo = {
    name: 'あなた',
    year: '1990',
    month: '1',
    day: '1',
    bloodType: BLOOD_TYPES[0],
    zodiacSign: ZODIAC_SIGNS[0],
    eto: ETO[0],
  };

  const [userInfo, setUserInfo] = useState<UserInfo>(initialInfo);
  const [savedInfo, setSavedInfo] = useState<UserInfo>(initialInfo);
  const [targetDateType, setTargetDateType] = useState<'today' | 'tomorrow'>('today');
  const [isLocked, setIsLocked] = useState(false);
  const [isFortuneForOthers, setIsFortuneForOthers] = useState(false);

  // 🔑 fortune は null 初期化（これが超重要）
  const [fortune, setFortune] = useState<Fortune | null>(null);

  const [displayDate, setDisplayDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | null>(null);

  const [usageCount, setUsageCount] = useState(0);
  const MAX_USAGE = 5;

  // 画面遷移防止（読み込み中だけ）
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isLoading) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Logo />

      <div className="max-w-xl mx-auto px-4 py-6">
        {/* 入力フォーム */}
        <FortuneForm
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          targetDateType={targetDateType}
          setTargetDateType={setTargetDateType}
          isLocked={isLocked}
          isFortuneForOthers={isFortuneForOthers}
          setIsFortuneForOthers={setIsFortuneForOthers}
          onSubmit={async () => {
            if (usageCount >= MAX_USAGE) {
              setError('本日の利用回数上限に達しました');
              return;
            }

            setIsLoading(true);
            setError(null);
            setFortune(null); // ← ここ重要：一旦必ず null に戻す

            try {
              // ※ ここはあなたの既存の占いAPI処理に置き換えてOK
              // ダミー（例）
              const result: Fortune = {
                luck: '今日はとても良い一日になりそうです。',
              } as Fortune;

              setFortune(result);
              setUsageCount((c) => c + 1);
            } catch (e) {
              setError('占いの取得に失敗しました');
              setFortune(null);
            } finally {
              setIsLoading(false);
            }
          }}
        />

        {/* ローディング */}
        {isLoading && (
          <div className="mt-6">
            <Loader />
          </div>
        )}

        {/* エラー */}
        {error && (
          <div className="mt-4 text-red-400 text-center">
            {error}
          </div>
        )}

        {/* ✅ fortune がある時だけ結果表示（ここが本丸） */}
        {fortune && !isLoading && (
          <div className="mt-6">
            <FortuneResultDisplay fortune={fortune} />
          </div>
        )}

        {/* fortune が無い時だけマニュアル表示 */}
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
