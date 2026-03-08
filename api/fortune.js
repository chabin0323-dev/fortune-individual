export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not set"
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 32,
            topP: 0.9,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({
        error: "Gemini API request failed",
        details: errorText
      });
    }

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    if (!text) {
      return res.status(500).json({
        error: "No text returned from Gemini",
        raw: data
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "Failed to parse Gemini JSON response",
        rawText: text
      });
    }

    const result = {
      overall: parsed.overall || { luck: 3, text: "" },
      money: parsed.money || { luck: 3, text: "" },
      health: parsed.health || { luck: 3, text: "" },
      love: parsed.love || { luck: 3, text: "" },
      work: parsed.work || { luck: 3, text: "" },
      advice: parsed.advice || "",
      weeklyBiorhythm: Array.isArray(parsed.weeklyBiorhythm)
        ? parsed.weeklyBiorhythm
        : [],
      luckyItem: parsed.luckyItem || "",
      luckyColor: parsed.luckyColor || "",
      luckyNumber: parsed.luckyNumber || ""
    };

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}
