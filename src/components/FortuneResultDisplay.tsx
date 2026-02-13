
import React from 'react';
import { Fortune, FortuneCategory } from '../types';
import { categoryIcons } from './icons';

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-5 h-5 ${filled ? 'text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]' : 'text-gray-700'}`}
    fill="currentColor"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, index) => (
      <StarIcon key={index} filled={index < rating} />
    ))}
  </div>
);

const FortuneCard: React.FC<{ title: string; category: FortuneCategory; icon: string }> = ({ title, category, icon }) => (
  <div className="bg-white/5 p-5 rounded-lg border border-white/10 h-full flex flex-col hover:bg-white/10 hover:border-white/20 transition duration-300 shadow-lg">
    <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
            <img src={icon} alt={`${title} icon`} className="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-cyan-200">{title}</h3>
        </div>
        <StarRating rating={category.luck} />
    </div>
    <p className="text-indigo-100 flex-grow leading-relaxed opacity-90">{category.text}</p>
  </div>
);

export const FortuneResultDisplay: React.FC<{ fortune: Fortune; date: string; name: string }> = ({ fortune, date, name }) => {
  const displayName = name === 'あなた' ? 'あなた' : (name === 'あの人' ? 'あの人' : `${name}さん`);

  return (
  <div className="animate-fade-in space-y-8">
     <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 via-cyan-400 to-emerald-400 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
        {date}の{displayName}の運勢
      </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <FortuneCard title="総合運" category={fortune.overall} icon={categoryIcons.overall} />
      <FortuneCard title="金運" category={fortune.money} icon={categoryIcons.money} />
      <FortuneCard title="健康運" category={fortune.health} icon={categoryIcons.health} />
      <FortuneCard title="恋愛運" category={fortune.love} icon={categoryIcons.love} />
      <FortuneCard title="仕事運" category={fortune.work} icon={categoryIcons.work} />
    </div>
     
     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lucky Item Card */}
          <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 p-5 rounded-lg border border-white/20 flex items-center space-x-4 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <img src={categoryIcons.luckyItem} alt="Lucky item icon" className="h-14 w-14 object-contain drop-shadow-[0_0_15px_rgba(253,224,71,0.6)] animate-pulse" />
              <div>
                <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200">ラッキーアイテム</h3>
                <p className="text-xl text-white font-medium tracking-wide">{fortune.luckyItem}</p>
              </div>
          </div>

          {/* Lucky Number Card */}
          <div className="bg-gradient-to-r from-indigo-900/40 via-blue-900/40 to-indigo-900/40 p-5 rounded-lg border border-white/20 flex items-center space-x-4 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.3)]">
               <div className="h-14 w-14 flex items-center justify-center rounded-full bg-white/10 border border-white/20 shadow-inner flex-shrink-0">
                  <span className="text-xl font-bold text-cyan-300">No.</span>
               </div>
               <div>
                  <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200">ラッキーナンバー</h3>
                  <p className="text-3xl text-white font-bold tracking-widest font-mono drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">{fortune.luckyNumber || '-'}</p>
               </div>
          </div>
    </div>
  </div>
  );
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}
