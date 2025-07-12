import { getScript } from "../services/generate-script.js";

export async function generateScript(req, res) {
  try {
    const scriptInput = req.body; // Lấy dữ liệu từ body của request
    if (
      !scriptInput ||
      !scriptInput.title ||
      !scriptInput.genre ||
      !scriptInput.type
    ) {
      return res.status(400).json({
        error: "Title, genre, and type are required.",
      });
    }

    const script = await getScript(scriptInput);
    res.status(200).json(script);
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate script.",
    });
  }
}
