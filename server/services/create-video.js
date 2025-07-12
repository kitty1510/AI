import fs from "fs";
import path from "path";
import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import { parseFile } from "music-metadata";
import { tmpdir } from "os";
import { fileURLToPath } from "url";
// Cấu hình đúng đường dẫn ffmpeg
ffmpeg.setFfmpegPath(
  "C:/Users/ADMIN-PRO/Downloads/ffmpeg-7.1.1-full_build/ffmpeg-7.1.1-full_build/bin/ffmpeg.exe"
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "../assets");

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
export async function createVideoFromImageAndAudio(imageUrl, audioUrl) {
  const tempAudioPath = path.join(tmpdir(), `temp-audio-${Date.now()}.mp3`);
  const randomID = Math.random().toString(36).substring(2, 15);
  const outputPath = path.join(outputDir, `output-video-${randomID}.mp4`);

  try {
    console.log("📥 Đang tải file audio...");
    await downloadFile(audioUrl, tempAudioPath);

    const duration = await getDuration(tempAudioPath);
    if (!duration) throw new Error("Không lấy được thời lượng audio.");

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
          fs.unlink(tempAudioPath, () => {});
          resolve(outputPath); // ✅ Trả về path video đã tạo
        })
        .on("error", (err) => {
          console.error("❌ Lỗi khi tạo video:", err.message);
          if (fs.existsSync(tempAudioPath)) {
            fs.unlink(tempAudioPath, () => {});
          }
          reject(err);
        });
    });
  } catch (error) {
    console.error("❌ Lỗi tổng:", error.message);
    return null;
  }
}

export async function concatVideos(videoPaths, outputFileName = null) {
  if (!Array.isArray(videoPaths) || videoPaths.length === 0) {
    throw new Error("❌ Danh sách video không hợp lệ.");
  }

  const tempDir = tmpdir();
  const randomID = Math.random().toString(36).substring(2, 15);
  const outputPath =
    outputFileName || path.join(tempDir, `final-video-${randomID}.mp4`);

  // 1. Tạo file danh sách input cho FFmpeg
  const listFilePath = path.join(tempDir, `concat-list-${randomID}.txt`);
  const fileListContent = videoPaths
    .map((filePath) => `file '${filePath.replace(/\\/g, "/")}'`) // Escape path for FFmpeg
    .join("\n");

  fs.writeFileSync(listFilePath, fileListContent);

  console.log("📹 Đang nối các video lại...");

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(listFilePath)
      .inputOptions(["-f", "concat", "-safe", "0"])
      .outputOptions("-c copy") // copy codec để nối nhanh
      .on("end", () => {
        console.log("✅ Video đã được ghép thành công:", outputPath);
        // Xoá file tạm
        fs.unlink(listFilePath, () => {});
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("❌ Lỗi khi nối video:", err.message);
        reject(err);
      })
      .save(outputPath);
  });
}

// createVideoFromImageAndAudio(
//   "https://res.cloudinary.com/drv53xdea/image/upload/v1730898046/supergirl_rdjaex.jpg",
//   "https://file01.fpt.ai/text2speech-v5/short/2025-07-12/35d451fc3d24a5b677fa6fde8e11afc7.mp3",
//   "./assets/output-video.mp4"
// );
