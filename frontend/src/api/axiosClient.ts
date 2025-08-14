// src/services/axiosClient.ts
import axios from "axios";
import type { AxiosInstance } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "https://tu-api.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
