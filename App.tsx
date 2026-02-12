
import React, { useState, useEffect, useCallback } from 'react';
import { Fortune, UserInfo } from './types';
import { BLOOD_TYPES, ZODIAC_SIGNS, ETO } from './constants';
import { getFortune } from './services/geminiService';
import { FortuneResultDisplay } from './components/FortuneResultDisplay';
import { FortuneForm } from './components/FortuneForm';
import { Loader } from './components/Loader';
import { Logo } from './components/Logo';
import { Manual } from './components/Manual';

const STORAGE_KEY_FORTUNE = 'persisted_fortune_result';

const App: React.FC = () => {
  const initialInfo: UserInfo = {
    name: 'あなた', year: '1990', month: '1', day: '1',
    bloodType: BLOOD_TYPES[0], zodiacSign: ZODIAC_SIGNS[0], eto: ETO[0]
  };
  const [userInfo, setUserInfo] = useState<UserInfo>(initialInfo);
  const [savedInfo, setSavedInfo] = useState<UserInfo>(initialInfo);
  const [targetDateType, setTargetDateType] = useState<'today' | 'tomorrow'>('today');
  const [isLocked, setIsLocked] = useState(false);
  const [isFortuneForOthers, setIsFortuneForOthers] = useState(false);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [displayDate, setDisplayDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | null>(null);

  // 利用回数管理 (ブラウザのlocalStorageのみを使用)
  const [usageCount, setUsageCount] = useState(0);
  const MAX_USAGE = 5;

  // 1. 意図しない画面遷移の防止（BeforeUnload）
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLoading) {
        e.preventDefault();
        e.returnValue = '入力内容が消去されますがよろしいですか？';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isLoading]);

  // 2. データ復元と初期化
  useEffect(() => {
    // 固定プロフィールの復元
    const storedProfile = localStorage.getItem('user_profile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setUserInfo(profile);
      setSavedInfo(profile);
      setIsLocked(true);
    }

    // 前回の鑑定結果の復元（バックグラウンド維持・クラッシュ対策）
    const storedFortune = localStorage.getItem(STORAGE_KEY_FORTUNE);
    if (storedFortune) {
      try {
        const { fortune: f, date, name } = JSON.parse(storedFortune);
        setFortune(f);
        setDisplayDate(date);
        setAutoSaveStatus('saved');
      } catch (e) {
        console.error("Failed to restore fortune", e);
      }
    }

    // 利用回数の日付判定とリセット
    const today = new Date().toLocaleDateString();
    const storedUsage = localStorage.getItem('fortune_usage');
    if (storedUsage) {
      const { date, count } = JSON.parse(storedUsage);
      if (date === today) {
        setUsageCount(count);
      } else {
        localStorage.setItem('fortune_usage', JSON.stringify({ date: today, count: 0 }));
        setUsageCount(0);
      }
    } else {
      localStorage.setItem('fortune_usage', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  // 3. リアルタイム保存ロジック
  const persistFortune = useCallback((f: Fortune, date: string, name: string) => {
    setAutoSaveStatus('saving');
    // Local Storageへのリアルタイム保存
    localStorage.setItem(STORAGE_KEY_FORTUNE, JSON.stringify({ fortune: f, date, name }));
    // ユーザーへの安心感のためのインジケーター表示制御
    setTimeout(() => setAutoSaveStatus('saved'), 800);
  }, []);

  const handleLockToggle = (locked: boolean) => {
    setIsLocked(locked);
    if (locked && !isFortuneForOthers) {
      localStorage.setItem('user_profile', JSON.stringify(userInfo));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usageCount >= MAX_USAGE) return;

    setIsLoading(true);
    setError(null);
    setAutoSaveStatus(null);
    
    try {
      const date = new Date();
      if (targetDateType === 'tomorrow') date.setDate(date.getDate() + 1);
      const dateStr = date.toLocaleDateString('ja-JP');
      const label = `${dateStr} (${targetDateType === 'today' ? '今日' : '明日'})`;
      
      const result = await getFortune(userInfo, dateStr);
      setFortune(result);
      setDisplayDate(label);
      
      // 生成完了直後に即座に保存
      persistFortune(result, label, userInfo.name);
      
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem('fortune_usage', JSON.stringify({ 
        date: new Date().toLocaleDateString(), 
        count: newCount 
      }));
    } catch (err) {
      setError('占いに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOthers = () => {
    setSavedInfo({ ...userInfo });
    setIsFortuneForOthers(true);
    setIsLocked(false);
    setUserInfo({ ...initialInfo, name: 'あの人' });
  };

  const handleReturnMyInfo = () => {
    setIsFortuneForOthers(false);
    setIsLocked(true);
    setUserInfo({ ...savedInfo });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center relative">
      {/* 自動保存完了のインジケーター */}
      {autoSaveStatus && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-2xl animate-fade-in">
          <div className={`w-2 h-2 rounded-full ${autoSaveStatus === 'saved' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400 animate-pulse'}`}></div>
          <span className="text-[10px] font-bold text-gray-300 tracking-wider">
            {autoSaveStatus === 'saved' ? '自動保存済み' : '保存中...'}
          </span>
        </div>
      )}

      <header className="w-full max-w-2xl mb-10 mt-8 flex flex-col items-center space-y-4">
        <div className="w-full flex justify-end"><Manual /></div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 text-center">
          AI Fortune Teller
        </h1>
      </header>

      <main className="w-full max-w-2xl bg-white/5 p-6 rounded-2xl border border-white/10">
        <FortuneForm
          {...userInfo}
          setName={() => {}}
          setYear={(v) => setUserInfo(p => ({...p, year: v}))}
          setMonth={(v) => setUserInfo(p => ({...p, month: v}))}
          setDay={(v) => setUserInfo(p => ({...p, day: v}))}
          setBloodType={(v) => setUserInfo(p => ({...p, bloodType: v}))}
          setZodiacSign={(v) => setUserInfo(p => ({...p, zodiacSign: v}))}
          setEto={(v) => setUserInfo(p => ({...p, eto: v}))}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isLocked={isLocked}
          setIsLocked={handleLockToggle}
          isFortuneForOthers={isFortuneForOthers}
          onStartFortuneForOthers={handleStartOthers}
          onReturnToMyInfo={handleReturnMyInfo}
          targetDateType={targetDateType}
          setTargetDateType={setTargetDateType}
          usageCount={usageCount}
          maxUsage={MAX_USAGE}
        />
        <div className="mt-8">
          {isLoading && <Loader />}
          {error && <p className="text-red-400 text-center">{error}</p>}
          {fortune && <FortuneResultDisplay fortune={fortune} date={displayDate} name={userInfo.name} />}
        </div>
      </main>
      <footer className="mt-auto w-full"><Logo /></footer>
    </div>
  );
};

export default App;
