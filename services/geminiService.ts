import { GoogleGenAI, Type } from "@google/genai";
import { Fortune, UserInfo } from "../types";

// ⚠️ 動作確認用：APIキー直書き（公開厳禁）
const ai = new GoogleGenAI({
  apiKey: "AIzaSyBCXgy6OkjoJL6JnaHMaZPrilF8OawKs1o"
});

/**
 * 鑑定実行サービス
 * 入力された個人情報はAIへの送信に使用されるのみで、
 * アプリケーションサーバー側での保存は一切行われません。
 * Google Maps API等の外部ツールも一切使用しません。
 */
export const getFortune = async (
  userInfo: UserInfo,
  targetDate: string
): Promise<Fortune> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `${targetDate}の運勢を占ってください。
【重要】評価(luck)は1〜5で分散させ、解説(text)は40文字以内で簡潔に出力してください。
入力情報：${JSON.stringify(userInfo)}`,
    config: {
      responseMimeType: "application/json",
      seed: 42,
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

  return JSON.parse(response.text) as Fortune;
};
