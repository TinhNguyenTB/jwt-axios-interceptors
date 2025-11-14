import { rolePermission } from "~/config/rbacConfig";

export const usePermission = (userRole) => {
  const hasPermission = (permission) => {
    const allowedPermissions = rolePermission[userRole] || [];
    return allowedPermissions.includes(permission);
  };
  return { hasPermission };
};
