function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickBySeed(arr, seed) {
  return arr[seed % arr.length];
}

function makeDailyLuck(userSeed, dateStr) {
  const seed = hashString(`${userSeed}_${dateStr}`);
  return (seed % 5) + 1;
}

function makeDailyComment(luck) {
  switch (luck) {
    case 5:
      return '今週のピーク。積極的な行動が吉。';
    case 4:
      return '好調なスタート。直感を信じて進んで。';
    case 3:
      return '安定した運気。ルーチンを大切に。';
    case 2:
      return '少し休息が必要。無理は禁物です。';
    case 1:
    default:
      return '穏やかな流れ。自分を労わって。';
  }
}

function makeWeeklyBiorhythm(baseDateStr, userSeed) {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const baseDate = new Date(baseDateStr);
  const result = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const luck = makeDailyLuck(userSeed, dateStr);

    result.push({
      date: dateStr,
      day: days[d.getDay()],
      luck,
      comment: makeDailyComment(luck),
    });
  }

  return result;
}

function buildDeterministicFortune(prompt) {
  const dateMatch = prompt.match(/対象日:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/);
  const nameMatch = prompt.match(/名前:\s*(.+)/);
  const birthMatch = prompt.match(/生年月日:\s*([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})/);

  const baseDateStr = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
  const name = nameMatch ? nameMatch[1].trim() : 'あなた';
  const birth = birthMatch ? birthMatch[1].trim() : '1990-1-1';

  const userSeedBase = `${name}_${birth}`;
  const seed = hashString(`${userSeedBase}_${baseDateStr}`);

  const overallTexts = [
    '今日は全体的に前向きな流れです。焦らず進むことで運気が整いやすい日です。',
    '小さな行動の積み重ねが大きな成果につながりやすい日です。',
    '直感と現実のバランスを取ることで、安定した一日になりやすいです。',
    '落ち着いた判断が幸運を引き寄せる日です。自分の感覚を大切にしてください。',
    '無理をしすぎず、自分のペースを守ることで流れが良くなります。'
  ];

  const moneyTexts = [
    '計画的なお金の使い方が吉です。',
    '必要なものを見極めると金運が安定します。',
    '衝動買いを避けると気持ちにも余裕が出ます。',
    '小さな節約が後で大きな安心につながります。',
    'お金の流れを見直すのに良い日です。'
  ];

  const healthTexts = [
    '休息を意識すると体調が整いやすい日です。',
    '睡眠と水分補給を大切にすると快適に過ごせます。',
    '軽い運動が心身のバランスを整えてくれます。',
    '無理をしないことが健康運アップにつながります。',
    '今日は身体を温めることを意識してください。'
  ];

  const loveTexts = [
    '優しい言葉が良い流れを呼びます。',
    '自然体でいることで魅力が伝わりやすい日です。',
    '小さな気配りが恋愛運を高めてくれます。',
    '焦らず穏やかに向き合うことで関係が深まりやすいです。',
    '素直な気持ちが良い縁を引き寄せます。'
  ];

  const workTexts = [
    '丁寧な確認が成果につながりやすい日です。',
    '優先順位を整理するとスムーズに進みます。',
    '落ち着いて取り組むと良い評価につながりやすいです。',
    '一つずつ進めることで信頼を得やすい日です。',
    '今日は地道な努力が実りやすい日です。'
  ];

  const adviceTexts = [
    '今日は一つだけでも前向きな行動を選んでみてください。',
    '焦らず、自分のリズムを大切にすると良い流れになります。',
    '身の回りを整えると気持ちも運気も安定しやすくなります。',
    '無理に頑張りすぎず、できたことを認めることが大切です。',
    '人とのやり取りでは、優しさを少し多めに意識すると吉です。'
  ];

  const luckyItems = ['青いノート', 'お気に入りのペン', 'ハンカチ', '小さな鏡', '香りのよいハンドクリーム'];
  const luckyColors = ['ネイビー', 'ゴールド', 'ピンク', 'スカイブルー', 'グリーン'];
  const luckyNumbers = ['3', '5', '7', '8', '9'];

  return {
    overall: {
      luck: (seed % 5) + 1,
      text: pickBySeed(overallTexts, seed + 1),
    },
    money: {
      luck: ((seed + 1) % 5) + 1,
      text: pickBySeed(moneyTexts, seed + 2),
    },
    health: {
      luck: ((seed + 2) % 5) + 1,
      text: pickBySeed(healthTexts, seed + 3),
    },
    love: {
      luck: ((seed + 3) % 5) + 1,
      text: pickBySeed(loveTexts, seed + 4),
    },
    work: {
      luck: ((seed + 4) % 5) + 1,
      text: pickBySeed(workTexts, seed + 5),
    },
    advice: pickBySeed(adviceTexts, seed + 6),
    weeklyBiorhythm: makeWeeklyBiorhythm(baseDateStr, userSeedBase),
    luckyItem: pickBySeed(luckyItems, seed + 7),
    luckyColor: pickBySeed(luckyColors, seed + 8),
    luckyNumber: pickBySeed(luckyNumbers, seed + 9),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // まず固定結果を作る
    const fallback = buildDeterministicFortune(prompt);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json(fallback);
    }

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0,
              topP: 0.1,
              topK: 1,
              maxOutputTokens: 2048,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      const rawText = await response.text();

      if (!response.ok) {
        return res.status(200).json(fallback);
      }

      let apiData;
      try {
        apiData = JSON.parse(rawText);
      } catch {
        return res.status(200).json(fallback);
      }

      let text =
        apiData?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';

      if (!text) {
        return res.status(200).json(fallback);
      }

      text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');

      if (start !== -1 && end !== -1) {
        text = text.slice(start, end + 1);
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        return res.status(200).json(fallback);
      }

      // 週バイオリズムは必ず固定ロジックを優先
      return res.status(200).json({
        overall: parsed.overall || fallback.overall,
        money: parsed.money || fallback.money,
        health: parsed.health || fallback.health,
        love: parsed.love || fallback.love,
        work: parsed.work || fallback.work,
        advice: parsed.advice || fallback.advice,
        weeklyBiorhythm: fallback.weeklyBiorhythm,
        luckyItem: parsed.luckyItem || fallback.luckyItem,
        luckyColor: parsed.luckyColor || fallback.luckyColor,
        luckyNumber: parsed.luckyNumber || fallback.luckyNumber,
      });
    } catch {
      return res.status(200).json(fallback);
    }
  } catch {
    return res.status(200).json({
      overall: { luck: 3, text: '今日は落ち着いて行動すると良い流れに乗れます。' },
      money: { luck: 3, text: '無駄遣いを控えると安定しやすい日です。' },
      health: { luck: 3, text: '休息を意識すると整いやすい日です。' },
      love: { luck: 3, text: '素直な気持ちが伝わりやすい日です。' },
      work: { luck: 3, text: '一つずつ丁寧に進めると良い結果につながります。' },
      advice: '今日は焦らず、自分のペースを大切にしてください。',
      weeklyBiorhythm: [],
      luckyItem: 'ノート',
      luckyColor: 'ネイビー',
      luckyNumber: '7',
    });
  }
}
