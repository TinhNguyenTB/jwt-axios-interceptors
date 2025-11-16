import { StatusCodes } from "http-status-codes";

// Level 1: Nhận vào allowedRoles là 1 mảng những role được phép truy cập vào api
const isValidPermission = (allowedRoles) => async (req, res, next) => {
  try {
    // console.log(req.jwtDecoded);
    // Lấy role của user trong payload decoded của jwt
    const userRole = req.jwtDecoded.role;

    // Kiểm tra role, nếu user không tồn tại role hoặc
    // role của user không thuộc scope role hợp lệ của api thì không cho truy cập
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You're not allowed to access this API!",
      });
    }

    // Nếu role hợp lệ thì cho phép đi tiếp sang controller
    next();
  } catch (error) {
    console.log("Error from rbacMiddleware_Level_1:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
    });
  }
};

export const rbacMiddleware_Level_1 = {
  isValidPermission,
};
