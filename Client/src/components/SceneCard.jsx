import { useRef, useState } from "react";
import { fetchImg } from "../apis"; // 👉 Import đúng hàm

const SceneCard = ({ scene, onClick }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const [imgInput, setImgInput] = useState({
    prompt: scene.description || scene.title || "A fantasy scene",
    model: "anime", // 👉 Chuỗi hợp lệ
    aspectRatio: "landscape",
  });

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      scene.img = imageUrl; // Cập nhật ảnh vào scene
      console.log(scene);
      setGeneratedImage(null); // reset ảnh AI nếu người dùng upload ảnh mới
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    setGeneratedImage(null);
    try {
      const imageUrl = await fetchImg(imgInput);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
        scene.img = imageUrl; // Cập nhật ảnh vào scene
        console.log(scene);
      }
    } catch (err) {
      console.error("Lỗi tạo ảnh:", err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition">
      <div className="flex flex-col md:flex-row">
        {/* Nội dung bên trái */}
        <div
          className="md:w-1/2 p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => onClick?.(scene)}
        >
          <h3 className="text-xl font-bold text-gray-800">{scene.title}</h3>
          <p className="text-gray-500 italic">{scene.summary}</p>
          <p className="text-sm text-gray-700 mt-2 line-clamp-4">
            {scene.content}
          </p>
        </div>

        {/* Phần hình ảnh bên phải */}
        <div className="md:w-1/2 p-4 bg-gray-100 flex flex-col items-center gap-3">
          <div
            className="w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
            onClick={handleImageClick}
          >
            {uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Ảnh đã chọn"
                className="max-w-full max-h-full object-contain"
              />
            ) : generatedImage ? (
              <img
                src={generatedImage}
                alt="Ảnh AI"
                className="max-w-full max-h-full object-contain"
              />
            ) : loading ? (
              <span className="text-gray-500 animate-pulse">
                ⏳ Đang tạo ảnh...
              </span>
            ) : (
              <span className="text-gray-500">
                📷 Nhấn để chọn ảnh hoặc tạo ảnh AI
              </span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2">
              <select
                value={imgInput.aspectRatio}
                onChange={(e) =>
                  setImgInput({ ...imgInput, aspectRatio: e.target.value })
                }
                className="flex-1 p-2 rounded border border-gray-300 text-sm"
              >
                <option value="landscape">Landscape</option>
                <option value="square">Square</option>
                <option value="portrait">Portrait</option>
                <option value="smallPortrait">Small Portrait</option>
              </select>

              <select
                value={imgInput.model}
                onChange={(e) =>
                  setImgInput({ ...imgInput, model: e.target.value })
                }
                className="flex-1 p-2 rounded border border-gray-300 text-sm"
              >
                <option value="anime">Anime</option>
                <option value="pixelart">Pixel Art</option>
                <option value="fantasy">Fantasy</option>
                <option value="photography">Photography</option>
                <option value="cinematic">Cinematic</option>
              </select>
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={loading}
              className={`w-full py-2 text-white rounded text-sm font-medium transition ${
                loading
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-slate-400 hover:bg-slate-600"
              }`}
            >
              {loading ? "Đang tạo ảnh..." : "🎨 Tạo ảnh AI"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;
