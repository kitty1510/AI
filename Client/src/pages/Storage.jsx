import { useEffect, useState } from "react";
import { fetchListVideo } from "../apis/index";

const Storage = () => {
  const userId = localStorage.getItem("user_id");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ Không tìm thấy userId trong localStorage.");
      setLoading(false);
      return;
    }

    const fetchVideos = async () => {
      try {
        const data = await fetchListVideo(userId);
        setVideos(data.videos);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách video:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [userId]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Kho video</h2>

      {loading ? (
        <p className="text-gray-400">Đang tải video...</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-400">Bạn chưa có video nào.</p>
      ) : (
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition max-w-full"
            >
              <div className="relative w-full pt-[56.25%]">
                <video
                  src={video.videoUrl}
                  controls
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="font-semibold text-base truncate">
                  {video.title || "Video không tiêu đề"}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Storage;
