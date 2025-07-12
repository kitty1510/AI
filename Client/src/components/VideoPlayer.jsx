import { FaYoutube } from "react-icons/fa";
import { FiArchive } from "react-icons/fi";
import { FaDownload } from "react-icons/fa6";
import { uploadVideo, storageVideo } from "../apis/upload";
import { useState, useEffect } from "react";

const VideoPlayer = ({ src, userId }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [actionType, setActionType] = useState(""); // "upload" or "save"
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!message) return;

    let index = 0;
    setDisplayedText(""); // Reset trước mỗi lần typing

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + message[index]);
      index++;

      if (index >= message.length) {
        clearInterval(interval);
      }
    }, 30); // tốc độ gõ từng ký tự

    return () => clearInterval(interval);
  }, [message]);

  if (!src) {
    return (
      <div className="flex justify-center items-center h-64 text-sky-100 text-lg font-light">
        <p>Không có video nào để phát.</p>
      </div>
    );
  }

  const openForm = (type) => {
    setActionType(type);
    setShowForm(true);
    setMessage("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(
      actionType === "upload"
        ? "Uploading to YouTube..."
        : "Saving to storage..."
    );

    try {
      if (actionType === "upload") {
        const access_token = localStorage.getItem("access_token");
        const res = await uploadVideo({
          access_token,
          userId,
          title,
          description,
          filePath: src, // nếu dùng Cloudinary URL
          userId,
        });
        // console.log("Upload response:", res);
        setMessage(`✅ Uploaded! VideoID: ${res.videoId}`);
      } else {
        await storageVideo({
          userId,
          videoUrl: src,
          title,
          description,
        });
        setMessage("✅ Saved to storage!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
      setShowForm(false);
      setTitle("");
      setDescription("");
    }
  };

  const handleDownload = () => {
    const downloadUrl = src.includes("cloudinary")
      ? src.replace(/\/upload\//, "/upload/fl_attachment/")
      : src;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start gap-30 px-6 py-10 w-full max-w-7xl mx-auto">
      {/* Video */}
      <div className="w-full lg:w-3/4">
        <video
          src={src}
          controls
          className="w-full rounded-sm shadow-2xl border border-gray-500"
        />
      </div>

      {/* Actions */}
      <div className="w-full lg:w-1/4 flex flex-col gap-15 mt-10 lg:mt-0">
        <button
          onClick={() => openForm("upload")}
          disabled={loading}
          className="flex items-center justify-center h-15 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-xl text-base shadow-md transition"
        >
          <FaYoutube className="mr-2 text-2xl" />
          Upload to YouTube
        </button>

        <button
          onClick={() => openForm("save")}
          disabled={loading}
          className="flex items-center justify-center h-15 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-xl text-base shadow-md transition"
        >
          <FiArchive className="mr-2 text-xl" />
          Save to Storage
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center h-15 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-xl text-base shadow-md transition"
        >
          <FaDownload className="mr-2 text-xl" />
          Download
        </button>

        {message && (
          <p className="text-sky-100 mt-4 text-sm whitespace-pre-wrap">
            {displayedText}
            <span className="animate-pulse">|</span> {/* Con trỏ nhấp nháy */}
          </p>
        )}
      </div>

      {/* Form nhập Title & Description */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">
              {actionType === "upload"
                ? "Thông tin Upload YouTube"
                : "Lưu trữ video"}
            </h3>
            <input
              type="text"
              placeholder="Tiêu đề video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
            <textarea
              placeholder="Mô tả video"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-gray-800 text-white border border-gray-600"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white"
              >
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
