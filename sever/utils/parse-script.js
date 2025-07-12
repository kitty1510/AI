export const parseScript = (data) => {
  // Nếu đầu vào là string, parse sang object
  const scenes = typeof data === "string" ? JSON.parse(data) : data;

  return scenes.map((sceneObj, index) => ({
    id: index + 1,
    title: sceneObj.scene || `Scene ${index + 1}`,
    content: sceneObj["scene content"] || "",
    summary: sceneObj.summary || "",
    description: sceneObj.scene_description || "",
  }));
};
