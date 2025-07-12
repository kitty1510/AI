import {
  createVideoFromImageAndAudio,
  concatVideos,
} from "../services/create-video.js";
import { uploadVideoToCloudinary } from "../services/upload_cloud.js";
import fs from "fs/promises";

import Video from "../models/Video.js"; // Assuming you have a Video model for MongoDB

export async function generateVideo(req, res) {
  try {
    const script = req.body;
    console.log(script);

    if (!script || !Array.isArray(script) || script.length === 0) {
      return res.status(400).json({
        error: "Script is required and must be a non-empty array.",
      });
    }

    // 1. Tạo video cho từng scene
    const videoPaths = [];
    for (const scene of script) {
      const { img, voice } = scene;

      if (!img || !voice) {
        return res.status(400).json({
          error: "Each scene must have 'img' and 'voice' fields.",
        });
      }

      console.log("🎬 Creating video for scene:", img);
      const videoPath = await createVideoFromImageAndAudio(img, voice);
      videoPaths.push(videoPath);
    }

    // 2. Ghép các video thành một video duy nhất
    const finalVideoPath = await concatVideos(videoPaths);

    // delete videoPaths;
    for (const path of videoPaths) {
      await fs.unlink(path).catch(() => {}); // bỏ qua lỗi nếu đã xóa
    }

    // 3. Upload lên Cloudinary
    const uploadedVideoUrl = await uploadVideoToCloudinary(finalVideoPath);

    // 4. Xoá video tạm
    await fs.unlink(finalVideoPath);
    for (const path of videoPaths) {
      await fs.unlink(path).catch(() => {}); // bỏ qua lỗi nếu đã xóa trước
    }

    if (!uploadedVideoUrl) {
      return res.status(500).json({
        error: "Failed to upload video to Cloudinary.",
      });
    }

    console.log("✅ Video uploaded successfully:", uploadedVideoUrl);
    res.status(200).json({
      message: "Video created successfully.",
      videoUrl: uploadedVideoUrl,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo video:", error);
    res.status(500).json({
      error: "Failed to generate video.",
    });
  }
}

export async function storageVideo(req, res) {
  try {
    const { title, description, videoId, userId, videoUrl } = req.body;

    // Kiểm tra đầu vào
    if (!videoUrl || !userId) {
      return res.status(400).json({
        error: "Video URL and user ID are required.",
      });
    }

    // Tạo mới video trong database
    const newVideo = new Video({
      title: title || "",
      description: description || "",
      videoId: videoId || null, // videoId có thể là null nếu không có
      userId,
      videoUrl, // URL của video đã upload lên Cloudinary
    });

    await newVideo.save();

    res.status(201).json({
      success: true,
      message: "Video stored successfully.",
      video: newVideo,
    });
  } catch (error) {
    console.error("Storage error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
}

export async function listVideos(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required.",
      });
    }

    // Lấy danh sách video của người dùng
    const videos = await Video.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
}
