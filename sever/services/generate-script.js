import { GoogleGenAI } from "@google/genai";
import { constant } from "../config/env.js";
import { parseScript } from "../utils/parse-script.js";

const ai = new GoogleGenAI({
  apiKey: constant.API_SCRIPT,
});

export async function getScript(scriptInput) {
  try {
    console.log("Generating script with input:", scriptInput);
    const prompt = `
The main story is about: "${scriptInput.title}" has genre: "${scriptInput.genre}", type: "${scriptInput.type}".

Please return your result in the following array format only not json,not special characters,not markdown,not code block:
[
  {
    "scene": "Scene 1: Introduction",
    "scene content": all the content of the scene, including characters, actions, and dialogue. Use a single paragraph for each scene.
    "summary": "summary about the scene",
    "scene_description": "character with action (english)"
  },
  ...
]
Only return the array above, no explanation or extra text.
`;

    const ai = new GoogleGenAI({
      apiKey: constant.API_SCRIPT,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents:
        "create a short story about 60s to read,not using given name just usepersonal pronoun,vietnamese language'" +
        prompt +
        "'",
    });
    console.log(response.text);

    const data = parseScript(response.text); // parse thành mảng các scene
    return data;
  } catch (error) {
    throw new Error("Failed to generate script from AI.");
  }
}
