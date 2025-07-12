import mongoose from "mongoose";

import { constant } from "./env.js"; // Đảm bảo đường dẫn đúng với file env.js

const MONGO_URI = constant.MONGO_URI || "mongodb://localhost:27017/mydatabase"; // Thay đổi tên database nếu cần

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Dừng app nếu kết nối thất bại
  }
};

export default connectDB;
