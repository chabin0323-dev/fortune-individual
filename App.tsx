import React, { useState, useEffect } from 'react';
import { Fortune, UserInfo } from './types';
import { getFortune } from './services/geminiService';
import { FortuneResultDisplay } from './components/FortuneResultDisplay';
import { FortuneForm } from './components/FortuneForm';
import { Loader } from './components/Loader';
import { Logo } from './components/Logo';
import { Manual } from './components/Manual';

const MAX_USAGE = 5;

const App: React.FC = () => {

  const USER_INFO_STORAGE_KEY = 'fortune_user_info';
  const FORTUNE_STORAGE_KEY = 'fortune_latest_result';
  const USAGE_STORAGE_KEY = 'fortune_usage';

  const initialInfo: UserInfo = {
    name: 'あなた',
    year: '',
    month: '',
    day: '',
    bloodType: '',
    zodiacSign: '',
    eto: '',
  };

  const [userInfo, setUserInfo] = useState<UserInfo>(initialInfo);
  const [targetDateType, setTargetDateType] = useState<'today' | 'tomorrow'>('today');
  const [isLocked, setIsLocked] = useState(false);
  const [isFortuneForOthers, setIsFortuneForOthers] = useState(false);

  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [displayDate, setDisplayDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);

  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  };

  const loadUsageCount = () => {

    try{

      const raw = localStorage.getItem(USAGE_STORAGE_KEY);

      if(!raw){
        setUsageCount(0);
        return 0;
      }

      const parsed = JSON.parse(raw);

      if(parsed.date !== todayKey()){

        setUsageCount(0);

        localStorage.setItem(
          USAGE_STORAGE_KEY,
          JSON.stringify({
            date:todayKey(),
            count:0
          })
        );

        return 0;
      }

      const count = Number(parsed.count) || 0;
      setUsageCount(count);
      return count;

    }catch{
      setUsageCount(0);
      return 0;
    }

  };

  const saveUsageCount = (count:number) => {

    localStorage.setItem(
      USAGE_STORAGE_KEY,
      JSON.stringify({
        date:todayKey(),
        count
      })
    );

  };

  useEffect(()=>{

    const savedUser = localStorage.getItem(USER_INFO_STORAGE_KEY);

    if(savedUser){
      setUserInfo(JSON.parse(savedUser));
    }

    const savedFortune = localStorage.getItem(FORTUNE_STORAGE_KEY);

    if(savedFortune){
      const parsed = JSON.parse(savedFortune);
      setFortune(parsed.fortune);
      setDisplayDate(parsed.displayDate);
    }

    loadUsageCount();

  },[]);

  useEffect(()=>{

    localStorage.setItem(
      USER_INFO_STORAGE_KEY,
      JSON.stringify(userInfo)
    );

  },[userInfo]);

  const handleSubmit = async (e:React.FormEvent)=>{

    e.preventDefault();

    const current = loadUsageCount();

    if(current >= MAX_USAGE){
      setError('本日の利用回数上限に達しました');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFortune(null);

    try{

      const date = new Date();

      if(targetDateType==='tomorrow'){
        date.setDate(date.getDate()+1);
      }

      const dateStr = date.toLocaleDateString('ja-JP');
      const label = `${dateStr} (${targetDateType==='today'?'今日':'明日'})`;

      const result = await getFortune(userInfo,targetDateType);

      setFortune(result);
      setDisplayDate(label);

      localStorage.setItem(
        FORTUNE_STORAGE_KEY,
        JSON.stringify({
          fortune:result,
          displayDate:label
        })
      );

      const newCount = current+1;

      setUsageCount(newCount);

      saveUsageCount(newCount);

    }catch(err:any){

      console.error(err);
      setError('占いに失敗しました');

    }finally{

      setIsLoading(false);

    }

  };

  return(

    <div className="min-h-screen bg-black text-white">

      <Logo/>

      <div className="max-w-xl mx-auto px-4 py-6">

        <FortuneForm
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          targetDateType={targetDateType}
          setTargetDateType={setTargetDateType}
          isLocked={isLocked}
          isFortuneForOthers={isFortuneForOthers}
          setIsFortuneForOthers={setIsFortuneForOthers}
          handleSubmit={handleSubmit}
          usageCount={usageCount}
          maxUsage={MAX_USAGE}
        />

        {isLoading && (
          <div className="mt-6">
            <Loader/>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-400 text-center">
            {error}
          </div>
        )}

        {fortune && !isLoading && (
          <div className="mt-6">

            <div className="mb-4 text-center text-zinc-400 text-sm">
              {displayDate}
            </div>

            <FortuneResultDisplay fortune={fortune}/>

          </div>
        )}

        {!fortune && !isLoading && (
          <div className="mt-6">
            <Manual/>
          </div>
        )}

      </div>

    </div>

  );

};

export default App;
