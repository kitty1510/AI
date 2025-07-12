// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Chỉ có nếu đăng ký bằng email/password
  googleId: { type: String }, // Chỉ có nếu đăng nhập bằng Google
  name: String,
  avatar: String,
});

export default mongoose.model("User", userSchema);
