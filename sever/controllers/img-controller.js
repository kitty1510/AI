import { getImg } from "../services/generate-img.js";

export async function generateImg(req, res) {
  try {
    const imgInput = req.body; // Lấy dữ liệu từ body của request
    console.log("Received imgInput:", imgInput);
    if (
      !imgInput ||
      !imgInput.prompt ||
      !imgInput.model ||
      !imgInput.aspectRatio
    ) {
      return res.status(400).json({
        error: "Prompt, model, and aspect ratio are required.",
      });
    }
    const img = await getImg(imgInput);
    res.status(200).json(img);
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate script.",
    });
  }
}
