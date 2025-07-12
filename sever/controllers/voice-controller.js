import { getVoice } from "../services/generate-voice.js";

export async function generateVoice(req, res) {
  try {
    const voiceInput = req.body; // Lấy dữ liệu từ body của request
    if (!voiceInput || !voiceInput.voice || !voiceInput.text) {
      return res.status(400).json({
        error: "Voice input is required.",
      });
    }

    const voiceData = await getVoice(voiceInput);
    if (!voiceData) {
      return res.status(500).json({
        error: "Failed to generate voice.",
      });
    }

    res.status(200).json(voiceData);
  } catch (error) {
    console.error("❌ Lỗi khi tạo giọng nói:", error);
    res.status(500).json({
      error: "Failed to generate voice.",
    });
  }
}
