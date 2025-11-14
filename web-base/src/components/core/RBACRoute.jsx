import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "~/hooks/usePermission";
import { roles } from "~/config/rbacConfig";

export default function RBACRoute({
  requiredPermission,
  redirectTo = "/access-denied",
  children,
}) {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = user.role || roles.CLIENT;
  const { hasPermission } = usePermission(userRole);
  if (!hasPermission(requiredPermission)) {
    return <Navigate to={redirectTo} replace />;
  }

  // react-router-dom v6 trở lên
  return <Outlet />;

  //react-router-dom v5 trở xuống
  // return children;
}
