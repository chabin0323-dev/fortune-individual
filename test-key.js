import { GoogleGenAI } from "@google/genai";

const run = async () => {
    try {
        const ai = new GoogleGenAI({
            apiKey: "AIzaSyD783cbqsGPwfPjrdaULNs8l1xwyQdqi_Y"
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Tell me a joke."
        });

        console.log("Success:", response.text);
    } catch (e) {
        console.error("Error:", e);
    }
};

run();
