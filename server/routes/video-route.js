import express from "express";
import {
  generateVideo,
  storageVideo,
  listVideos,
} from "../controllers/video-controller.js";

const videoRoute = express.Router();

// Định nghĩa route cho việc tạo video
videoRoute.post("/", generateVideo);

videoRoute.post("/storage", storageVideo);
// Định nghĩa route cho việc lấy danh sách video của người dùng

videoRoute.get("/list/:userId", listVideos);

// Export route
export default videoRoute;
