import { useRef, useState, useEffect } from "react";

import GenScriptBox from "../components/GenScriptBox";
import { fetchScript, fetchVoice } from "../apis";
import SceneCard from "../components/SceneCard";
import SceneEdit from "../components/SceneEdit";
import VideoPlayer from "../components/VideoPlayer";
//import { generateSceneVideo } from "../sevices/video-create";

const Home = () => {
  const bottomRef = useRef(false);

  const handleScroll = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log(InputPromt);
  };

  const handleEditScene = (scene) => {
    console.log("Scene được chọn:", scene);
    setEditingScene(scene);
  };

  const handleSaveScene = (updatedScene) => {
    const updatedScript = script.map((scene) =>
      scene.id === updatedScene.id ? updatedScene : scene
    );
    setScript(updatedScript);
    console.log("Cập nhật kịch bản:", updatedScript);
    setEditingScene(null);
  };

  const handleCreateVideo = async () => {
    console.log("🔴 handleCreateVideo được gọi");

    if (!script || script.length === 0) {
      console.error("Không có kịch bản để tạo video.");
      return;
    }

    const allHaveImages = script.every((scene) => scene.img);
    if (!allHaveImages) {
      console.error("Một hoặc nhiều scene không có ảnh. Không thể tạo video.");
      return;
    }

    try {
      const scenesWithVoice = await Promise.all(
        script.map(async (scene) => {
          console.log("🎤 Đang tạo voice cho:", scene.content);
          const voiceUrl = await fetchVoice({
            text: scene.content,
            voice: selectedVoice,
          });
          console.log("✅ Voice url:", voiceUrl);
          return { ...scene, voice: voiceUrl };
        })
      );

      const videoUrls = await Promise.all(
        scenesWithVoice.map((scene) => generateSceneVideo(scene))
      );

      console.log("🎬 Video URLs:", videoUrls);
    } catch (error) {
      console.error("Lỗi khi tạo video:", error);
    }
  };

  const [InputPromt, setInputPromt] = useState({
    title: "",
    genre: "",
    type: "",
  });

  const [editingScene, setEditingScene] = useState(null);

  const [script, setScript] = useState(null);

  const [loading, setLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("banmai");

  const handleFetchScript = async () => {
    try {
      setLoading(true); // 🔄 Bắt đầu loading
      const response = await fetchScript(InputPromt);
      setScript(response);
      console.log("Script fetched successfully:", response);
    } catch (error) {
      console.error("Error fetching script:", error);
    } finally {
      setLoading(false); // ✅ Kết thúc loading
    }
  };

  return (
    <div className="h-full rounded-sm border-2 shadow-2 border-blue bg-gray-800 opacity-80">
      {/* Phần chia 2 bên */}
      <div className="flex gap-3 px-3 h-96">
        <div className="bg-slate-600 w-1/2 p-4  rounded-lg">
          <GenScriptBox
            prompt={InputPromt}
            setPrompt={setInputPromt}
            getScript={handleFetchScript}
            loading={loading} // 👈 truyền prop mới
          />
        </div>
        <div className="bg-slate-700 w-1/2 p-4 rounded-lg overflow-y-auto">
          {!script && (
            <div className="text-center text-gray-400">
              <p className="text-lg font-semibold mb-2">
                Không có kịch bản nào được tạo.
              </p>
            </div>
          )}
          {script && Array.isArray(script) && (
            <div className="grid gap-4">
              {script.map((scene) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  onClick={handleEditScene}
                  onSave={handleSaveScene} // 👈 thêm prop này
                />
              ))}
            </div>
          )}
          {script && (
            <div className="mt-6 p-4 bg-slate-800 rounded-lg shadow-sm">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  🎙️ Chọn giọng đọc
                </label>
                <div className="flex gap-2 mt-4">
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="flex-1 p-2 rounded bg-slate-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="banmai">Nữ - Miền Bắc</option>
                    <option value="lannhi">Nữ - Miền Nam</option>
                    <option value="leminh">Nam - Miền Bắc</option>
                    <option value="myan">Nữ - Miền Trung</option>
                    <option value="giahuy">Nam - Miền Trung</option>
                  </select>

                  <button
                    onClick={() => {
                      const audioUrl = `./sounds/${selectedVoice}.mp3 `;
                      console.log("Đang phát:", audioUrl);
                      const audio = new Audio(audioUrl);
                      audio.play().catch(() => {
                        // fallback nếu không có file
                        const utterance = new SpeechSynthesisUtterance(
                          "Xin chào! Đây là giọng đọc mẫu."
                        );
                        utterance.lang = "vi-VN";
                        window.speechSynthesis.speak(utterance);
                      });
                    }}
                    className="px-3 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 transition text-sm"
                  >
                    🔊 Nghe thử
                  </button>
                </div>
              </div>

              <button
                onClick={handleCreateVideo}
                className="w-full py-2 bg-slate-500 hover:bg-slate-400 text-white font-semibold rounded transition"
              >
                🎬 Tạo Video
              </button>
            </div>
          )}
        </div>
      </div>
      <SceneEdit
        scene={editingScene}
        onClose={() => setEditingScene(null)}
        onSave={handleSaveScene} // 👈 thêm dòng này
      />

      {/* Phần dưới */}
      <div
        ref={bottomRef}
        className="mt-10 bg-gray-700 p-2 text-white rounded-lg mx-3 h-96"
      ></div>
    </div>
  );
};

export default Home;
