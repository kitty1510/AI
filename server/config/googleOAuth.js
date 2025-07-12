// googleOAuth.js
import { google } from "googleapis";
import { constant } from "./env.js";

// Khởi tạo OAuth2 client
export const oauth2Client = new google.auth.OAuth2(
  constant.CLIENT_ID,
  constant.CLIENT_SECRET,
  "http://localhost:80/auth/google/callback" // Redirect URI
);

// Các scope cần thiết
export const scopes = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
  "https://www.googleapis.com/auth/youtube.readonly",
];
