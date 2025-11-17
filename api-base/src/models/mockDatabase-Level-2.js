// Level 2: 1 user - n role
export const MOCK_ROLES_LEVEL_2 = [
  {
    id: "role-client",
    name: "client",
    permissions: [
      "create_support",
      "read_support",
      "update_support",
      "delete_support",
    ],
  },
  {
    id: "role-moderator",
    name: "moderator",
    permissions: [
      // support
      "create_support",
      "read_support",
      "update_support",
      "delete_support",
      // messages
      "create_messages",
      "read_messages",
      "update_messages",
      "delete_messages",
    ],
  },
  {
    id: "role-admin",
    name: "admin",
    permissions: [
      // support
      "create_support",
      "read_support",
      "update_support",
      "delete_support",
      // messages
      "create_messages",
      "read_messages",
      "update_messages",
      "delete_messages",
      // admin_tools
      "create_admin_tools",
      "read_admin_tools",
      "update_admin_tools",
      "delete_admin_tools",
    ],
  },
];

export const MOCK_USER_LEVEL_2 = {
  ID: "admin-sample-id-12345678",
  EMAIL: "admin@gmail.com",
  PASSWORD: "admin",
  ROLE: "moderator",
};
