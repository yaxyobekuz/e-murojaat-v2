// Axios
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // required so the refresh httpOnly cookie is sent
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  // Drop empty query params so optional (enum) filters don't fail backend validation
  if (config.params && typeof config.params === "object") {
    config.params = Object.fromEntries(
      Object.entries(config.params).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined,
      ),
    );
  }
  return config;
});

export default http;
