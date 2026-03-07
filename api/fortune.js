import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req, res) {
    // CORS configuration
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { userInfo, targetDate } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not set');
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        // Generate a deterministic seed based on user info and date
        // string to hash function
        const createHash = (str) => {
            let hash = 0;
            if (str.length === 0) return hash;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return Math.abs(hash);
        };

        const seedString = `${JSON.stringify(userInfo)}-${targetDate}`;
        const deterministicSeed = createHash(seedString);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${targetDate}の運勢を占ってください。
【重要】評価(luck)は1〜5で分散させ、解説(text)は40文字以内で簡潔に出力してください。
入力情報：${JSON.stringify(userInfo)}`,
            config: {
                responseMimeType: "application/json",
                seed: deterministicSeed,
                temperature: 0,
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overall: {
                            type: Type.OBJECT,
                            properties: {
                                luck: { type: Type.INTEGER },
                                text: { type: Type.STRING }
                            },
                            required: ["luck", "text"]
                        },
                        money: {
                            type: Type.OBJECT,
                            properties: {
                                luck: { type: Type.INTEGER },
                                text: { type: Type.STRING }
                            },
                            required: ["luck", "text"]
                        },
                        health: {
                            type: Type.OBJECT,
                            properties: {
                                luck: { type: Type.INTEGER },
                                text: { type: Type.STRING }
                            },
                            required: ["luck", "text"]
                        },
                        love: {
                            type: Type.OBJECT,
                            properties: {
                                luck: { type: Type.INTEGER },
                                text: { type: Type.STRING }
                            },
                            required: ["luck", "text"]
                        },
                        work: {
                            type: Type.OBJECT,
                            properties: {
                                luck: { type: Type.INTEGER },
                                text: { type: Type.STRING }
                            },
                            required: ["luck", "text"]
                        },
                        luckyItem: { type: Type.STRING },
                        luckyNumber: { type: Type.STRING }
                    },
                    required: [
                        "overall",
                        "money",
                        "health",
                        "love",
                        "work",
                        "luckyItem",
                        "luckyNumber"
                    ]
                }
            }
        });

        const fortune = JSON.parse(response.text);
        res.status(200).json(fortune);
    } catch (error) {
        console.error('API Error:', error);
        // ユーザーに正確なエラーを返す（APIキー無効など）
        res.status(500).json({
            error: 'Fortune Telling Failed',
            details: error.message || 'Unknown error occurred',
            type: error.name
        });
    }
}
