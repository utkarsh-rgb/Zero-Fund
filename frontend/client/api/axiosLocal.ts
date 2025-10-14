
import axios from "axios";
// API endpoints
export const SOCKET_URL = "http://51.21.211.14/api";
export const MESSAGES_API = "/messages";
export const UNIQUE_ENTREPRENEURS_API = "/unique-entrepreneurs";
export const UNIQUE_DEVELOPERS_API = "/unique-developers";

const axiosLocal = axios.create({
  baseURL: "http://51.21.211.14/api", // your local backend
  timeout: 10000, // optional, 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosLocal;
