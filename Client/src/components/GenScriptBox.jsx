import { FaPhotoVideo, FaMagic } from "react-icons/fa";
import { useState } from "react";
import { fetchMultipleWikiSummaries } from "../apis/wiki"; // Bạn cần tạo file này nếu chưa có

const GenScriptBox = ({ prompt, setPrompt, getScript, loading }) => {
  const [wikiResults, setWikiResults] = useState([]);
  const [wikiLoading, setWikiLoading] = useState(false);

  const handleChangePromt = (e) => {
    const { name, value } = e.target;
    setPrompt((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetWikiSuggestions = async () => {
    setWikiLoading(true);
    try {
      const data = await fetchMultipleWikiSummaries(prompt.title, 5);
      setWikiResults(data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy gợi ý Wikipedia:", err);
    } finally {
      setWikiLoading(false);
    }
  };

  const handleSelectSuggestion = (extract) => {
    setPrompt((prev) => ({
      ...prev,
      title: extract,
    }));
    setWikiResults([]); // Ẩn danh sách sau khi chọn
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-center">
        <div className="font-bold text-white">Trình tạo kịch bản</div>
        <FaPhotoVideo className="inline-block text-2xl text-sky-50" />
      </div>

      <textarea
        name="title"
        value={prompt.title}
        onChange={handleChangePromt}
        className="w-full h-32 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 ring-indigo-500"
        placeholder="Nhập tiêu đề hoặc ý tưởng..."
      />

      <button
        onClick={handleGetWikiSuggestions}
        disabled={wikiLoading || !prompt.title}
        className="self-end px-4 py-1 text-sm bg-indigo-950 hover:bg-indigo-900 text-white rounded-md"
      >
        {wikiLoading ? "Đang tìm gợi ý..." : "📚 Gợi ý từ Wikipedia"}
      </button>

      {/* Button lấy gợi ý */}

      {/* Danh sách gợi ý */}
      {wikiResults.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-md p-3 space-y-2 text-sm text-white max-h-48 overflow-y-auto">
          {wikiResults.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectSuggestion(item.extract)}
              className="cursor-pointer hover:bg-gray-800 p-2 rounded transition"
            >
              <strong>{item.title}</strong>: {item.extract.slice(0, 150)}...
            </div>
          ))}
        </div>
      )}

      {/* Dropdowns */}
      <div className="flex flex-row gap-4 mt-2">
        <select
          name="genre"
          value={prompt.genre}
          onChange={handleChangePromt}
          className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 ring-indigo-500"
        >
          <option value="" disabled>
            Chọn thể loại
          </option>
          <option value="action">Hành động</option>
          <option value="comedy">Hài hước</option>
          <option value="drama">Kịch tính</option>
          <option value="fantasy">Giả tưởng</option>
          <option value="horror">Kinh dị</option>
          <option value="romance">Lãng mạn</option>
        </select>

        <select
          name="type"
          value={prompt.type}
          onChange={handleChangePromt}
          className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 ring-indigo-500"
        >
          <option value="" disabled>
            Chọn phong cách
          </option>
          <option value="anime">Anime</option>
          <option value="fiction">Viễn tưởng</option>
          <option value="realistic">Hiện thực</option>
          <option value="fairy tale">Cổ tích</option>
        </select>
      </div>

      {/* Nút Generate */}
      <button
        disabled={loading}
        className={`rounded-md border h-10 w-32 mt-4 self-center text-slate-300 flex items-center justify-center gap-2 transition ${
          loading
            ? "bg-slate-700 cursor-not-allowed animate-pulse"
            : "hover:bg-slate-700"
        }`}
        onClick={getScript}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span>Đang tạo...</span>
          </>
        ) : (
          <>
            <FaMagic />
            <span>Generate</span>
          </>
        )}
      </button>
    </div>
  );
};

export default GenScriptBox;
