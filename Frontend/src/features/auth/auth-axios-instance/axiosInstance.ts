import axios from "axios";
import { useAuthStore } from "../auth-store/useAuthStore";
import { tokenStorage } from "@/shared/token/UseTokenStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getApiBaseUrl() {
    if (typeof window === "undefined") {
        return API_URL;
    } else {
        return "/api";
    }
}

if (!API_URL) {
  throw new Error("API URL is not defined in environment variables");
}

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const { token } = useAuthStore.getState();
    const tokenToUse = token || tokenStorage.getToken();

    if (tokenToUse) {
      config.headers.Authorization = `Bearer ${tokenToUse}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { isLoggingOut } = useAuthStore.getState();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoggingOut
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axiosInstance.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );

        if (data.accessToken) {
          useAuthStore.getState().setToken(data.accessToken);

          tokenStorage.setToken(data.accessToken);

          axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Помилка оновлення токена:", refreshError);
        useAuthStore.getState().setToken(null);
        if (useAuthStore.getState().logout) {
          await useAuthStore.getState().logout();
        }

        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
