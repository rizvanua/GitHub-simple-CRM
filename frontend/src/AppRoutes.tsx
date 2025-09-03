import { Navigate, Outlet, useRoutes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./contexts/AuthContext";

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function AppRoutes() {
  return useRoutes([
    { path: "/login", element: <AuthPage mode="login" /> },
    { path: "/register", element: <AuthPage mode="register" /> },
    {
      element: <ProtectedLayout />, // everything under here is protected
      children: [
        { index: true, element: <Dashboard /> }, // "/"
      ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);
}
