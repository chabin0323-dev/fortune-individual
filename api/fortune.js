function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

function makeLuck(seed, offset = 0) {
  return ((seed + offset) % 5) + 1;
}

function makeWeeklyBiorhythm(baseDateStr, seed) {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const baseDate = new Date(baseDateStr);
  const result = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');

    result.push({
      date: `${yyyy}-${mm}-${dd}`,
      day: days[d.getDay()],
      luck: makeLuck(seed, i)
    });
  }

  return result;
}

function buildFallbackFortune(prompt) {
  const seed = hashString(prompt);

  const overallTexts = [
    '今日は落ち着いて行動すると、物事が良い方向へ進みやすい日です。',
    '直感を信じて進むことで、小さな幸運を引き寄せやすい日です。',
    '焦らず丁寧に過ごすことで、安心感と充実感を得やすい日です。',
    '人とのやり取りの中に、前向きなヒントが見つかりやすい日です。',
    '自分のペースを大切にすると、運気の流れが整いやすい日です。'
  ];

  const moneyTexts = [
    '無駄遣いを控えると、金運の安定につながります。',
    '必要なものに絞って使うことで、満足度の高いお金の流れになります。',
    '小さな節約が後で大きな安心につながる日です。',
    '買い物は比較してから決めると良い結果になりやすいです。',
    'お金の管理を見直すと、気持ちにも余裕が生まれます。'
  ];

  const healthTexts = [
    '無理をせず、睡眠と休息を意識すると体調が整いやすい日です。',
    '軽い運動や深呼吸が心身のバランスを整えてくれます。',
    '食事の時間を整えると、体のリズムが安定しやすいです。',
    '今日は頑張りすぎず、ゆとりを持つことが健康運アップにつながります。',
    '体を温めることを意識すると、快適に過ごしやすい日です。'
  ];

  const loveTexts = [
    '優しい言葉が相手との距離を縮めやすい日です。',
    '素直な気持ちを少しだけ表現すると、関係が前向きに進みやすいです。',
    '焦らず自然体でいることで、魅力が伝わりやすくなります。',
    '相手を思いやる行動が恋愛運を高めてくれる日です。',
    '小さな気配りが心のつながりを深めやすい日です。'
  ];

  const workTexts = [
    'ひとつずつ丁寧に進めることで、信頼につながりやすい日です。',
    '優先順位をはっきりさせると、効率よく動けます。',
    '今日は確認作業を大切にすると、良い成果を出しやすいです。',
    '新しい工夫を少し取り入れると、仕事運が上向きやすいです。',
    '落ち着いて対応することで、周囲からの評価も安定しやすいです。'
  ];

  const adviceTexts = [
    '今日は小さなことでも一歩前に進める行動を意識してみてください。',
    '迷った時は、無理に急がず落ち着いて選ぶことが大切です。',
    '身の回りを少し整えると、運気の流れも整いやすくなります。',
    '人に優しく接することで、巡り巡って良い流れが戻ってきます。',
    '自分を責めず、できたことに目を向けると前向きな一日になります。'
  ];

  const luckyItems = ['青いノート', '小さな鏡', 'ハンカチ', 'お気に入りのペン', '香りの良いハンドクリーム'];
  const luckyColors = ['ネイビー', 'ピンク', 'グリーン', 'ゴールド', 'スカイブルー'];
  const luckyNumbers = ['3', '5', '7', '8', '9'];

  const dateMatch = prompt.match(/対象日:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/);
  const baseDateStr = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

  return {
    overall: {
      luck: makeLuck(seed, 0),
      text: pick(overallTexts, seed + 1)
    },
    money: {
      luck: makeLuck(seed, 1),
      text: pick(moneyTexts, seed + 2)
    },
    health: {
      luck: makeLuck(seed, 2),
      text: pick(healthTexts, seed + 3)
    },
    love: {
      luck: makeLuck(seed, 3),
      text: pick(loveTexts, seed + 4)
    },
    work: {
      luck: makeLuck(seed, 4),
      text: pick(workTexts, seed + 5)
    },
    advice: pick(adviceTexts, seed + 6),
    weeklyBiorhythm: makeWeeklyBiorhythm(baseDateStr, seed),
    luckyItem: pick(luckyItems, seed + 7),
    luckyColor: pick(luckyColors, seed + 8),
    luckyNumber: pick(luckyNumbers, seed + 9)
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

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // APIキーがなくても固定ロジックで返す
      return res.status(200).json(buildFallbackFortune(prompt));
    }

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              temperature: 0,
              topP: 0.1,
              topK: 1,
              maxOutputTokens: 2048,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      const rawText = await response.text();

      if (!response.ok) {
        // Gemini失敗時も固定ロジックで返す
        return res.status(200).json(buildFallbackFortune(prompt));
      }

      let apiData;
      try {
        apiData = JSON.parse(rawText);
      } catch {
        return res.status(200).json(buildFallbackFortune(prompt));
      }

      let text =
        apiData?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';

      if (!text) {
        return res.status(200).json(buildFallbackFortune(prompt));
      }

      text = text
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');

      if (start !== -1 && end !== -1) {
        text = text.slice(start, end + 1);
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        return res.status(200).json(buildFallbackFortune(prompt));
      }

      const result = {
        overall: parsed.overall || { luck: 3, text: '' },
        money: parsed.money || { luck: 3, text: '' },
        health: parsed.health || { luck: 3, text: '' },
        love: parsed.love || { luck: 3, text: '' },
        work: parsed.work || { luck: 3, text: '' },
        advice: parsed.advice || '',
        weeklyBiorhythm: Array.isArray(parsed.weeklyBiorhythm)
          ? parsed.weeklyBiorhythm
          : buildFallbackFortune(prompt).weeklyBiorhythm,
        luckyItem: parsed.luckyItem || '',
        luckyColor: parsed.luckyColor || '',
        luckyNumber: parsed.luckyNumber || ''
      };

      return res.status(200).json(result);
    } catch {
      // 何が起きても必ず返す
      return res.status(200).json(buildFallbackFortune(prompt));
    }
  } catch (error) {
    return res.status(200).json(
      buildFallbackFortune(
        (req.body && req.body.prompt) || '対象日: ' + new Date().toISOString().split('T')[0]
      )
    );
  }
}
