import express from "express";
import cors from "cors";
import routeIndex from "./index.js"; // Đảm bảo path đúng với vị trí thật

import connectDB from "./config/db.js"; // Nếu bạn có file connectDB
import { constant } from "./config/env.js";

// Hoặc bạn có thể define trực tiếp connectDB ở đây

const app = express();

// Constants
const PORT = constant.PORT || 3000;

// Middleware xử lý body
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Nếu cần xử lý form

// CORS middleware
app.use(
  cors({
    origin: constant.CORS_ORIGIN || "*", // Thay đổi theo nhu cầu của bạn
    credentials: true, // Nếu bạn cần gửi cookie hoặc thông tin xác thực
  })
);

// API routes
app.use("/api", routeIndex);

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  const error = ENVIRONMENT === "development" ? err : {};
  const status = err.status || 500;

  // Log lỗi trên server
  console.error("❌ Error:", err);

  // Trả phản hồi cho client
  res.status(status).json({
    error: {
      message: error.message || "Internal Server Error",
    },
  });
});

// Khởi động server sau khi kết nối DB
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  try {
    await connectDB();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
});
