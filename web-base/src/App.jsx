import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "~/pages/Login";
import Dashboard from "~/pages/Dashboard";
import AccessDenied from "~/pages/AccessDenied";
import NotFound from "~/pages/NotFound";
import RBACRoute from "~/components/core/RBACRoute";
import { permissions } from "~/config/rbacConfig";

const ProtectedRoutes = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }
  return <Outlet />;
};

const UnauthorizedRoutes = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (user) {
    return <Navigate to={"/dashboard"} replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<ProtectedRoutes />}>
        {/* Nếu dùng react-router-dom v5 trở xuống  */}
        {/* <Route
          path="/dashboard"
          element={
            <RBACRoute requiredPermission={permissions.VIEW_DASHBOARD}>
              <Dashboard />
            </RBACRoute>
          }
        /> */}

        {/* Nếu dùng react-router-dom v6 trở lên */}
        <Route
          element={
            <RBACRoute requiredPermission={permissions.VIEW_DASHBOARD} />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route
          element={<RBACRoute requiredPermission={permissions.VIEW_SUPPORT} />}
        >
          <Route path="/support" element={<Dashboard />} />
        </Route>

        <Route
          element={<RBACRoute requiredPermission={permissions.VIEW_MESSAGES} />}
        >
          <Route path="/messages" element={<Dashboard />} />
        </Route>

        <Route
          element={<RBACRoute requiredPermission={permissions.VIEW_REVENUE} />}
        >
          <Route path="/revenue" element={<Dashboard />} />
        </Route>

        <Route
          element={
            <RBACRoute requiredPermission={permissions.VIEW_ADMIN_TOOLS} />
          }
        >
          <Route path="/admin-tools" element={<Dashboard />} />
        </Route>
      </Route>

      <Route element={<UnauthorizedRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
