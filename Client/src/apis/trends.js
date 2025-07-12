import axios from "axios";

export const getTrends = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`/api/trends?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trends:", error);
    throw error;
  }
};
