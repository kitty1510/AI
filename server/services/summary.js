import { GoogleGenAI } from "@google/genai";
import { constant } from "../config/env.js";
import { parseScript } from "../utils/parse-script.js";

const ai = new GoogleGenAI({
  apiKey: constant.API_SCRIPT,
});

export async function getScriptSummary(scriptInput) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Summarize the following script about 5-15 word in Vietnamese, focusing on the main points and key details. Just return the summary:\n\n${scriptInput}`,
            },
          ],
        },
      ],
    });

    const text = await response.text; // hoặc response.text nếu SDK hỗ trợ
    console.log("✅ Gemini response:", text);

    return text;
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    throw new Error("Failed to generate script from AI.");
  }
}
