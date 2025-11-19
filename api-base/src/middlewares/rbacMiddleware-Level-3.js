import { StatusCodes } from "http-status-codes";
import { getPermissionsFromRole } from "~/utils/rbacUtils";

// Level 3: Nhận vào 1 mảng permissions được phép truy cập vào api
const isValidPermission = (requiredPermissions) => async (req, res, next) => {
  try {
    // console.log(req.jwtDecoded);
    // Lấy role của user trong payload decoded của jwt
    const userRoles = req.jwtDecoded.role;

    // Kiểm tra role, user bắt buộc phải có ít nhất 1 role
    if (!Array.isArray(userRoles) || userRoles.length === 0) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Forbidden: You're not allowed to access this API!",
      });
    }

    /**
     *  Dựa vào mảng userRoles của user rồi tìm tiếp trong db để lấy đầy đủ thông tin của role đó
        Đối với các thao tác cần hiệu suất cao khi duyệt qu các phần tử thì dùng Set object để tối ưu
        hiệu năng xử lý (tìm kiếm / thêm / xóa / sửa) hơn xử lý array
        Ví dụ: Array.includes() sẽ chậm O(n) nếu so với Set.has() có độ phức tạp o(1)
     *  */

    let userPermissions = new Set();
    for (const roleName of userRoles) {
      const rolePermissions = await getPermissionsFromRole(roleName);
      rolePermissions.forEach((i) => userPermissions.add(i));
    }
    console.log("userPermissions", userPermissions);
    console.log("Array.from(userPermissions)", Array.from(userPermissions));

    /**
     * Kiểm tra quyền
     * Nếu không cung cấp mảng requiredPermissions hoăc mảng requiredPermissions là rỗng thì
     * là không check quyền => luôn cho phép truy câp API
     * Hàm every luôn trả về true nếu mảng rỗng
     */

    const hasPermission = requiredPermissions?.every((item) =>
      userPermissions.has(item)
    );

    if (!hasPermission) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Forbidden: You're not allowed to access this API!",
      });
    }

    // Nếu role và permissions hợp lệ thì cho phép đi tiếp sang controller

    next();
  } catch (error) {
    console.log("Error from rbacMiddleware_Level_3:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
    });
  }
};

export const rbacMiddleware_Level_3 = {
  isValidPermission,
};
