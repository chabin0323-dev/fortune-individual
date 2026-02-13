import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const apiKey = process.env.API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API_KEY missing" });

  try {
    const { userInfo, targetDate } = req.body ?? {};
    if (!userInfo || !targetDate) {
      return res.status(400).json({ error: "userInfo and targetDate are required" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
${targetDate}の運勢を占ってください。
【重要】評価(luck)は1〜5で整数。解説(text)は40文字以内で簡潔に。
入力情報: ${JSON.stringify(userInfo)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            luck: { type: Type.INTEGER },
            text: { type: Type.STRING }
          },
          required: ["luck", "text"]
        }
      }
    });

    // SDKの返り方が環境で違うので、文字列として取り出してJSON化する
    const raw = (response as any)?.text?.() ?? (response as any)?.response?.text?.() ?? "";
    const data = raw ? JSON.parse(raw) : (response as any);

    return res.status(200).json(data);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message ?? "Internal Error" });
  }
}
