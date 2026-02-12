
import React, { useState, useRef } from 'react';
import { BLOOD_TYPES, ZODIAC_SIGNS, ETO, YEARS, MONTHS, DAYS } from '../constants';

interface SelectProps {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    label: string;
    disabled?: boolean;
    onDisabledClick?: () => void;
}

const Select: React.FC<SelectProps> = ({ id, value, onChange, options, label, disabled, onDisabledClick }) => (
    <div className="flex-1 min-w-[80px]">
        <label htmlFor={id} className="block text-sm font-medium text-indigo-200 mb-1">{label}</label>
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full bg-slate-900/60 border border-indigo-500/30 rounded-md shadow-sm py-2 px-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-gray-800"
            >
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
            {disabled && (
                <div 
                    className="absolute inset-0 z-10 cursor-not-allowed"
                    onClick={onDisabledClick}
                />
            )}
        </div>
    </div>
);


interface FortuneFormProps {
    name: string;
    setName: (value: string) => void;
    year: string;
    setYear: (value: string) => void;
    month: string;
    setMonth: (value: string) => void;
    day: string;
    setDay: (value: string) => void;
    bloodType: string;
    setBloodType: (value: string) => void;
    zodiacSign: string;
    setZodiacSign: (value: string) => void;
    eto: string;
    setEto: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    isLocked: boolean;
    setIsLocked: (value: boolean) => void;
    isFortuneForOthers: boolean;
    onStartFortuneForOthers: () => void;
    onReturnToMyInfo: () => void;
    targetDateType: 'today' | 'tomorrow';
    setTargetDateType: (value: 'today' | 'tomorrow') => void;
    usageCount: number;
    maxUsage: number;
    isInAppBrowser?: boolean;
}

export const FortuneForm: React.FC<FortuneFormProps> = ({
    year, setYear, month, setMonth, day, setDay, bloodType, setBloodType, zodiacSign, setZodiacSign, eto, setEto, handleSubmit, isLoading, isLocked, setIsLocked, isFortuneForOthers, onStartFortuneForOthers, onReturnToMyInfo, targetDateType, setTargetDateType, usageCount, maxUsage, isInAppBrowser
}) => {
    const [showUnlockMessage, setShowUnlockMessage] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const isLimitReached = usageCount >= maxUsage;

    const handleDisabledClick = () => {
        if (isLocked) {
             if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setShowUnlockMessage(true);
            timeoutRef.current = window.setTimeout(() => {
                setShowUnlockMessage(false);
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative">
             {showUnlockMessage && (
                 <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-max pointer-events-none">
                    <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl text-base font-bold flex items-center border border-red-400 animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        固定を解除してください
                    </div>
                </div>
            )}

            <h2 className="text-lg sm:text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 mb-6 whitespace-nowrap overflow-hidden text-ellipsis">
                {isFortuneForOthers ? '占う相手の情報を入力して下さい' : '占いたい方の情報を入力して下さい'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                    <p className="block text-sm font-medium text-indigo-200 mb-1">生年月日</p>
                    <div className="flex space-x-2">
                        <Select id="year" value={year} onChange={(e) => setYear(e.target.value)} options={YEARS} label="年" disabled={isLocked} onDisabledClick={handleDisabledClick} />
                        <Select id="month" value={month} onChange={(e) => setMonth(e.target.value)} options={MONTHS} label="月" disabled={isLocked} onDisabledClick={handleDisabledClick} />
                        <Select id="day" value={day} onChange={(e) => setDay(e.target.value)} options={DAYS} label="日" disabled={isLocked} onDisabledClick={handleDisabledClick} />
                    </div>
                </div>

                <div className="md:col-span-1">
                    <Select id="bloodType" value={bloodType} onChange={(e) => setBloodType(e.target.value)} options={BLOOD_TYPES} label="血液型" disabled={isLocked} onDisabledClick={handleDisabledClick} />
                </div>
                
                <div className="md:col-span-1">
                    <Select id="zodiacSign" value={zodiacSign} onChange={(e) => setZodiacSign(e.target.value)} options={ZODIAC_SIGNS} label="星座" disabled={isLocked} onDisabledClick={handleDisabledClick} />
                </div>

                <div className="md:col-span-1">
                    <Select id="eto" value={eto} onChange={(e) => setEto(e.target.value)} options={ETO} label="干支" disabled={isLocked} onDisabledClick={handleDisabledClick} />
                </div>
            </div>

             {/* Date Selection and Usage Count */}
             <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">占う日</label>
                <div className="flex items-center space-x-3">
                    <div className="flex flex-1 space-x-3 bg-slate-900/40 p-1 rounded-lg border border-indigo-500/20">
                        <button
                            type="button"
                            onClick={() => setTargetDateType('today')}
                            disabled={isInAppBrowser}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all duration-300 ${
                                targetDateType === 'today'
                                    ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                    : 'text-indigo-300 hover:text-white hover:bg-white/5'
                            } ${isInAppBrowser ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            今日
                        </button>
                        <button
                            type="button"
                            onClick={() => setTargetDateType('tomorrow')}
                            disabled={isInAppBrowser}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all duration-300 ${
                                targetDateType === 'tomorrow'
                                    ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                    : 'text-indigo-300 hover:text-white hover:bg-white/5'
                            } ${isInAppBrowser ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            明日
                        </button>
                    </div>
                    <div className="text-sm font-medium text-cyan-300 whitespace-nowrap">
                        本日の残り：{maxUsage - usageCount}回
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    {isFortuneForOthers ? (
                        <button
                            type="button"
                            onClick={onReturnToMyInfo}
                            disabled={isInAppBrowser}
                            className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            自分の情報に戻る
                        </button>
                    ) : (
                        <>
                            {isLocked ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsLocked(false)}
                                        disabled={isInAppBrowser}
                                        className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        固定を解除
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onStartFortuneForOthers}
                                        disabled={isInAppBrowser}
                                        className="w-full sm:w-auto bg-violet-800 hover:bg-violet-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        他人を占う
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsLocked(true)}
                                    disabled={isInAppBrowser}
                                    className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    入力を固定する
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                {isLimitReached && (
                    <p className="text-red-400 text-center font-bold animate-pulse text-sm">
                        本日の利用上限（{maxUsage}回）に達しました。また明日お試しください
                    </p>
                )}
                <button
                    type="submit"
                    disabled={isLoading || isInAppBrowser || isLimitReached}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white font-bold py-3 px-4 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none border border-white/20"
                >
                    {isLoading ? '運命の星を読み解いています...' : (isInAppBrowser ? 'ブラウザを変更してください' : (isLimitReached ? '上限に達しました' : '運勢を占う'))}
                </button>
            </div>
        </form>
    )
}
