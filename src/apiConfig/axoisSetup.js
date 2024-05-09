import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from './config';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    "Accept": "application/json",
    Authorization: `Bearer ${Cookies.get("access_token") || ""}`,
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token") || "";
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
