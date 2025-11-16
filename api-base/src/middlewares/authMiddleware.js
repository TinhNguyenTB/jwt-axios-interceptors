import { StatusCodes } from "http-status-codes";
import {
  ACCESS_TOKEN_SECRET_SIGNATURE,
  JwtProvider,
} from "~/providers/JwtProvider";

const isAuthorized = async (req, res, next) => {
  // Cách 1: Lấy accessToken từ cookie
  const accessTokenFromCookie = req.cookies?.accessToken;
  if (!accessTokenFromCookie) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized! Token not found!",
    });
  }

  // Cách 2: Lấy accessToken từ header
  const accessTokenFromHeader = req.headers?.authorization;
  if (!accessTokenFromHeader) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized! Token not found!",
    });
  }

  try {
    // b1: Giải mã token xem có hợp lệ hay không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      // accessTokenFromCookie,
      accessTokenFromHeader.substring("Bearer ".length),
      ACCESS_TOKEN_SECRET_SIGNATURE
    );
    // console.log("accessTokenDecoded", accessTokenDecoded);

    // b2: Nếu token hợp lệ, lưu thông tin giải mã được vào req.jwtDecoded để sử dụng cho tầng xử lý phía sau
    req.jwtDecoded = accessTokenDecoded;
    next();
  } catch (error) {
    console.log("Error from authMiddleware:", error);

    // Trường hợp lỗi 1: Nếu accessToken đã hết hạn thì trả về status 410 để FE gọi API refresh
    if (error.message.includes("jwt expired")) {
      return res.status(StatusCodes.GONE).json({
        message: "Need to refresh token!",
      });
    }

    // Trường hợp lỗi 2: Nếu accessToken không hợp lệ thì trả về status 401 để FE logout
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized! Please login!",
    });
  }
};

export const authMiddleware = {
  isAuthorized,
};
