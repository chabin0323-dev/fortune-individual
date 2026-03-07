import { Fortune, UserInfo } from "../types";

/**
 * 鑑定実行サービス
 * APIエンドポイント経由でAIによる鑑定を行います。
 */
export const getFortune = async (
  userInfo: UserInfo,
  targetDate: string
): Promise<Fortune> => {
  try {
    const response = await fetch('/api/fortune', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInfo, targetDate }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as Fortune;
  } catch (error) {
    console.error("Fortune telling failed:", error);
    throw error;
  }
};
