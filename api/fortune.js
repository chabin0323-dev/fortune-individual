
export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { prompt } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    let text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ```json 제거
    text = text.replace(/```json/g, "")
               .replace(/```/g, "")
               .trim();

    // JSON部分だけ抽出
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return res.status(500).json({
        error: "Gemini returned invalid format",
        raw: text
      });
    }

    const jsonText = text.substring(start, end + 1);

    const result = JSON.parse(jsonText);

    res.status(200).json(result);

  } catch (err) {

    res.status(500).json({
      error: "Fortune API failed",
      details: err.message
    });

  }

}
