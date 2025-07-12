import express from "express";
import {
  uploadVideo,
  getAllVideoStats,
} from "../controllers/youtube-controller.js";

const youtubeRoute = express.Router();

youtubeRoute.post("/upload", uploadVideo);
youtubeRoute.post("/stats", getAllVideoStats);

export default youtubeRoute;
