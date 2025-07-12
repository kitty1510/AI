import { useState, useEffect } from "react";

const SceneEdit = ({ scene, onClose, onSave }) => {
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (scene) {
      setDescription(scene.description || "");
      setContent(scene.content || "");
    }
  }, [scene]);

  if (!scene) return null;

  const handleSave = () => {
    const updatedScene = {
      ...scene,
      description,
      content,
    };
    onSave(updatedScene); // 👈 gửi scene đã chỉnh sửa
  };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded z-50 w-[400px] p-6 mt-10 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 text-center uppercase tracking-wide">
        {scene.title}
      </h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Nội dung
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          Đóng
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default SceneEdit;
