import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const fetchScript = async (prompt) => {
  console.log(prompt);
  const response = await axios.post(`${API_BASE_URL}/script`, prompt);
  console.log(response.data);
  return response.data;
};

export const fetchImg = async (prompt) => {
  const response = await axios.post(`${API_BASE_URL}/img`, prompt);
  console.log(response.data);
  return response.data;
};

export const fetchVoice = async (voiceInput) => {
  const response = await axios.post(`${API_BASE_URL}/voice`, voiceInput);
  //console.log(response.data);
  return response.data;
};
