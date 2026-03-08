import React from 'react';
import { Fortune } from '../types';

type Props = {
  fortune: Fortune;
};

const renderStars = (luck: number) => {
  const safeLuck = Math.max(1, Math.min(5, Number(luck) || 1));
  return '★'.repeat(safeLuck) + '☆'.repeat(5 - safeLuck);
};

const FortuneCard: React.FC<{
  title: string;
  luck: number;
  text: string;
}> = ({ title, luck, text }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 shadow-md">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <div className="text-yellow-300 text-xl mb-2">{renderStars(luck)}</div>
      <p className="text-zinc-200 leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
};

export const FortuneResultDisplay: React.FC<Props> = ({ fortune }) => {
  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-cyan-700/40 rounded-2xl p-4 shadow-lg">
        <p className="text-cyan-300 text-sm mb-1">鑑定日</p>
        <p className="text-white text-xl font-bold">{fortune.fortuneDate}</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-3">今日の総合運</h2>
        <div className="text-yellow-300 text-2xl mb-3">
          {renderStars(fortune.overall?.luck)}
        </div>
        <p className="text-zinc-100 leading-relaxed whitespace-pre-line">
          {fortune.overall?.text}
        </p>
      </div>

      <div className="bg-zinc-900 border border-emerald-700/40 rounded-2xl p-5 shadow-lg">
        <h2 className="text-2xl font-bold text-emerald-300 mb-3">今日の開運アクション</h2>
        <p className="text-zinc-100 leading-relaxed whitespace-pre-line">
          {fortune.action || '朝に5分だけ身の回りを整える。'}
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-3">今日のアドバイス</h2>
        <p className="text-zinc-100 leading-relaxed whitespace-pre-line">
          {fortune.advice || '今日は無理をせず、自分のペースを大切にしてください。'}
        </p>
      </div>

      <div className="bg-zinc-900 border border-yellow-700/50 rounded-2xl p-5 shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-300 mb-4">今週のバイオリズム</h2>

        {fortune.weeklyBiorhythm && fortune.weeklyBiorhythm.length > 0 ? (
          <div className="space-y-4">
            {fortune.weeklyBiorhythm.map((item, index) => (
              <div
                key={`${item.date}-${index}`}
                className="rounded-2xl p-5 border bg-zinc-900 border-zinc-700 shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-zinc-300 text-xl font-semibold">
                    {item.date}
                  </div>
                  <div className="text-yellow-300 text-2xl">
                    {renderStars(item.luck)}
                  </div>
                </div>

                <p className="text-white text-2xl font-bold leading-relaxed">
                  {item.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-300">今週のバイオリズムはまだありません。</p>
        )}

        <p className="text-zinc-400 text-sm mt-4">
          ※毎日の運勢の波を示したものです。行動の参考としてお役立てください
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FortuneCard title="金運" luck={fortune.money?.luck} text={fortune.money?.text} />
        <FortuneCard title="健康運" luck={fortune.health?.luck} text={fortune.health?.text} />
        <FortuneCard title="恋愛運" luck={fortune.love?.luck} text={fortune.love?.text} />
        <FortuneCard title="仕事運" luck={fortune.work?.luck} text={fortune.work?.text} />
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">ラッキー情報</h2>

        <div className="space-y-3 text-zinc-100">
          <div className="bg-zinc-800 rounded-xl px-4 py-3">
            <span className="font-bold text-pink-300">ラッキーアイテム：</span>
            <span>{fortune.luckyItem || 'ノート'}</span>
          </div>

          <div className="bg-zinc-800 rounded-xl px-4 py-3">
            <span className="font-bold text-sky-300">ラッキーカラー：</span>
            <span>{fortune.luckyColor || 'ネイビー'}</span>
          </div>

          <div className="bg-zinc-800 rounded-xl px-4 py-3">
            <span className="font-bold text-emerald-300">ラッキーナンバー：</span>
            <span>{fortune.luckyNumber || '7'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
