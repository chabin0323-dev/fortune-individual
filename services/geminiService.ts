import { Fortune, UserInfo } from '../types';

export async function getFortune(
  userInfo: UserInfo,
  targetDateType: 'today' | 'tomorrow'
): Promise<Fortune> {
  const today = new Date();
  const targetDate = new Date(today);

  if (targetDateType === 'tomorrow') {
    targetDate.setDate(today.getDate() + 1);
  }

  const dateString = targetDate.toISOString().split('T')[0];

  const prompt = `
あなたはプロの占い師です。

以下の情報を元に占い結果を作成してください。

【入力情報】
名前: ${userInfo.name}
生年月日: ${userInfo.year}-${userInfo.month}-${userInfo.day}
血液型: ${userInfo.bloodType}
星座: ${userInfo.zodiacSign}
干支: ${userInfo.eto}
対象日: ${dateString}

【重要ルール】
・占い結果は必ず再現性のある内容にする
・同じ人物と同じ対象日なら必ず同じ結果にする
・ランダム要素は禁止
・生年月日と対象日から計算した結果にする
・1週間のバイオリズムは「対象日」を起点に7日分を出す
・今日アクセスした日ではなく、必ず「対象日」基準で7日分を出す
・JSON以外の文章は一切出力しない

【出力内容】
①今日の総合運
②今日のアドバイス
③1週間のバイオリズム（対象日から7日分）
④金運
⑤健康運
⑥恋愛運
⑦仕事運
⑧ラッキーアイテム
⑨ラッキーカラー
⑩ラッキーナンバー

【1週間のバイオリズムの形式】
weeklyBiorhythm は配列で返すこと。
各要素は以下の形式にすること。

{
  "date": "2026-03-08",
  "day": "日",
  "luck": 5
}

・date は YYYY-MM-DD
・day は 日本語の曜日（例: 月, 火, 水, 木, 金, 土, 日）
・luck は 1〜5 の整数
・必ず7件返すこと

【JSON形式でのみ出力】
{
  "overall": { "luck": 4, "text": "..." },
  "money": { "luck": 3, "text": "..." },
  "health": { "luck": 4, "text": "..." },
  "love": { "luck": 5, "text": "..." },
  "work": { "luck": 4, "text": "..." },
  "advice": "...",
  "weeklyBiorhythm": [
    { "date": "2026-03-08", "day": "日", "luck": 5 },
    { "date": "2026-03-09", "day": "月", "luck": 4 },
    { "date": "2026-03-10", "day": "火", "luck": 3 },
    { "date": "2026-03-11", "day": "水", "luck": 5 },
    { "date": "2026-03-12", "day": "木", "luck": 2 },
    { "date": "2026-03-13", "day": "金", "luck": 4 },
    { "date": "2026-03-14", "day": "土", "luck": 3 }
  ],
  "luckyItem": "...",
  "luckyColor": "...",
  "luckyNumber": "..."
}
`;

  const response = await fetch('/api/fortune', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error('Fortune API failed');
  }

  const data = await response.json();

  return data;
}
