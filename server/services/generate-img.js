import axios from "axios";
import { constant } from "../config/env.js";

const API_KEY = constant.API_IMG || "your_default_api_key_here";

export async function getImg(imgInput) {
  try {
    const modelPool = [
      "anime",
      "pixelart",
      "fantasy",
      "photography",
      "cinematic",
    ];
    const aspectRatioPool = [
      "landscape",
      "portrait",
      "square",
      "smallPortrait",
    ];

    // Gửi prompt tạo ảnh
    const prompt = imgInput.prompt || "Beautiful Sky";
    const model = imgInput.model;
    const aspectRatio = imgInput.aspectRatio;
    if (!modelPool.includes(model)) {
      throw new Error(
        `Model "${model}" is not supported. Please choose from ${modelPool.join(
          ", "
        )}.`
      );
    }

    if (!aspectRatioPool.includes(aspectRatio)) {
      throw new Error(
        `Aspect ratio "${aspectRatio}" is not supported. Please choose from ${aspectRatioPool.join(
          ", "
        )}.`
      );
    }

    const creationResponse = await axios.post(
      "https://api.starryai.com/creations/",
      {
        prompt: prompt,
        images: 1,
        model: model,
        aspectRatio: aspectRatio,
      },
      {
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const creationId = creationResponse.data?.id;
    if (!creationId) {
      throw new Error("Không nhận được creationId từ API.");
    }

    // Kiểm tra trạng thái ảnh
    let maxTries = 1000;
    let delay = 5000;
    let imageUrl = "";

    for (let i = 0; i < maxTries; i++) {
      //console.log(`⏳ Checking status... (${i + 1}/${maxTries})`);
      const res = await axios.get(
        `https://api.starryai.com/creations/${creationId}`,
        {
          headers: { "X-API-Key": API_KEY },
        }
      );

      const status = res.data.status;
      const images = res.data.images;

      if (status === "completed" && images?.[0]?.url) {
        imageUrl = images[0].url;
        console.log("🎉 Image ready:", imageUrl);
        return imageUrl;
      }

      if (status === "failed") {
        throw new Error("❌ Image generation failed.");
      }

      // Chờ 5 giây rồi thử lại
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    throw new Error("❌ Image was not ready after waiting.");
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    return null;
  }
}
