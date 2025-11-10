import axiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";

export const handleLogoutAPI = async () => {
  // TH1: Dùng localStorage => xóa thông tin trong localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // TH2: Dùng Http only cookie => Gọi API xử lý remove cookie
  return await axiosInstance.delete(`${API_ROOT}/v1/users/logout`);
};

export const refreshTokenAPI = async (refreshToken: string) => {
  return await axiosInstance.put(`${API_ROOT}/v1/users/refresh_token`, {
    refreshToken,
  });
};
