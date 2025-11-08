import axios from "axios";
import { toast } from "react-toastify";
import { API_ROOT } from "~/utils/constants";

const axiosInstance = axios.create({
  baseURL: API_ROOT,
  timeout: 10 * 60 * 1000, // 10 min
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy accessToken trong localStorage
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // Gán vào request header
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API, ngoại trừ 410 - GONE
    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
