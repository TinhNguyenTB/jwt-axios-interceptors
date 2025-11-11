// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from "http-status-codes";
import ms from "ms";
import {
  ACCESS_TOKEN_SECRET_SIGNATURE,
  JwtProvider,
  REFRESH_TOKEN_SECRET_SIGNATURE,
} from "~/providers/JwtProvider";

/**
 * Mock nhanh thông tin user thay vì phải tạo Database rồi query.
 * Nếu muốn học kỹ và chuẩn chỉnh đầy đủ hơn thì xem Playlist này nhé:
 * https://www.youtube.com/playlist?list=PLP6tw4Zpj-RIMgUPYxhLBVCpaBs94D73V
 */

const MOCK_ROLES = {
  CLIENT: "client",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

const MOCK_DATABASE = {
  USER: {
    ID: "admin-sample-id-12345678",
    EMAIL: "admin@gmail.com",
    PASSWORD: "admin",
    ROLE: MOCK_ROLES.CLIENT,
  },
};

const login = async (req, res) => {
  try {
    if (
      req.body.email !== MOCK_DATABASE.USER.EMAIL ||
      req.body.password !== MOCK_DATABASE.USER.PASSWORD
    ) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Your email or password is incorrect!" });
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL,
      role: MOCK_DATABASE.USER.ROLE,
    };

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      "1h"
      // "5s"
    );

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      "14 days"
      // 15
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });

    res.status(StatusCodes.OK).json({
      ...userInfo,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const logout = async (req, res) => {
  try {
    // Xóa cookie
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(StatusCodes.OK).json({ message: "Logout API success!" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    // Cách 1: Lấy refreshToken trong cookie
    const refreshTokenFromCookie = req.cookies?.refreshToken;

    // Cách 2: Lấy từ localStorage trong body
    const refreshTokenFromBody = req.body.refreshToken;

    // Verify token
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      // refreshTokenFromBody,
      refreshTokenFromCookie,
      REFRESH_TOKEN_SECRET_SIGNATURE
    );

    // Tạo accessToken mới
    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email,
      role: refreshTokenDecoded.role,
    };
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      "1h"
      // "5s"
    );
    // Gán lại vào cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });

    // Trả về accessToken mới trong trường hợp FE cần để lưu vào localStorage
    res.status(StatusCodes.OK).json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Refresh token API failed",
    });
  }
};

export const userController = {
  login,
  logout,
  refreshToken,
};
