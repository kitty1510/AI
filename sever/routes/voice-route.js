import express from "express";
import { generateVoice } from "../controllers/voice-controller.js";

const voiceRoute = express.Router();

// Định nghĩa route cho việc tạo giọng nói
voiceRoute.post("/", generateVoice);

// Export route
export default voiceRoute;
