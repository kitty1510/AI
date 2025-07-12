import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { FiRefreshCw, FiAlertCircle, FiYoutube } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Statistic = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllStats = async () => {
    setRefreshing(true);
    setError("");

    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      setError("Không có access_token. Vui lòng đăng nhập lại.");
      setRefreshing(false);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost/api/youtube/stats", {
        access_token,
      });

      const formatted = res.data.map((video) => ({
        ...video,
        viewCount: Number(video.viewCount || 0),
        likeCount: Number(video.likeCount || 0),
        commentCount: Number(video.commentCount || 0),
        engagementRate:
          ((Number(video.likeCount || 0) + Number(video.commentCount || 0)) /
            Number(video.viewCount || 1)) *
          100,
      }));

      setVideos(formatted);
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi khi lấy danh sách video.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  const COLORS = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B"];
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <FiYoutube className="text-red-500 text-4xl mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-white">
              YouTube Video Analytics
            </h1>
            <p className="text-gray-400">Thống kê hiệu suất video của bạn</p>
          </div>
        </div>
        <button
          onClick={fetchAllStats}
          disabled={refreshing}
          className={`flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors ${
            refreshing ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {refreshing ? (
            <FiRefreshCw className="animate-spin mr-2" />
          ) : (
            <FiRefreshCw className="mr-2" />
          )}
          Làm mới dữ liệu
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-900/50 border border-red-700 flex items-start">
          <FiAlertCircle className="text-red-400 text-xl mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-200">Đã xảy ra lỗi</h3>
            <p className="text-red-100">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <Skeleton height={350} borderRadius="0.5rem" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height={150} borderRadius="0.5rem" />
            ))}
          </div>
        </div>
      ) : videos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Tổng quan hiệu suất
                </h2>
                <div className="flex space-x-2">
                  {["7D", "30D", "90D"].map((item) => (
                    <button
                      key={item}
                      className="px-3 py-1 text-xs rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={videos.slice(0, 10)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="title"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      tickFormatter={(value) =>
                        value.length > 20
                          ? `${value.substring(0, 20)}...`
                          : value
                      }
                    />
                    <YAxis
                      tick={{ fill: "#9CA3AF" }}
                      tickFormatter={formatNumber}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(value) => [formatNumber(value), ""]}
                    />
                    <Legend />
                    <Bar
                      dataKey="viewCount"
                      name="Lượt xem"
                      radius={[4, 4, 0, 0]}
                    >
                      {videos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[0]} />
                      ))}
                    </Bar>
                    <Bar
                      dataKey="likeCount"
                      name="Lượt thích"
                      radius={[4, 4, 0, 0]}
                    >
                      {videos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[1]} />
                      ))}
                    </Bar>
                    <Bar
                      dataKey="commentCount"
                      name="Bình luận"
                      radius={[4, 4, 0, 0]}
                    >
                      {videos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[2]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                Video hàng đầu
              </h2>
              {videos.slice(0, 3).map((video) => (
                <div key={video.videoId} className="mb-4 last:mb-0">
                  <div className="flex items-start">
                    <div className="relative flex-shrink-0 mr-3">
                      <img
                        src={
                          video.thumbnail ||
                          "https://via.placeholder.com/120x68"
                        }
                        alt={video.title}
                        className="w-20 h-12 rounded object-cover"
                      />
                      {/* <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        {Math.floor(video.duration / 60)}:
                        {(video.duration % 60).toString().padStart(2, "0")}
                      </span> */}
                    </div>
                    <div>
                      <h3 className="font-medium text-white line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <span className="flex items-center mr-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                          {formatNumber(video.viewCount)} views
                        </span>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          {formatNumber(video.likeCount)} likes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Tỷ lệ tương tác trung bình
                </h3>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{
                      width: `${
                        videos.reduce(
                          (acc, video) => acc + video.engagementRate,
                          0
                        ) / videos.length
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {(
                    videos.reduce(
                      (acc, video) => acc + video.engagementRate,
                      0
                    ) / videos.length
                  ).toFixed(2)}
                  %
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Tất cả video
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div
                  key={video.videoId}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded ml-2 whitespace-nowrap">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-blue-400">
                      {formatNumber(video.viewCount)} views
                    </span>
                    <span className="text-gray-400">
                      {video.engagementRate.toFixed(2)}% ER
                    </span>
                  </div>
                  <div className="flex space-x-4 text-sm">
                    <div className="flex items-center text-green-400">
                      <span className="mr-1">👍</span>
                      {formatNumber(video.likeCount)}
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <span className="mr-1">💬</span>
                      {formatNumber(video.commentCount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <FiYoutube className="text-red-500 text-4xl" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">
            Không tìm thấy video nào
          </h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Tài khoản của bạn hiện không có video hoặc chúng tôi không thể tải
            dữ liệu.
          </p>
          <button
            onClick={fetchAllStats}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
};

export default Statistic;
