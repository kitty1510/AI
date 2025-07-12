import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { parseFile } from "music-metadata";
import fs from "fs";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath);

async function getDuration(filePath) {
  try {
    console.log("Đang lấy metadata cho file:", filePath);
    const metadata = await parseFile(filePath);
    return metadata.format.duration;
  } catch (error) {
    console.error("Lỗi khi lấy metadata:", error);
    return null;
  }
}

import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { parseFile } from "music-metadata";
import fs from "fs";
import path from "path";
import axios from "axios";

ffmpeg.setFfmpegPath(ffmpegPath);

async function getAudioDuration(filePath) {
  try {
    const metadata = await parseFile(filePath);
    return metadata.format.duration;
  } catch (error) {
    console.error("Lỗi khi lấy metadata audio:", error);
    return null;
  }
}

async function downloadImage(url, filePath) {
  const response = await axios.get(url, { responseType: "stream" });
  const writer = fs.createWriteStream(filePath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

export async function createSceneVideo(scene) {
  const tempDir = "./temp";
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Tạo file text tạm
  const textFilePath = path.join(tempDir, `text-${scene.id}.txt`);
  fs.writeFileSync(textFilePath, scene.content, { encoding: "utf8" });

  // Tải ảnh về local nếu là URL
  let imagePath = scene.img;
  if (scene.img.startsWith("http")) {
    imagePath = path.join(tempDir, `image-${scene.id}.png`);
    await downloadImage(scene.img, imagePath);
  }

  try {
    const voiceDur = await getAudioDuration(scene.voice);
    if (!voiceDur) throw new Error("Không thể lấy thời lượng audio");

    const outputPath = `./assets/video-${scene.id}.mp4`;

    return new Promise((resolve, reject) => {
      const command = ffmpeg()
        // Input hình ảnh
        .input(imagePath)
        .inputOptions(["-loop 1", `-t ${voiceDur}`])

        // Input audio
        .input(scene.voice)

        // Thiết lập video
        .videoCodec("libx264")
        .outputOptions(["-pix_fmt yuv420p", "-shortest", "-r 30"])

        // Xử lý video
        .videoFilters([
          {
            filter: "scale",
            options: {
              width: 1280,
              height: 720,
              force_original_aspect_ratio: "decrease",
            },
          },
          {
            filter: "drawtext",
            options: {
              fontfile: path.join(__dirname, "../fonts/arial.ttf"),
              textfile: textFilePath,
              fontsize: 24,
              fontcolor: "white",
              box: 1,
              boxcolor: "black@0.5",
              boxborderw: 5,
              x: "(w-text_w)/2",
              y: "h-text_h-50", // Đặt text ở phía dưới
              reload: 1,
            },
          },
        ])

        .on("start", (commandLine) => {
          console.log("Đang chạy lệnh: " + commandLine);
        })
        .save(outputPath)
        .on("end", () => {
          // Dọn dẹp file tạm
          fs.unlinkSync(textFilePath);
          if (imagePath !== scene.img) fs.unlinkSync(imagePath);
          console.log("✅ Video đã tạo thành công!");
          resolve(outputPath);
        })
        .on("error", (err) => {
          // Dọn dẹp file tạm khi có lỗi
          fs.unlinkSync(textFilePath);
          if (imagePath !== scene.img) fs.unlinkSync(imagePath);
          console.error("❌ Lỗi khi tạo video:", err.message);
          reject(new Error(`Tạo video thất bại: ${err.message}`));
        });
    });
  } catch (err) {
    // Dọn dẹp file tạm khi có lỗi
    fs.unlinkSync(textFilePath);
    if (imagePath !== scene.img) fs.unlinkSync(imagePath);
    throw err;
  }
}

createSceneVideo({
  id: 1,
  img: "https://file01.fpt.ai/text2speech-v5/short/2025-07-07/e0779473fb23b48c5dc8d5c9a3c5e365.mp3",
  voice:
    "https://tmp.starryai.com/api/137419/8abe4395-c92c-4d63-b287-dcc728dc587d.png",
  content: "This is a sample text for the video.",
});
