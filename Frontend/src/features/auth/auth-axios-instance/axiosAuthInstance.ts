import axios from "axios";

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

const axiosAuthInstance = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true,
});

export default axiosAuthInstance;