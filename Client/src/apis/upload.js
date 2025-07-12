import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const uploadVideo = async (videoInput) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/youtube/upload`,
      videoInput
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};

export const storageVideo = async (videoInput) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/video/storage`,
      videoInput
    );
    return response.data;
  } catch (error) {
    console.error("Error storing video:", error);
    throw error;
  }
};
