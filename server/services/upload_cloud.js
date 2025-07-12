import cloudinary from "../config/cloundinary.js";

export async function uploadVideoToCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video", // Bắt buộc nếu là file mp4
      folder: "generated_videos", // Optional: thư mục lưu trữ
    });

    console.log("✅ Upload thành công:", result.secure_url);
    return result.secure_url;
  } catch (err) {
    console.error("❌ Lỗi khi upload lên Cloudinary:", err.message);
    throw err;
  }
}
