import dotenv from "dotenv";
dotenv.config();

export const constant = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URL || "mongodb://localhost:27017/yourdatabase",
  API_SCRIPT: process.env.API_KEY_SCRIPT || "https://api.example.com/script",
  API_IMG: process.env.API_KEY_IMG || "https://api.example.com/img",
  API_VOICE: process.env.API_KEY_VOICE || "https://api.example.com/voice",
  CLIENT_ID: process.env.CLIENT_ID || "your-client-id",
  CLIENT_SECRET: process.env.CLIENT_SECRET || "your-client-secret",
};
