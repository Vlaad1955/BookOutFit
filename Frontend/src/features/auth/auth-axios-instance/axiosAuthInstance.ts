import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("API URL is not defined in environment variables");
}

const axiosAuthInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export default axiosAuthInstance;