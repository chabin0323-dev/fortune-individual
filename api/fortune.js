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

function makeFallbackComment(luck, seed) {
  const comments = {
    5: [
      "運気のピークです。思い切った行動が良い結果を引き寄せます。",
      "最高の流れの日です。挑戦するほど追い風を感じるでしょう。",
      "運気が大きく高まっています。積極的な行動が幸運を呼び込みます。",
      "今週の中でも特に強い運勢です。新しいことに挑戦する好機です。",
      "前向きな流れが強い日です。人との交流が幸運につながります。"
    ],
    4: [
      "好調な運気です。落ち着いて行動すると成果が得られます。",
      "順調な流れの日です。丁寧な行動が幸運を呼びます。",
      "運気が安定しています。焦らず進めば良い結果に。",
      "良い流れに乗りやすい日です。周囲との協力が鍵になります。",
      "前向きな気持ちが運気をさらに高めます。"
    ],
    3: [
      "安定した運勢です。いつものペースを守りましょう。",
      "平穏な一日です。無理せず過ごすことが大切です。",
      "穏やかな流れです。焦らず丁寧に進めましょう。",
      "日常を大切にすると安心して過ごせる日です。",
      "無理をせず、自分のリズムを大切に。"
    ],
    2: [
      "慎重さが必要な日です。無理をしないように。",
      "少し運気が低調です。休息を意識しましょう。",
      "焦らずゆっくり進むことが大切です。",
      "今日は体調管理を優先すると良いでしょう。",
      "慎重な判断が後の安心につながります。"
    ],
    1: [
      "今日は無理をせず静かに過ごしましょう。",
      "運気が低めの日です。休息を優先してください。",
      "自分を大切にすることが最優先です。",
      "ゆっくり過ごすことで運気が整います。",
      "穏やかな時間が運気回復につながります。"
    ]
  };

  const list = comments[luck] || comments[3];
  return list[seed % list.length];
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

  const actionTexts = [
    '朝に5分だけ身の回りを整える。',
    '気になっていた連絡を1本返す。',
    '財布やバッグの中を整理する。',
    '水分をしっかり取って深呼吸する。',
    '今日中に小さな目標を1つ達成する。',
    '机の上を少し片づけて運気を整える。',
    '感謝の言葉を1回多く伝える。',
    '散歩を5分だけして気分転換する。',
    '新しいことを1つだけ試してみる。',
    '無理な予定を1つ減らして余裕を作る。'
  ];

  const luckyItems = ['青いノート', 'お気に入りのペン', 'ハンカチ', '小さな鏡', '香りのよいハンドクリーム'];
  const luckyColors = ['ネイビー', 'ゴールド', 'ピンク', 'スカイブルー', 'グリーン'];
  const luckyNumbers = ['3', '5', '7', '8', '9'];

  const weeklyBiorhythm = [];
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const baseDate = new Date(baseDateStr);

  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dailySeed = hashString(`${userSeedBase}_${dateStr}`);
    const luck = makeDailyLuck(userSeedBase, dateStr);

    weeklyBiorhythm.push({
      date: dateStr,
      day: days[d.getDay()],
      luck,
      comment: makeFallbackComment(luck, dailySeed)
    });
  }

  return {
    fortuneDate: baseDateStr,
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
    action: pickBySeed(actionTexts, seed + 10),
    weeklyBiorhythm,
    luckyItem: pickBySeed(luckyItems, seed + 7),
    luckyColor: pickBySeed(luckyColors, seed + 8),
    luckyNumber: pickBySeed(luckyNumbers, seed + 9),
  };
}

function cleanGeminiText(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }

  return cleaned;
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
              temperature: 0.2,
              topP: 0.9,
              topK: 32,
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

      text = cleanGeminiText(text);

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        return res.status(200).json(fallback);
      }

      return res.status(200).json({
        fortuneDate: fallback.fortuneDate,
        overall: parsed.overall || fallback.overall,
        money: parsed.money || fallback.money,
        health: parsed.health || fallback.health,
        love: parsed.love || fallback.love,
        work: parsed.work || fallback.work,
        advice: parsed.advice || fallback.advice,
        action: parsed.action || fallback.action,
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
      fortuneDate: new Date().toISOString().split('T')[0],
      overall: { luck: 3, text: '今日は落ち着いて行動すると良い流れに乗れます。' },
      money: { luck: 3, text: '無駄遣いを控えると安定しやすい日です。' },
      health: { luck: 3, text: '休息を意識すると整いやすい日です。' },
      love: { luck: 3, text: '素直な気持ちが伝わりやすい日です。' },
      work: { luck: 3, text: '一つずつ丁寧に進めると良い結果につながります。' },
      advice: '今日は焦らず、自分のペースを大切にしてください。',
      action: '朝に5分だけ身の回りを整える。',
      weeklyBiorhythm: [],
      luckyItem: 'ノート',
      luckyColor: 'ネイビー',
      luckyNumber: '7',
    });
  }
}
