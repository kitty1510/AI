import fs from "fs";
import path from "path";
import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import { parseFile } from "music-metadata";
import { tmpdir } from "os";

// Cấu hình đúng đường dẫn ffmpeg
ffmpeg.setFfmpegPath(
  "C:/Users/ADMIN-PRO/Downloads/ffmpeg-7.1.1-full_build/ffmpeg-7.1.1-full_build/bin/ffmpeg.exe"
);

// Tải file tạm
async function downloadFile(url, filename) {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
  });

  const writer = fs.createWriteStream(filename);

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", () => resolve(filename));
    writer.on("error", reject);
  });
}

// Lấy thời lượng audio
async function getDuration(filePath) {
  try {
    const metadata = await parseFile(filePath);
    return metadata.format.duration;
  } catch (error) {
    console.error("❌ Lỗi khi lấy metadata:", error);
    return null;
  }
}

// Tạo video
export async function createVideoFromImageAndAudio(
  imageUrl,
  audioUrl,
  outputPath
) {
  const tempAudioPath = path.join(tmpdir(), `temp-audio-${Date.now()}.mp3`);

  try {
    console.log("📥 Đang tải file audio...");
    await downloadFile(audioUrl, tempAudioPath);

    const duration = await getDuration(tempAudioPath);
    if (!duration) {
      throw new Error("Không lấy được thời lượng audio.");
    }

    console.log("🎬 Đang tạo video...");

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(imageUrl)
        .inputOptions(["-framerate 1"])
        .input(tempAudioPath)
        .videoFilters("scale=1280:720")
        .outputOptions(["-c:v libx264", "-pix_fmt yuv420p", `-t ${duration}`])
        .save(outputPath)
        .on("end", () => {
          console.log("✅ Video đã tạo thành công!");
          fs.unlink(tempAudioPath, () => {}); // Xoá file sau khi hoàn tất
          resolve();
        })
        .on("error", (err) => {
          console.error("❌ Lỗi khi tạo video:", err.message);
          // Nếu lỗi vẫn xoá file
          if (fs.existsSync(tempAudioPath)) {
            fs.unlink(tempAudioPath, () => {});
          }
          reject(err);
        });
    });
  } catch (error) {
    console.error("❌ Lỗi tổng:", error.message);
  }
}

createVideoFromImageAndAudio(
  "https://res.cloudinary.com/drv53xdea/image/upload/v1730898046/supergirl_rdjaex.jpg",
  "https://file01.fpt.ai/text2speech-v5/short/2025-07-12/35d451fc3d24a5b677fa6fde8e11afc7.mp3",
  "./assets/output-video.mp4"
);
