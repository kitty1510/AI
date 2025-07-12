import { google } from "googleapis";
import fs from "fs";

import path from "path";
import axios from "axios";
const downloadFileFromUrl = async (url, outputPath) => {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios.get(url, { responseType: "stream" });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

export const uploadVideo = async (req, res) => {
  try {
    const { access_token, userId, title, description, filePath } = req.body;

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    const tempFilePath = path.join("temp", "video.mp4");

    // 🠖 Tải từ Cloudinary về local
    await downloadFileFromUrl(filePath, tempFilePath);

    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: { title, description },
        status: { privacyStatus: "public" },
      },
      media: {
        body: fs.createReadStream(tempFilePath),
      },
    });

    // 🧹 Xoá file tạm sau khi upload xong
    fs.unlinkSync(tempFilePath);

    res.json({ success: true, videoId: response.data.id });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllVideoStats = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ error: "Thiếu access_token" });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    let allVideos = [];
    let nextPageToken = "";

    // Lấy video từ kênh người dùng
    do {
      const response = await youtube.search.list({
        part: "snippet",
        forMine: true,
        type: "video",
        maxResults: 10,
        pageToken: nextPageToken,
      });

      const videoIds = response.data.items.map((item) => item.id.videoId);

      const statsResponse = await youtube.videos.list({
        part: "statistics,snippet",
        id: videoIds.join(","),
      });

      const stats = statsResponse.data.items.map((item) => ({
        videoId: item.id,
        title: item.snippet.title,
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount,
        commentCount: item.statistics.commentCount,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.default.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        description: item.snippet.description,
        videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
        duration: item.contentDetails?.duration,
      }));

      allVideos.push(...stats);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    res.json(allVideos);
  } catch (err) {
    console.error("Lỗi lấy toàn bộ video:", err.message);
    res.status(500).json({ error: "Không thể lấy danh sách video." });
  }
};
