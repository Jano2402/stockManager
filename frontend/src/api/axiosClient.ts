// src/services/axiosClient.ts
import axios from "axios";
import type { AxiosInstance } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Interceptor para manejar el access y refresh token
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post("/auth/refresh", {}, { withCredentials: true });
        return axiosClient(originalRequest); // reintentar con nuevo access token
      } catch {
        window.location.href = "/auth/login"; // refresh falló → logout
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
