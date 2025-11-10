import axios from "axios";
import { toast } from "react-toastify";
import { handleLogoutAPI, refreshTokenAPI } from "~/apis";
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

let refreshTokenPromise = null;

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    // Nếu status == 401: Unauthorized => logout
    if (error.response?.status === 401) {
      handleLogoutAPI().then(() => {
        // Dùng cookie -> xóa userInfo trong localStrorage
        localStorage.removeItem("userInfo");

        // Điều hướng đến trang login
        location.href = "/login";
      });
    }

    // Nếu status == 410: Gone => refresh token
    // Đầu tiên lấy các request API đang bị lỗi thông qua error.config
    const originalRequest = error.config;

    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("originalRequest", originalRequest);
      // Lấy refreshToken từ localStorage (TH dùng localStorage)
      const refreshToken = localStorage.getItem("refreshToken");

      // Gọi API refreshToken
      return refreshTokenAPI(refreshToken)
        .then((res) => {
          // Lấy và gán lại accessToken vào localStorage (TH dùng localStorage)
          const { accessToken } = res.data;
          localStorage.setItem("accessToken", accessToken);
          axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

          // TH dùng cookie thì accessToken đã được gán ở BE

          // Cuối cùng return axios instance và truyền originalRequest để gọi lại các api bị lỗi
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          // Nếu có lỗi từ API refresh token thì logout luôn
          handleLogoutAPI().then(() => {
            // Dùng cookie -> xóa userInfo trong localStrorage
            localStorage.removeItem("userInfo");

            // Điều hướng đến trang login
            location.href = "/login";
          });
          return Promise.reject(err);
        });
    }

    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API, ngoại trừ 410 - GONE
    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
