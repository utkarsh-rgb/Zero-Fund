
import axios from "axios";
export const SOCKET_URL = "http://localhost:5000";
export const API_URL = "http://localhost:5000/messages";
export const UNIQUE_ENTREPRENEURS_API = "http://localhost:5000/unique-entrepreneurs";

const axiosLocal = axios.create({
  baseURL: "http://localhost:5000", // your local backend
  timeout: 10000, // optional, 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosLocal;
