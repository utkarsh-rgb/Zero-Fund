
import axios from "axios";

// API endpoints
export const SOCKET_URL = "https://51.21.211.14/api"; // updated to HTTPS
export const MESSAGES_API = "/messages";
export const UNIQUE_ENTREPRENEURS_API = "/unique-entrepreneurs";
export const UNIQUE_DEVELOPERS_API = "/unique-developers";

const axiosLocal = axios.create({
  baseURL: "https://51.21.211.14/api", // updated to HTTPS
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosLocal;
