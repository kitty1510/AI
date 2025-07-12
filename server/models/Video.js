import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  videoId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  videoUrl: { type: String, required: true }, // URL of the video file
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Video", videoSchema);
