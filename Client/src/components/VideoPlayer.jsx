import { useState } from "react";

const voices = [
  { label: "Nữ miền Bắc", value: "https://.../voice-nu-mien-bac.mp3" },
  { label: "Nam miền Nam", value: "https://.../voice-nam-mien-nam.mp3" },
  { label: "Nữ miền Trung", value: "https://.../voice-nu-mien-trung.mp3" },
];

const VideoPlayer = () => {
  const [voice, setVoice] = useState("");

  return (
    <div className="flex items-center gap-3">
      <select
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
        className="p-1 border rounded text-sm"
      >
        <option value="">Chọn giọng đọc</option>
        {voices.map((v) => (
          <option key={v.value} value={v.value}>
            {v.label}
          </option>
        ))}
      </select>

      {voice && <audio src={voice} controls />}
    </div>
  );
};

export default VideoPlayer;
