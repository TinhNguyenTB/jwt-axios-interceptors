import { MOCK_ROLES_LEVEL_3 } from "~/models/mockDatabase-Level-3";

// Lấy tất cả permissions của 1 role của 1 user bao gồm quyền được kế thừa
export async function getPermissionsFromRole(roleName) {
  // thực tế sẽ await vào db bảng roles để lấy role
  const role = MOCK_ROLES_LEVEL_3.find((i) => i.name === roleName);
  // Nếu role không tồn tại thì trả về mảng rỗng
  if (!role) {
    return [];
  }

  let permissions = new Set(role.permissions);
  // Xử lý quyền kế thừa nếu như role có tồn tại field inherits với dữ liệu
  if (Array.isArray(role.inherits) && role.inherits.length > 0) {
    for (const inheritedRoleName of role.inherits) {
      // Đệ quy lại chính function này để lấy toàn bộ quyền kế thừa của role hiện tại
      const inheritedPermissions = await getPermissionsFromRole(
        inheritedRoleName
      );
      inheritedPermissions.forEach((i) => permissions.add(i));
    }
  }
  // trả về kế quả là một mảng các permissions nên sẽ dùng Array.from() vì permissions là Set
  return Array.from(permissions);
}
