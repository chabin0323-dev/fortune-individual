
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const InstructionStep: React.FC<{ number: number; title: string; children: React.ReactNode; visual: React.ReactNode }> = ({ number, title, children, visual }) => (
    <div className="mb-8 border-b border-white/10 pb-8 last:border-0 last:pb-0">
        <div className="flex items-center mb-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3 shadow-lg">
                {number}
            </div>
            <h4 className="text-xl font-bold text-indigo-100">{title}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="order-2 md:order-1 text-gray-300 leading-relaxed text-sm space-y-2">
                {children}
            </div>
            <div className="order-1 md:order-2 bg-slate-900/50 p-4 rounded-xl border border-white/10 flex items-center justify-center shadow-inner min-h-[120px]">
                {visual}
            </div>
        </div>
    </div>
);

// UI Mockups for the manual
const MockInput = () => (
    <div className="w-full max-w-[200px] space-y-2">
        <div className="h-2 w-10 bg-indigo-300/30 rounded"></div>
        <div className="w-full h-8 bg-slate-800 border border-indigo-500/30 rounded flex items-center px-2">
            <div className="h-2 w-24 bg-gray-500 rounded"></div>
        </div>
    </div>
);

const MockLockBtn = () => (
    <div className="w-full max-w-[200px] h-10 rounded-lg bg-slate-700 shadow-lg flex items-center justify-center text-white text-xs font-bold border border-white/10">
        入力を固定する
    </div>
);

const MockDateToggle = () => (
    <div className="flex space-x-2 w-full max-w-[200px] bg-slate-800 p-1 rounded-md border border-indigo-500/20">
        <div className="flex-1 bg-indigo-600 h-6 rounded flex items-center justify-center text-[10px] text-white font-bold shadow">今日</div>
        <div className="flex-1 h-6 flex items-center justify-center text-[10px] text-indigo-300">明日</div>
    </div>
);

const MockSubmitBtn = () => (
    <div className="w-full max-w-[200px] h-10 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 shadow-lg flex items-center justify-center text-white text-xs font-bold">
        運勢を占う
    </div>
);

const MockResultCard = () => (
    <div className="w-full max-w-[180px] bg-white/5 border border-white/10 p-3 rounded-lg shadow">
        <div className="flex justify-between items-center mb-2">
            <div className="h-3 w-12 bg-pink-300/50 rounded"></div>
            <div className="flex space-x-0.5">
                {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 text-yellow-300">★</div>)}
                {[4, 5].map(i => <div key={i} className="w-2 h-2 text-gray-600">★</div>)}
            </div>
        </div>
        <div className="space-y-1">
            <div className="h-1.5 w-full bg-indigo-200/20 rounded"></div>
            <div className="h-1.5 w-4/5 bg-indigo-200/20 rounded"></div>
        </div>
    </div>
);

const MockUnlockBtn = () => (
    <div className="flex space-x-2">
        <div className="px-3 py-1.5 bg-violet-800 rounded border border-white/10 text-[10px] text-white font-bold shadow">他人を占う</div>
    </div>
);

export const Manual: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg group whitespace-nowrap"
            >
                <div className="bg-indigo-500 p-1 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <span className="font-bold text-xs">取扱説明書</span>
            </button>

            {isOpen && createPortal(
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10000] flex justify-center items-start overflow-y-auto pt-10 pb-10"
                    onClick={() => setIsOpen(false)}
                >
                    <div 
                        className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-gray-900 to-black w-full max-w-2xl mx-4 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.3)] border border-white/20 flex flex-col relative animate-fade-in"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 bg-white/5 rounded-t-2xl flex justify-between items-center sticky top-0 backdrop-blur-xl z-10">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-pink-500 to-cyan-500 p-2 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300">
                                    AI Fortune Teller 取扱説明書
                                </h2>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-8 overflow-y-auto max-h-[80vh]">
                            <p className="text-indigo-200 mb-8 text-sm leading-relaxed border-l-4 border-indigo-500 pl-4 bg-indigo-900/20 p-3 rounded-r-lg font-bold">
                                入力データはサーバーに保存されず、ブラウザ内のみで管理されるため安全です。
                            </p>

                            <InstructionStep 
                                number={1} 
                                title="自分の情報をセットする"
                                visual={<MockInput />}
                            >
                                <p>生年月日、血液型、星座、干支を選択してください。</p>
                                <p className="text-xs text-gray-400 mt-2">※個人情報保護のため、氏名の入力は不要です。<br/>※一度入力すると、次回から自動で入力されます。</p>
                            </InstructionStep>

                            <InstructionStep 
                                number={2} 
                                title="情報を固定・保存する"
                                visual={<MockLockBtn />}
                            >
                                <p>入力が終わったら「入力を固定する」ボタンをタップしてください。</p>
                                <p className="text-xs text-gray-400 mt-2">※情報がブラウザに保存され、次回から入力の手間が省けます。<br/>※誤操作による情報の変更も防げます。</p>
                            </InstructionStep>

                            <InstructionStep 
                                number={3} 
                                title="占う日付を選ぶ"
                                visual={<MockDateToggle />}
                            >
                                <p>「今日」または「明日」のボタンをタップして、占いたい日付を選択してください。</p>
                            </InstructionStep>

                            <InstructionStep 
                                number={4} 
                                title="鑑定を開始する"
                                visual={<MockSubmitBtn />}
                            >
                                <p>「運勢を占う」ボタンをタップしてください。</p>
                                <p className="text-xs text-gray-400 mt-2">※数秒〜十数秒ほどでAIによる鑑定結果が表示されます。</p>
                            </InstructionStep>

                            <InstructionStep 
                                number={5} 
                                title="結果を確認する"
                                visual={<MockResultCard />}
                            >
                                <p>総合、金運、健康、恋愛、仕事の5項目について、5段階評価とアドバイスが表示されます。</p>
                                <p>さらに、その日のラッキーアイテムとラッキーナンバーも提案されます。</p>
                            </InstructionStep>

                            <InstructionStep 
                                number={6} 
                                title="他の人を占いたい場合"
                                visual={<MockUnlockBtn />}
                            >
                                <p>自分以外の人を占いたい場合は、「固定を解除」ボタンをタップするか、「他人を占う」ボタンをタップしてください。</p>
                                <p>入力欄のロックが解除され、別の生年月日などを入力できるようになります。</p>
                            </InstructionStep>

                            <div className="mt-8 pt-6 border-t border-white/20">
                                <p className="text-xs text-indigo-300 leading-relaxed font-bold">
                                    ※ご利用制限について<br/>
                                    安定したサービス提供と回答の質を維持するため、1日の利用上限を「合計5回まで」としております（毎日0時にリセットされます）。あらかじめご了承ください。
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-white/5 rounded-b-2xl text-center">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 border border-white/10"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
