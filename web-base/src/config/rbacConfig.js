// Roles của user trong hệ thống
export const roles = {
  CLIENT: "client",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

// Permissions trong hệ thống
export const permissions = {
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_SUPPORT: "view_support",
  VIEW_MESSAGES: "view_messages",
  VIEW_REVENUE: "view_revenue",
  VIEW_ADMIN_TOOLS: "view_admin-tools",
};

// Kết hợp Role và Permission để xác định quyền hạn của user
export const rolePermission = {
  [roles.CLIENT]: [permissions.VIEW_DASHBOARD, permissions.VIEW_SUPPORT],
  [roles.MODERATOR]: [
    permissions.VIEW_DASHBOARD,
    permissions.VIEW_SUPPORT,
    permissions.VIEW_MESSAGES,
  ],
  [roles.ADMIN]: Object.values(permissions), // all permission
};
