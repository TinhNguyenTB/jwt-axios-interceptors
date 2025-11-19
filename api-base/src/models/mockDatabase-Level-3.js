/**
 * Level 3: Group roles & Hierarchical RBAC
 * Group Roles: Một user có nhiều role
 * Hierarchical RBAC: Role có thể kế thừa lại từ role khác
 *
 *  */
export const MOCK_ROLES_LEVEL_3 = [
  {
    id: "role-client",
    name: "client",
    permissions: [
      "create_support",
      "read_support",
      "update_support",
      "delete_support",
    ],
    inherits: [], // client không kế thừa permissions từ role nào cả
  },
  {
    id: "role-moderator",
    name: "moderator",
    permissions: [
      // messages
      "create_messages",
      "read_messages",
      "update_messages",
      "delete_messages",
    ],
    inherits: ["client"], // moderator kế thừa permissions từ client
  },
  {
    id: "role-admin",
    name: "admin",
    permissions: [
      // admin_tools
      "create_admin_tools",
      "read_admin_tools",
      "update_admin_tools",
      "delete_admin_tools",
    ],
    inherits: ["client", "moderator"], // admin kế thừa permissions từ client, moderator
  },
];

export const MOCK_USER_LEVEL_3 = {
  ID: "admin-sample-id-12345678",
  EMAIL: "admin@gmail.com",
  PASSWORD: "admin",
  //   ROLES: ["client"],
  //   ROLES: ["moderator"],
  ROLES: ["admin"],
  //   ROLES: ["client", "moderator", "admin"],
};
