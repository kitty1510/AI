import axios from "axios";
import { constant } from "../config/env.js";

const API_KEY = constant.API_VOICE; // Thay bằng API key của bạn
const voicePool = ["banmai", "lannhi", "leminh", "myan", "giahuy", "linhsan"];

export async function getVoice(voiceInput) {
  try {
    const VOICE = voiceInput.voice;
    const TEXT = voiceInput.text;

    if (VOICE && !voicePool.includes(VOICE)) {
      throw new Error(
        `Giọng nói "${VOICE}" không hợp lệ. Vui lòng chọn từ: ${voicePool.join(
          ", "
        )}`
      );
    }
    if (!TEXT || typeof TEXT !== "string") {
      throw new Error(
        "Vui lòng cung cấp văn bản hợp lệ để chuyển đổi giọng nói."
      );
    }

    const response = await axios.post("https://api.fpt.ai/hmi/tts/v5", TEXT, {
      headers: {
        api_key: API_KEY,
        voice: VOICE,
        callback_url: "", // Bỏ trống nếu không dùng callback
        "Cache-Control": "no-cache",
        "Content-Type": "text/plain",
      },
    });

    console.log("✅ Response:", response.data);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("❌ Lỗi:", error.response?.data || error.message);
  }
}
