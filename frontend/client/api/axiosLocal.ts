
import axios from "axios";
// API endpoints
export const SOCKET_URL = "http://localhost:5000";
export const MESSAGES_API = "/messages";
export const UNIQUE_ENTREPRENEURS_API = "/unique-entrepreneurs";
export const UNIQUE_DEVELOPERS_API = "/unique-developers";

const axiosLocal = axios.create({
  baseURL: "http://localhost:5000", // your local backend
  timeout: 10000, // optional, 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosLocal;
