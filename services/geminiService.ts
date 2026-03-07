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
・同じ人物と同じ日付なら必ず同じ結果にする
・ランダムは禁止
・生年月日と対象日から計算した結果にする

【出力内容】

①今日の総合運
前向きで希望が持てる文章で説明

②今日のアドバイス
今日すると良い行動を具体的に書く

③1週間のバイオリズム
対象日から7日間の運勢を出す

例

月：★★★★☆
火：★★★☆☆
水：★★★★★
木：★★☆☆☆
金：★★★★☆
土：★★★☆☆
日：★★★★★

※★は1〜5

④ラッキーアイテム
⑤ラッキーカラー
⑥ラッキーナンバー

JSON形式で出力してください

{
 "overall": { "luck": 4, "text": "" },
 "money": { "luck": 3, "text": "" },
 "health": { "luck": 4, "text": "" },
 "love": { "luck": 5, "text": "" },
 "work": { "luck": 4, "text": "" },
 "luckyItem": "",
 "luckyNumber": ""
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
