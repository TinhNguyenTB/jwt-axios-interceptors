import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "~/pages/Login";
import Dashboard from "~/pages/Dashboard";

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
      <Route path="/" element={<Navigate to="/login" replace={true} />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<UnauthorizedRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
