import axios from "axios";

const API_KEY = "lAcs8FJVoDBNjQo5Di1UrySLmDhWycV5"; // Thay bằng API key thật
const VOICE = "banmai"; // Các voice: banmai, thuminh, leminh, ...
const TEXT =
  "Tôi thấy dịch vụ TTS của FPT ngu vl, đặc tả api như cái đầu buồi ";

async function fptTextToSpeech() {
  try {
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

    // Nếu thành công, response.data sẽ chứa URL âm thanh:
    // { async: true, error: 0, message: "Success", request_id: "...", url: "https://..." }
  } catch (error) {
    console.error("❌ Lỗi:", error.response?.data || error.message);
  }
}

fptTextToSpeech();
