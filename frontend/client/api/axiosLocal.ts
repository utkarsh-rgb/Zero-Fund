
import axios from "axios";

// Determine the API base URL based on environment
const getBaseURL = () => {
  // Check if we're in production
  if (import.meta.env.PROD) {
    return "https://bd.zerofundventure.com";
  }
  // Development environment
  return import.meta.env.VITE_API_URL || "http://localhost:5000";
};

const BASE_URL = getBaseURL();

// API endpoints
export const SOCKET_URL = BASE_URL;
export const MESSAGES_API = "/messages";
export const UNIQUE_ENTREPRENEURS_API = "/unique-entrepreneurs";
export const UNIQUE_DEVELOPERS_API = "/unique-developers";

const axiosLocal = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosLocal;
