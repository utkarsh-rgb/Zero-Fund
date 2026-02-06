
import axios from "axios";

// Determine the API base URL based on environment
const getBaseURL = () => {
  // Always prioritize the environment variable if set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback to production URL if in production mode
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_PROD_API_URL || "https://bd.zerofundventure.com";
  }

  // Development environment fallback
  return "http://localhost:5000";
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
  withCredentials:true,
});

export default axiosLocal;
