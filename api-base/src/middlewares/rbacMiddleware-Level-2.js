import { StatusCodes } from "http-status-codes";
import { MOCK_ROLES_LEVEL_2 } from "~/models/mockDatabase-Level-2";

// Level 2: Nhận vào 1 mảng permissions được phép truy cập vào api
const isValidPermission = (requiredPermissions) => async (req, res, next) => {
  try {
    // console.log(req.jwtDecoded);
    // Lấy role của user trong payload decoded của jwt
    const userRole = req.jwtDecoded.role;

    // Kiểm tra role, nếu user không tồn tại role hoặc
    // role của user không thuộc scope role hợp lệ của api thì không cho truy cập
    if (!userRole) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Forbidden: You're not allowed to access this API!",
      });
    }

    // Dựa vào role của user rồi tìm trong db để lấy đầy đủ thông tin của role, permissions
    const fullUserRole = MOCK_ROLES_LEVEL_2.find(
      (item) => item.name === userRole
    );

    if (!fullUserRole) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Forbidden: Role not found!",
      });
    }

    /**
     * Kiểm tra quyền
     * Nếu không cung cấp mảng requiredPermissions hoăc mảng requiredPermissions là rỗng thì
     * là không check quyền => luôn cho phép truy câp API
     * Hàm every luôn trả về true nếu mảng rỗng
     */

    const hasPermission = requiredPermissions?.every((item) =>
      fullUserRole.permissions.includes(item)
    );

    if (!hasPermission) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Forbidden: You're not allowed to access this API!",
      });
    }

    // Nếu role và permissions hợp lệ thì cho phép đi tiếp sang controller
    next();
  } catch (error) {
    console.log("Error from rbacMiddleware_Level_2:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
    });
  }
};

export const rbacMiddleware_Level_2 = {
  isValidPermission,
};
