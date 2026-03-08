import { Fortune, UserInfo } from '../types';

const formatLocalDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export async function getFortune(
  userInfo: UserInfo,
  targetDateType: 'today' | 'tomorrow'
): Promise<Fortune> {
  const today = new Date();
  const targetDate = new Date(today);

  if (targetDateType === 'tomorrow') {
    targetDate.setDate(today.getDate() + 1);
  }

  // 日本時間ベースで日付文字列を作る
  const dateString = formatLocalDate(targetDate);

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
・前向きで自然な日本語にする
・JSON以外の文章は一切出力しない
・今日の開運アクションを1つ入れる
・weeklyBiorhythm は必ず7件返す
・weeklyBiorhythm の comment は重複させない
・fortuneDate は対象日をそのまま入れる

【JSON形式でのみ出力】
{
  "fortuneDate": "${dateString}",
  "overall": { "luck": 4, "text": "..." },
  "money": { "luck": 3, "text": "..." },
  "health": { "luck": 4, "text": "..." },
  "love": { "luck": 5, "text": "..." },
  "work": { "luck": 4, "text": "..." },
  "advice": "...",
  "action": "...",
  "weeklyBiorhythm": [
    { "date": "${dateString}", "day": "日", "luck": 4, "comment": "..." }
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

  const raw = await response.text();

  if (!response.ok) {
    let message = 'Fortune API failed';

    try {
      const parsed = JSON.parse(raw);
      message = parsed.details || parsed.error || raw || message;
    } catch {
      message = raw || message;
    }

    throw new Error(message);
  }

  let data: Fortune;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('APIの返答を読み取れませんでした。');
  }

  return data;
}
